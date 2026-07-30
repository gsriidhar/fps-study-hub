---
title: "Cards & Merchant Payments"
---

# Cards & Merchant Payments



## Lessons

- [16. Cross-Border Wire Transfers in Practice](16-cross-border-wire-transfers-in-practice.md)
- [17. Card Payments Fundamentals](17-card-payments-fundamentals.md)
- [18. Visa and Mastercard: How Card Schemes Work](18-visa-and-mastercard-how-card-schemes-work.md)
- [19. Payment Gateways](19-payment-gateways.md)
- [20. Merchant Acquiring](20-merchant-acquiring.md)

## Revision summary

A cross-border wire transfer combines SWIFT messaging, correspondent banking, and local settlement into one journey, with fees allocated via OUR (sender pays everything), SHA (each side pays its own bank's fees — the common default), or BEN (beneficiary pays everything), and delays typically tracing back to incomplete data, sanctions screening, or long correspondent chains. Card payments run through the four-party model — cardholder, issuer, acquirer, merchant, connected by the scheme — moving through authorisation (instant), clearing (batched, typically daily), and settlement (funds actually move, 1-3 days later), protected by the EMV chip, PIN, contactless, and CVV. Visa and Mastercard operate that four-party model, earning a scheme fee alongside the issuer-earned interchange fee (capped by UK/EU regulation), in contrast to traditionally three-party schemes like American Express. Payment gateways securely capture and transmit online payment data — often bundled with acquiring under PayFac-style providers — using tokenisation to reduce both breach risk and PCI DSS compliance scope. Merchant acquiring underwrites and onboards merchants, charges a Merchant Service Charge built from interchange fee, scheme fee, and acquirer margin, and manages chargeback risk when a cardholder disputes a transaction through their issuer.

## Flashcards

??? question "OUR vs SHA vs BEN?"
    OUR = sender pays all fees; SHA = fees shared, each side pays their own bank's; BEN = beneficiary pays all fees.

??? question "What are the three stages of a card transaction?"
    Authorisation (instant), clearing (batched), settlement (funds move, net of fees).

??? question "Issuer vs acquirer?"
    Issuer is the cardholder's bank; acquirer is the merchant's bank.

??? question "Four-party vs three-party card model?"
    Four-party (Visa/Mastercard) keeps issuer, acquirer, and scheme separate; three-party (traditional Amex) has the scheme act as both issuer and acquirer.

??? question "Interchange fee vs scheme fee?"
    Interchange goes from acquirer to issuer; the scheme fee goes to the card network (Visa/Mastercard) itself.

??? question "What does a payment gateway do?"
    Securely captures and transmits online payment data for authorisation.

??? question "What is tokenisation?"
    Replacing sensitive card data with a non-sensitive substitute token.

??? question "What is a chargeback?"
    A reversal of a card transaction, initiated by the issuer, typically following a cardholder dispute.

??? question "What three components make up the Merchant Service Charge?"
    Interchange fee, scheme fee, and acquirer margin.

??? question "What is merchant underwriting?"
    The acquirer's risk assessment of a merchant, carried out before and during onboarding.

??? question "What is a 'lifting fee'?"
    A fee an intermediary correspondent bank deducts while processing a payment along a chain.

??? question "What does an EMV chip protect against?"
    Card cloning, by generating a unique code for every transaction rather than repeating static data.

