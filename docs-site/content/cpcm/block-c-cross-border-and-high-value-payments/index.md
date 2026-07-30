---
title: "Cross-Border & High-Value Payments"
---

# Cross-Border & High-Value Payments



## Lessons

- [11. RTGS Systems Around the World](11-rtgs-systems-around-the-world.md)
- [12. The SWIFT Messaging Network](12-the-swift-messaging-network.md)
- [13. Correspondent Banking, Nostro & Vostro](13-correspondent-banking-nostro-and-vostro.md)
- [14. SEPA — The Single Euro Payments Area](14-sepa-the-single-euro-payments-area.md)
- [15. ACH — The US Automated Clearing House](15-ach-the-us-automated-clearing-house.md)

## Revision summary

Every major economy runs its own central-bank-operated RTGS system for high-value settlement — CHAPS via the Bank of England (UK), TARGET2 (Eurozone), and Fedwire (US) are the three most commonly referenced, all settling payments individually, immediately, and finally in central bank money. SWIFT is the global messaging network connecting banks worldwide — it carries instructions like the MT103 (customer payment) and MT202 (bank-to-bank transfer), but never itself moves money, and is migrating toward the richer ISO 20022 (MX) standard. Correspondent banking bridges banks lacking a direct relationship, typically across borders, using nostro ('our account, held with you') and vostro ('your account, held with us') to describe the exact same account from two different perspectives. SEPA harmonises euro payments across roughly 36 participating countries via SCT, SCT Inst, SDD Core, and SDD B2B, identified consistently via IBAN. ACH is the US's batch payment network — governed by NACHA's rules and operated via FedACH and EPN — functioning much like Bacs but enhanced by Same Day ACH, alongside newer real-time rails like RTP and FedNow.

## Flashcards

??? question "Name three major RTGS systems and their region."
    CHAPS/BoE RTGS (UK), TARGET2 (Eurozone), Fedwire (US).

??? question "Does SWIFT move money?"
    No — it's a messaging network only; money moves separately via correspondent banking and settlement systems.

??? question "MT103 vs MT202?"
    MT103 instructs a customer payment; MT202 carries a bank-to-bank transfer, often to cover a related MT103.

??? question "Nostro vs vostro?"
    The same account, described from two perspectives: nostro is 'our account with you' (respondent's view); vostro is 'your account with us' (correspondent's view).

??? question "Name SEPA's four main payment instruments."
    SCT, SCT Inst, SDD Core, SDD B2B.

??? question "What does IBAN identify?"
    A specific bank account, in a standardised international format.

??? question "Who sets US ACH rules?"
    NACHA.

??? question "Who operates the US ACH network?"
    FedACH (Federal Reserve) and EPN (The Clearing House).

??? question "What is Same Day ACH?"
    An enhancement letting eligible ACH payments settle within the same business day.

??? question "Name two newer US real-time payment rails besides ACH."
    RTP (The Clearing House) and FedNow (Federal Reserve).

??? question "What does RTGS remove that net settlement carries?"
    Net settlement risk — the build-up of unsettled exposure between settlement points.

??? question "Why do correspondent banking chains raise AML concerns?"
    Extra intermediary banks can reduce visibility into the underlying customers behind a payment.

