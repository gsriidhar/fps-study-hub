# Faster Payments cheat sheet

<div class="cheat-page" style="--cheat-accent:#059669;" markdown="1">

Scheme-level facts about the UK's Faster Payments Service (FPS), organised for a quick lookup. For the deep dive, start at [F1: FPS fundamentals](../../fps/f1-fps-fundamentals/index.md).

<div class="cheat-grid" markdown="1">

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Scheme basics</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">What it is</span>
<p class="cheat-def">The UK's near-real-time push-payment rail, running 24 hours a day, every day of the year. Operated under Pay.UK's rules.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Speed</span>
<p class="cheat-def">Most payments clear within seconds; the scheme's operating rules give participants a short window to respond, so "instant" is really "near-instant."</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Value limit</span>
<p class="cheat-def">Scheme ceiling raised to £1,000,000 per payment. Individual participants can — and often do — set lower limits of their own, especially for personal accounts (commonly capped well below the scheme max).</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Push, not pull</span>
<p class="cheat-def">FPS is a credit-transfer scheme — the sender's bank pushes funds out. It is not used for Direct Debit collections.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Participant types</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Direct participant</span>
<p class="cheat-def">Connects straight to the central infrastructure and settles its own obligations at the Bank of England.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Indirect participant / agency bank</span>
<p class="cheat-def">Routes traffic through a direct participant (a sponsor bank), which settles on the indirect participant's behalf.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Why indirect access exists</span>
<p class="cheat-def">Direct membership is expensive and operationally heavy (24/7 obligations, liquidity requirements). Smaller banks, building societies, and fintechs usually go indirect via a sponsor.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Settlement model</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Clearing vs settlement</span>
<p class="cheat-def">Clearing (the payment message being accepted and the receiver notified) happens in near-real-time. Settlement (the actual movement of central-bank money between participants) happens separately.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Deferred net settlement</span>
<p class="cheat-def">Participants' obligations are netted and settled in scheduled cycles across the day, not transaction-by-transaction — this is what makes instant clearing possible without instant gross settlement.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Why the distinction matters operationally</span>
<p class="cheat-def">A payment can be "received" by the customer well before its underlying settlement cycle completes — which is exactly why participants carry settlement risk in between.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Confirmation of Payee (CoP)</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Purpose</span>
<p class="cheat-def">Checks that the name on an account matches the name the payer typed in, before the payment is sent — aimed at reducing misdirected payments and authorised push-payment fraud.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Possible outcomes</span>
<p class="cheat-def"><strong>Match</strong> (proceed with confidence), <strong>Close match</strong> (name is similar but not exact — shown to the payer to confirm), <strong>No match</strong> (name doesn't match the account), <strong>Unable to check</strong> (receiving institution doesn't support CoP or the account type is out of scope).</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Where it sits</span>
<p class="cheat-def">Runs before the actual payment instruction — a separate query/response exchange, not part of the pacs.008 payment message itself.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Payment lifecycle stages</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">1. Initiation</span>
<p class="cheat-def">Customer or system submits payment details through a channel (app, online banking, file upload, API).</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">2. Validation</span>
<p class="cheat-def">Sending bank checks format, mandatory fields, account status, and balance/limits before it will submit anything externally.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">3. CoP + fraud/risk screening</span>
<p class="cheat-def">Name-matching plus internal fraud rules (velocity checks, sanctions screening, anomaly detection) run before submission.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">4. Submission and scheme routing</span>
<p class="cheat-def">Message is sent to the central infrastructure, which routes it to the receiving participant (directly or via their sponsor).</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">5. Receiving-bank processing</span>
<p class="cheat-def">Receiving bank validates the incoming credit, posts to the beneficiary account, and returns an accept/reject response.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">6. Settlement</span>
<p class="cheat-def">Obligations are netted and settled in the next scheduled cycle, independent of when the customer saw the funds land.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Common rejection/return reasons</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Account closed / does not exist</span>
<p class="cheat-def">Receiving bank can't post the credit — typically comes back as a return rather than a same-second rejection.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Format / validation failure</span>
<p class="cheat-def">Missing mandatory fields, malformed sort code/account number, or a scheme-level schema violation — usually rejected immediately.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Fraud hold / risk decline</span>
<p class="cheat-def">Either side's fraud controls intervene — can result in a delay, a return, or the payment being stopped outright pending investigation.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Limit exceeded</span>
<p class="cheat-def">Payment breaches either the scheme ceiling or a participant-set limit on the sending side.</p>
</div>
</div>

</div>

## Flow diagrams

<div class="cheat-diagram" markdown="1">
![Faster Payments clearing versus settlement: payer, sending bank, FPS central infrastructure, receiving bank, and payee exchange pacs.008/pacs.002 messages that clear in seconds, while a separate deferred net settlement process nets and settles obligations between sending and receiving banks in scheduled cycles across the day.](../../assets/diagrams/fps-clearing-vs-settlement.svg)
</div>

<div class="cheat-diagram" markdown="1">
![Direct versus indirect FPS access: an indirect participant routes payment traffic through a sponsor bank, which settles on its behalf at the FPS central infrastructure, while a direct participant connects to and settles at the central infrastructure itself.](../../assets/diagrams/fps-direct-vs-indirect-access.svg)
</div>

</div>

## Other sections

[Cheat sheets home](../index.md) · [Deep dives](../../deep-dives/index.md) · [Interview prep](../../interview-prep/index.md) · [Mock exams](../../mock-exams/index.md)

Sources: [How much can I send? — Faster Payments](https://www.fasterpayments.org.uk/how-much-can-i-send-0), [£1 million Faster Payments now possible — Pay.UK](https://newseventsinsights.wearepay.uk/media-centre/press-releases/1-million-faster-payments-now-possible/)
