---
title: "Reconciliation & Architecture"
---

# Reconciliation & Architecture



## Lessons

- [22. FPS Reconciliation Fundamentals](22-fps-reconciliation-fundamentals.md)
- [23. Reconciliation Breaks](23-reconciliation-breaks.md)
- [24. Nostro & Settlement Reconciliation](24-nostro-and-settlement-reconciliation.md)
- [25. Typical Bank Architecture](25-typical-bank-architecture.md)

## Revision summary

Reconciliation compares independent records (payment processing vs settlement) to confirm completeness, accuracy, and timeliness — necessary because FPS processes instantly for the customer but settles interbank obligations in periodic cycles (deferred net settlement), creating a normal timing gap reconciliation must prove closes correctly. Reconciliation breaks fall into recognisable categories — missing transaction, amount mismatch, duplicate, status mismatch, timing difference, settlement break, reference/static data break, fraud hold/APP reimbursement break, batch/cut-over break — investigated via a consistent workflow (identify, classify, gather evidence, find root cause, correct, reconcile again, close), with distinguishing a genuine break from an expected timing difference as the key judgement call. Nostro accounts ('our account with another bank') and their settlement-account equivalents are reconciled using identical logic; direct FPS participants settle via Bank of England reserve accounts while indirect participants settle via a sponsor bank (functionally Nostro-style), with net sender caps and prefunding/collateral requirements as real operational controls tied to settlement cycle timing. A typical bank's FPS architecture runs customer channel → API layer → payment hub → fraud engine → FPS gateway → Pay.UK central infrastructure → receiving bank, with each component owned by a specific team; tier-1 banks share this logical shape but differ in implementation (merger-history banks lean on MQ/Tibco integration middleware, digital banks build cloud-native with Kafka and PostgreSQL), and the core investigation technique is always finding the last successful hand-off between components.

## Flashcards

??? question "What three things does reconciliation check at once?"
    Completeness, accuracy, and timeliness.

??? question "Why does FPS need reconciliation despite instant customer-facing settlement?"
    Interbank obligations settle in periodic cycles (deferred net settlement), not instantly per payment — reconciliation proves that gap always closes correctly.

??? question "Name the nine reconciliation break types covered."
    Missing transaction, amount mismatch, duplicate transaction, status mismatch, timing difference, settlement break, reference/static data break, fraud hold/APP reimbursement break, batch/cut-over break.

??? question "What's the key judgement call in break investigation?"
    Distinguishing a genuine break from an expected timing difference relative to the settlement calendar, before escalating.

??? question "What is a Nostro account?"
    An account a bank holds with another institution to manage funds — 'our account with another bank.'

??? question "How do direct vs indirect FPS participants settle?"
    Direct: via their own Bank of England reserves/settlement account. Indirect: via a sponsor bank — functionally Nostro-style reconciliation.

??? question "What is a net sender cap?"
    A scheme-imposed limit on the maximum net exposure one participant can build up against others between settlement cycles.

??? question "What's the standard FPS architecture chain?"
    Customer channel → API layer → payment hub → fraud engine → FPS gateway → Pay.UK central infrastructure → receiving bank.

??? question "What is the payment hub's role?"
    Central processing engine — validation, status management through the lifecycle, routing, exception handling.

??? question "What's the core architecture investigation technique?"
    Find the last successful hand-off between components — the failure usually sits just after that point.

??? question "Why do merger-history banks lean on integration middleware like Tibco/MQ?"
    To bridge previously separate legacy technology estates inherited through mergers, rather than replacing them outright.

