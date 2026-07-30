---
title: "Modern Infrastructure"
---

# Modern Infrastructure



## Lessons

- [26. The ISO 20022 Messaging Standard](26-the-iso-20022-messaging-standard.md)
- [27. Open Banking Overview](27-open-banking-overview.md)
- [28. APIs in Payments](28-apis-in-payments.md)
- [29. Payment Fraud Types & Prevention](29-payment-fraud-types-and-prevention.md)
- [30. Anti-Money Laundering (AML)](30-anti-money-laundering-aml.md)

## Revision summary

ISO 20022 is a global, structured, XML-based messaging standard replacing legacy MT-style formats, improving data richness, straight-through processing, and fraud/AML screening across payments, RTGS platforms, and domestic schemes. Open Banking, driven by PSD2, enables secure, consent-based data sharing (via AISPs) and direct payment initiation (via PISPs) by authorised third parties, protected by Strong Customer Authentication. APIs are the technical mechanism underneath much of this — enabling real-time, on-demand interaction, secured by OAuth and encryption, in place of older batch file-based integration. Payment fraud splits into unauthorised fraud (a criminal initiates the payment without consent) and Authorised Push Payment fraud (the genuine account holder is deceived into authorising it themselves) — prevention combines Confirmation of Payee, transaction monitoring, and customer education. AML controls combat money laundering's three stages — placement, layering, integration — through Customer Due Diligence, ongoing transaction monitoring, and Suspicious Activity Report filing, all without ever tipping off the customer involved.

## Flashcards

??? question "What does ISO 20022 improve over legacy MT messages?"
    Data richness, structured fields, and better straight-through processing and screening.

??? question "What regulation drove Open Banking in the EU/UK?"
    PSD2.

??? question "AISP vs PISP?"
    An AISP views/aggregates account data; a PISP initiates payments directly from the account.

??? question "What security standard secures API access without sharing passwords?"
    OAuth.

??? question "Unauthorised fraud vs APP fraud?"
    Unauthorised fraud: the criminal initiates the payment without consent. APP fraud: the genuine account holder is deceived into authorising it themselves.

??? question "What UK tool helps prevent misdirected or fraudulent payments by checking names?"
    Confirmation of Payee.

??? question "What are the three stages of money laundering, in order?"
    Placement, Layering, Integration.

??? question "What is a SAR?"
    A Suspicious Activity Report, filed with the relevant authority (the National Crime Agency in the UK).

??? question "What is 'tipping off'?"
    Illegally alerting a customer that they're under suspicion or that a SAR has been filed about them.

??? question "What AML obligation happens before and during onboarding a customer?"
    Customer Due Diligence, also called KYC.

??? question "What data format does ISO 20022 use for its messages?"
    XML-based structured data.

??? question "Why is APP fraud historically harder to reverse than unauthorised fraud?"
    Because the payment was genuinely authorised by the account holder, complicating a straightforward reversal.

