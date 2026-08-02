---
title: "FPS Fundamentals"
---

# FPS Fundamentals



## Lessons

- [1. What Is Faster Payments (FPS)?](01-what-is-faster-payments-fps.md)
- [2. The FPS Ecosystem: Who Owns Each Stage](02-the-fps-ecosystem-who-owns-each-stage.md)
- [3. Direct vs Indirect Access](03-direct-vs-indirect-access.md)
- [4. Payment Initiation](04-payment-initiation.md)
- [5. Validation Rules](05-validation-rules.md)

## Revision summary

FPS is the UK's real-time, 24/7 bank-to-bank payment scheme, run by Pay.UK, built to close the gap between slow Bacs and expensive CHAPS. A payment crosses several owners — channel, sending bank, fraud/risk systems, payment hub, FPS gateway, Pay.UK, receiving bank — and most investigations start by asking where the payment is now and who owns that stage. Banks can be direct participants (own FPS connection) or indirect (via a sponsor bank); processing and settlement are separate concepts. Every payment starts as an initiated instruction with a unique ID and status, then passes five validation categories — mandatory fields, sort code, account number (incl. modulus check), amount/limits, and account status — before it can reach FPS at all.

<div class="flow-diagram" data-flow="radial" markdown="0">
<script type="application/json">
{
  "eyebrow": "F1 · FPS Fundamentals",
  "title": "Getting a payment ready for FPS",
  "ariaLabel": "Radial diagram summarising F1: direct vs indirect access, payment initiation, and validation rules.",
  "center": {
    "label": "Before FPS is even contacted"
  },
  "spokes": [
    {
      "label": "Direct vs indirect access",
      "facts": [
        "Direct: own FPS connection + gateway",
        "Indirect: reaches FPS via a sponsor bank"
      ]
    },
    {
      "label": "Payment initiation",
      "facts": [
        "Customer submits → instruction gets an ID + status",
        "No money moves yet; FPS not contacted"
      ]
    },
    {
      "label": "Validation rules",
      "facts": [
        "5 checks: fields, sort code, account, limits, balance",
        "Outcome: Pass / Reject / Hold / Repair"
      ]
    }
  ]
}
</script>
</div>

## Flashcards

??? question "What problem was FPS designed to solve?"
    The gap between slow, cheap Bacs (~3 days) and fast, expensive CHAPS — consumers needed a fast, low-cost, 24/7 option.

??? question "What does Pay.UK do, and not do?"
    Sets scheme rules and routes messages; does not hold customer money or decide individual fraud outcomes.

??? question "What are the four standard FPS investigation questions?"
    Where is the payment now? Who owns that stage? What was the last successful step? What evidence do we have?

??? question "Direct vs indirect participant?"
    Direct = own FPS connection/gateway. Indirect = accesses FPS via a sponsor bank.

??? question "What does a sponsor bank provide?"
    Connectivity, message routing, settlement support, and often operational support to indirect participants.

??? question "Processing vs settlement?"
    Processing = the real-time send/receive/credit of one payment. Settlement = periodically netting obligations between institutions.

??? question "What is created the instant a customer submits a payment?"
    A payment instruction with a unique payment ID and an initial status (e.g. RECEIVED).

??? question "Name the five validation categories."
    Mandatory fields, sort code, account number (incl. modulus check), amount/limits, customer account status/balance.

??? question "What does a modulus check catch?"
    Mistyped sort code/account number combinations that a basic format check would miss.

??? question "If a payment failed validation, has it reached FPS?"
    No — a validation reject happens before the payment is ever submitted to the scheme.

