---
title: "Checks, Submission & Settlement"
---

# Checks, Submission & Settlement



## Lessons

- [6. Confirmation of Payee (CoP)](06-confirmation-of-payee-cop.md)
- [7. Fraud & Risk Controls](07-fraud-and-risk-controls.md)
- [8. FPS Submission](08-fps-submission.md)
- [9. Receiving Bank Processing](09-receiving-bank-processing.md)
- [10. Settlement & Reconciliation](10-settlement-and-reconciliation.md)

## Revision summary

Confirmation of Payee checks the beneficiary name before submission and returns Match, Close Match, No Match, or Unable to Check — a warning system, not an automatic block. Fraud and risk controls (APP fraud detection, velocity checks, mule detection, AML, sanctions screening) can hold or reject a technically valid payment based on risk signals. Submission moves the payment through the bank's payment hub and FPS gateway to Pay.UK — but 'accepted by FPS' only confirms routing, not that the beneficiary has been paid. The receiving bank then validates the destination account and either credits it (rejecting first if invalid) or, in rarer cases, returns it after the fact. Finally, settlement (via Bank of England RTGS) squares up net obligations between banks separately from customer-facing processing, and reconciliation proves the bank's internal, FPS, and settlement records all agree.

<div class="flow-diagram" data-flow="radial" markdown="0">
<script type="application/json">
{
  "eyebrow": "F2 · Checks, Submission & Settlement",
  "title": "From validated payment to settled obligation",
  "ariaLabel": "Radial diagram summarising F2: Confirmation of Payee, fraud and risk controls, FPS submission, receiving-bank processing, and settlement and reconciliation.",
  "center": {
    "label": "Checks, submission & settlement"
  },
  "spokes": [
    {
      "label": "Confirmation of Payee",
      "facts": [
        "Match / Close Match / No Match / Unable to Check",
        "No Match is a warning, not an automatic block"
      ]
    },
    {
      "label": "Fraud & risk controls",
      "facts": [
        "Velocity checks, mule detection, AML, sanctions",
        "Risk score → Approve / Hold / Reject / Step-up"
      ]
    },
    {
      "label": "FPS submission",
      "facts": [
        "Payment hub routes + formats the message",
        "'Accepted by FPS' only confirms routing"
      ]
    },
    {
      "label": "Receiving-bank processing",
      "facts": [
        "Technical, duplicate + account checks first",
        "Reject before credit; Return after credit"
      ]
    },
    {
      "label": "Settlement & reconciliation",
      "facts": [
        "Processing (instant) vs settlement (BoE RTGS)",
        "Reconciliation compares 3 record sets"
      ]
    }
  ]
}
</script>
</div>

## Flashcards

??? question "Name the four CoP outcomes."
    Match, Close Match, No Match, Unable to Check.

??? question "Does a CoP No Match always block a payment?"
    No — it's a warning; the customer may often still proceed depending on bank policy.

??? question "What makes APP fraud hard to detect technically?"
    The genuine customer authorises the payment themselves after being deceived — everything checks out technically.

??? question "What does a velocity check look for?"
    Unusual payment frequency or volume compared to the customer's normal pattern.

??? question "What does the payment hub do before submission?"
    Routes the payment, formats it into an FPS message, and logs identifiers for tracking.

??? question "Does 'accepted by FPS' mean the beneficiary was paid?"
    No — it only confirms valid format and successful routing; crediting is a separate, later step.

??? question "Rejection vs return?"
    Rejection happens before acceptance (never credited); return happens after acceptance (credited, then reversed).

??? question "What does the receiving bank check before crediting?"
    Account existence, status, restrictions, and duplicate detection.

??? question "Processing vs settlement?"
    Processing is the customer-facing transfer; settlement is banks squaring up net obligations, via RTGS in the UK.

??? question "What is a reconciliation break?"
    A mismatch between internal, FPS, and settlement records — e.g. missing transaction, amount or timing difference, duplicate.

