# Testing tools cheat sheet (payments-focused)

<div class="cheat-page" style="--cheat-accent:#0d9488;" markdown="1">

Syntax and patterns for the tools most commonly used to test payment flows: Selenium, Playwright, SoapUI, and REST API clients. For the broader testing approach, see [F7: Testing FPS](../../fps/f7-testing-fps/index.md).

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Selenium (Python) — driving a payment form</p>

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import timedelta

driver = webdriver.Chrome()
driver.implicitly_wait(timedelta(seconds=5))  # Selenium 4: Duration, not raw seconds

driver.get("https://payments.example.internal/new")

# By-based locators — prefer stable attributes over CSS structure
wait = WebDriverWait(driver, timedelta(seconds=10))
sender = wait.until(EC.presence_of_element_located((By.ID, "sender-account")))
sender.send_keys("10023456")

driver.find_element(By.ID, "receiver-account").send_keys("20098765")
driver.find_element(By.ID, "amount").send_keys("250.00")
driver.find_element(By.ID, "submit-payment").click()

# Wait for the exact next state, not a fixed sleep
confirmation = wait.until(
    EC.text_to_be_present_in_element((By.ID, "status-banner"), "Payment submitted")
)
```

```python
# Explicit wait for an element to disappear (e.g. a loading spinner)
wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "spinner")))

# FluentWait-style pattern: poll with a custom condition and ignored exceptions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import NoSuchElementException

fluent_wait = WebDriverWait(
    driver, timeout=timedelta(seconds=20),
    poll_frequency=timedelta(milliseconds=500),
    ignored_exceptions=[NoSuchElementException],
)
fluent_wait.until(lambda d: d.find_element(By.ID, "status-banner").is_displayed())
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Playwright (Python) — same flow, auto-waited</p>

```python
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()  # fresh, isolated context per test
    page.goto("https://payments.example.internal/new")

    # getByRole is the recommended locator strategy — resilient to markup changes
    page.get_by_label("Sender account").fill("10023456")
    page.get_by_label("Receiver account").fill("20098765")
    page.get_by_label("Amount").fill("250.00")
    page.get_by_role("button", name="Submit payment").click()

    # Web-first assertion: retries automatically until it passes or times out
    expect(page.get_by_text("Payment submitted")).to_be_visible()
    expect(page.get_by_role("button", name="Submit payment")).to_be_disabled()

    browser.close()
```

```python
# Waiting on a network response directly — useful when the UI lags the API
with page.expect_response(lambda r: "/api/payments" in r.url and r.status == 201) as resp_info:
    page.get_by_role("button", name="Submit payment").click()
response = resp_info.value
assert response.json()["status"] == "SUBMITTED"
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">SoapUI — Groovy assertions on a payment SOAP response</p>

```groovy
// Script Assertion (runs inside a test step; exposes log, context, messageExchange)
import groovy.xml.XmlSlurper

def response = new XmlSlurper().parseText(messageExchange.response.responseContent)
def status = response.'**'.find { it.name() == 'Status' }?.text()

assert status == 'ACSC', "Expected ACSC (accepted/settled) but got ${status}"
log.info("pacs.002 status check passed: ${status}")
```

```groovy
// Groovy Script test step (exposes log, context, testRunner — not messageExchange)
import groovy.json.JsonSlurper

def rawResponse = testRunner.testCase.getTestStepByName("Get Payment Status").getPropertyValue("Response")
def json = new JsonSlurper().parseText(rawResponse)

if (json.status != 'COMPLETED') {
    testRunner.fail("Payment ${json.paymentId} not completed: status was ${json.status}")
}

// Pass a value forward to the next test step via context
context.setProperty("lastPaymentId", json.paymentId)
```

```xml
<!-- Typical pacs.008-style request fragment used as a SoapUI test step template -->
<pacs:FIToFICstmrCdtTrf xmlns:pacs="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <GrpHdr>
    <MsgId>${=java.util.UUID.randomUUID()}</MsgId>
    <CreDtTm>${=new Date().format("yyyy-MM-dd'T'HH:mm:ss")}</CreDtTm>
  </GrpHdr>
</pacs:FIToFICstmrCdtTrf>
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">REST API testing — curl, pytest, and Postman-style checks</p>

```bash
# Quick manual check with curl
curl -s -X POST https://api.example.internal/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"senderAccount":"10023456","receiverAccount":"20098765","amount":250.00}' \
  | jq '.status'
```

```python
# pytest + requests — the equivalent as an automated test
import requests

def test_payment_submission_returns_pending(auth_token):
    response = requests.post(
        "https://api.example.internal/payments",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"senderAccount": "10023456", "receiverAccount": "20098765", "amount": 250.00},
        timeout=10,
    )
    assert response.status_code == 201
    body = response.json()
    assert body["status"] in ("PENDING", "SUBMITTED")
    assert "paymentId" in body

def test_payment_status_lookup(auth_token, submitted_payment_id):
    response = requests.get(
        f"https://api.example.internal/payments/{submitted_payment_id}",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    assert response.json()["paymentId"] == submitted_payment_id
```

```javascript
// Postman test script (runs in the "Tests" tab against pm.response)
pm.test("Status code is 201", () => pm.response.to.have.status(201));

pm.test("Response has a payment ID and pending status", () => {
    const body = pm.response.json();
    pm.expect(body).to.have.property("paymentId");
    pm.expect(["PENDING", "SUBMITTED"]).to.include(body.status);
});

pm.test("Response time is under 500ms", () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

</div>

<div class="cheat-grid" markdown="1">

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">When to reach for which</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Selenium</span>
<p class="cheat-def">Mature, wide browser/language support. Best where an existing suite already uses it, or where a specific driver/grid setup is required.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Playwright</span>
<p class="cheat-def">Newer, faster, built-in auto-waiting and network interception. A strong default choice for new UI test suites.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">SoapUI</span>
<p class="cheat-def">Purpose-built for SOAP/XML services — still common where legacy payment interfaces speak SOAP rather than REST.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">REST clients (curl/Postman/pytest)</span>
<p class="cheat-def">The default for modern JSON payment APIs — curl/Postman for exploratory checks, pytest for anything that needs to run in CI.</p>
</div>
</div>

</div>

</div>

## Other sections

[Cheat sheets home](../index.md) · [Deep dives](../../deep-dives/index.md) · [Interview prep](../../interview-prep/index.md) · [Mock exams](../../mock-exams/index.md)
