---
title: "Payment Participants"
lesson_number: 3
track: "CPCM curriculum"
block: "Foundations"
tags: ["Foundations", "Payment Participants"]
summary: "Identify the roles of payer, payee, issuing bank, acquiring bank, correspondent bank, scheme operator, and regulator; understand how these roles interact in a transaction."
---
[CPCM curriculum](../index.md) / [Foundations](index.md) &middot; Lesson 3 of 40
{: .lesson-crumbs}

# 3. Payment Participants

!!! abstract "Learning objective"
    Identify the roles of payer, payee, issuing bank, acquiring bank, correspondent bank, scheme operator, and regulator; understand how these roles interact in a transaction.

## Core concepts

Every payment has a cast of characters, even if you only see two of them. Behind the scenes: the payer instructs their bank (the originating/sending bank) to send money. That bank passes the instruction through a scheme to the receiving/beneficiary bank, which credits the payee. If the payment crosses borders or currencies, one or more correspondent banks may sit in the middle, acting as intermediaries that hold accounts for each other.

In card payments the roles have special names: the issuer (the cardholder's bank, which issued the card) and the acquirer (the merchant's bank, which "acquires" the transaction on the merchant's behalf).

## Visual overview

```mermaid
flowchart LR
  S0["Payer"]
  S1["Originating bank"]
  S0 --> S1
  S2["Correspondent bank A"]
  S1 --> S2
  S3["Correspondent bank B"]
  S2 --> S3
  S4["Beneficiary bank"]
  S3 --> S4
  S5["Payee"]
  S4 --> S5
```

## Key terms

**Payer / Originator**
:   The person or entity sending money.

**Payee / Beneficiary**
:   The person or entity receiving money.

**Originating / Sending bank**
:   The payer's bank, which sends the payment instruction.

**Beneficiary / Receiving bank**
:   The payee's bank, which receives and credits the funds.

**Correspondent bank**
:   A bank that provides banking services to another bank, often across borders (Lesson 13).

**Issuer**
:   In card payments, the bank that issued the cardholder's card.

**Acquirer**
:   In card payments, the bank that provides payment processing services to the merchant.

**Scheme operator**
:   The organisation running the scheme's rules and infrastructure (e.g. Pay.UK for Bacs/Faster Payments, Visa Inc. for Visa).

## Worked example

!!! example
    When you tap your Barclays debit card at Tesco, Barclays is the issuer, Tesco's acquiring bank/PSP is the acquirer, and Mastercard/Visa is the scheme operator connecting the two. For a wire from a UK company to a US supplier, Barclays may not hold a direct USD account with the supplier's bank, so it uses a correspondent bank in New York to complete the chain.

## Comparison

**Bank-transfer roles vs card roles**

| Bank transfer role | Card equivalent | Function |
|---|---|---|
| Originating bank | Issuer | Represents the payer / cardholder |
| Beneficiary bank | Acquirer | Represents the payee / merchant |
| Scheme (Bacs, SWIFT) | Scheme (Visa, Mastercard) | Provides rules & infrastructure |
| Correspondent bank | No direct equivalent | Bridges banks without direct relationships |

## Key points

- Every payment has at least a payer, payee, and their respective banks.
- Correspondent banks bridge banks with no direct relationship, common cross-border.
- In cards, issuer ≠ acquirer — opposite sides of the transaction.
- Scheme operators provide the rulebook and infrastructure, not the money itself.

## Exam & interview tips

!!! tip
    - Issuer = cardholder's bank; Acquirer = merchant's bank — very frequently tested, don't mix them up.
    - Expect scenario questions asking you to label each participant in a described transaction.

!!! note "Memory trick"
    Issuer = I hold your card. Acquirer = Acquires the merchant's business. Also: "A for Acquirer, A for the store (Acceptance point)."

## Scenario questions

??? question "A customer's card payment at a French shop is approved instantly. Name the issuer and acquirer."
    Issuer = the customer's home bank (issued the card); Acquirer = the French shop's acquiring bank/PSP.

??? question "A UK-to-Kenya payment passes through banks in London and New York first. Why?"
    The UK and Kenyan banks lack a direct account relationship in the required currency, so correspondent banks bridge the gap (likely USD).

??? question "List all participants for a Faster Payments transfer between two UK current accounts."
    Payer, originating bank, Pay.UK (scheme operator), beneficiary bank, payee.

??? question "Why might mixing up 'issuer' and 'acquirer' cause a real operational error?"
    Dispute/chargeback processes, fee liability and communication routes differ by side; misrouting a query wastes time and can breach SLAs.

??? question "Explain correspondent banking to a beginner using an analogy."
    Like sending a parcel overseas via a courier's local depot when you have no direct relationship with the destination postal service.

## Practice questions

??? question "1. The 'acquirer' in a card transaction represents:"
    ▫️ The cardholder
    ✅ The merchant
    ▫️ The regulator
    ▫️ The card manufacturer

??? question "2. The 'issuer' in a card transaction is:"
    ▫️ The merchant's bank
    ✅ The cardholder's bank
    ▫️ The scheme
    ▫️ The regulator

??? question "3. A correspondent bank is needed when:"
    ✅ Two banks share no direct account relationship, especially cross-border
    ▫️ A payment is under £10
    ▫️ Only for card payments
    ▫️ Only within the same country

??? question "4. Pay.UK is the scheme operator for:"
    ▫️ SWIFT
    ✅ Bacs and Faster Payments
    ▫️ Visa
    ▫️ SEPA

??? question "5. The 'beneficiary bank' is equivalent to which card-payment role?"
    ▫️ Issuer
    ✅ Acquirer
    ▫️ Scheme
    ▫️ Regulator

??? question "6. Who initiates a payment instruction?"
    ▫️ The beneficiary bank
    ✅ The payer/originator
    ▫️ The regulator
    ▫️ The scheme operator

??? question "7. Which organisation operates the Visa scheme rules?"
    ▫️ Pay.UK
    ✅ Visa Inc.
    ▫️ SWIFT
    ▫️ Bank of England

??? question "8. Two correspondent banks in the chain suggests:"
    ▫️ A simple domestic transfer
    ✅ A cross-border payment with no direct bank relationship
    ▫️ A card refund
    ▫️ A cheque deposit

??? question "9. Which best matches 'originating bank'?"
    ✅ Sends the payment instruction on behalf of the payer
    ▫️ Always the largest bank
    ▫️ Always based abroad
    ▫️ Regulates the scheme

??? question "10. Does the scheme operator physically move the money?"
    ▫️ True
    ✅ False — schemes set rules/infrastructure; settlement moves the money
    ▫️ Only for card schemes
    ▫️ Only for SWIFT


<div class="lesson-pager" markdown="1">
<div markdown="1">
<span class="label">Previous</span>
[&larr; 2. The Payments Ecosystem Overview](02-the-payments-ecosystem-overview.md)
</div>

<div class="next" markdown="1">
<span class="label">Next</span>
[4. Types of Payments &rarr;](04-types-of-payments.md)
</div>
</div>
