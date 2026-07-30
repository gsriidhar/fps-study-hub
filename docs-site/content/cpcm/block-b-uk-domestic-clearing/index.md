---
title: "UK Domestic Clearing"
---

# UK Domestic Clearing



## Lessons

- [6. Clearing and Settlement Basics](06-clearing-and-settlement-basics.md)
- [7. UK Payment Systems Overview](07-uk-payment-systems-overview.md)
- [8. Bacs Deep Dive](08-bacs-deep-dive.md)
- [9. Faster Payments Deep Dive](09-faster-payments-deep-dive.md)
- [10. CHAPS Deep Dive](10-chaps-deep-dive.md)

## Revision summary

Clearing calculates what banks owe each other; settlement is the separate, final act of actually moving that money, and settlement finality is the specific legal point after which a payment can no longer be undone. UK settlement splits into net (batching many transactions and settling only the difference, used by Bacs over a 3-day cycle) and gross (settling each transaction individually and instantly, used by CHAPS via the Bank of England's RTGS platform). Faster Payments sits in between conceptually — technically a net settlement system, like Bacs, but settled many times a day rather than once every three, which is what produces its near-instant customer experience, backed by Confirmation of Payee to catch misdirected and fraudulent payments. Bacs itself carries Direct Credit (push) and Direct Debit (pull, protected by the Direct Debit Guarantee) through its fixed input-processing-settlement rhythm. CHAPS, the most expensive but most certain of the UK systems, is reserved for high-value, time-critical payments like property completions, where same-day, irrevocable finality in central bank money is worth paying for.

## Flashcards

??? question "What's the core difference between clearing and settlement?"
    Clearing calculates obligations between banks; settlement is the final, actual transfer of funds that discharges them.

??? question "Net settlement vs gross settlement?"
    Net batches and nets transactions periodically; gross settles each transaction individually and instantly.

??? question "What is settlement finality?"
    The specific legal point at which a payment can no longer be reversed, even if the paying bank later fails.

??? question "Who operates Bacs, Faster Payments, and the Image Clearing System?"
    Pay.UK.

??? question "What underpins CHAPS settlement?"
    The Bank of England's Real-Time Gross Settlement (RTGS) infrastructure.

??? question "What are the three stages of the Bacs cycle?"
    Input (Day 1), Processing (Day 2), Settlement (Day 3).

??? question "Direct Credit vs Direct Debit?"
    Direct Credit is a payer-initiated push payment; Direct Debit is a payee-initiated pull payment under a signed mandate.

??? question "What protects UK Direct Debit payers specifically?"
    The Direct Debit Guarantee — an immediate refund for an incorrect amount or date.

??? question "Is Faster Payments a real-time gross settlement system?"
    No — it's net settlement, just settled many times a day rather than once every three days like Bacs.

??? question "What does Confirmation of Payee check?"
    Whether the destination account name matches what the payer entered, to reduce misdirected/fraudulent payments.

??? question "What settlement model does CHAPS use?"
    Real-time gross settlement (RTGS), in Bank of England central bank money.

??? question "What is CHAPS' classic real-world use case?"
    Same-day, high-value, time-critical payments — most famously, house purchase completions.

