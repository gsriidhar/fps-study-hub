---
title: "Glossary"
---

# Payments & FPS glossary

## Cards

**Authorization**
:   The real-time approval or decline of a transaction based on balance, fraud checks, and trust, before settlement occurs.

**Four-party card model**
:   The standard model for card payments involving the cardholder, merchant, issuer, and acquirer, linked by a card network. Authorization happens in under two seconds; settlement happens later.

**Interchange fee**
:   The portion of the merchant fee paid to the card issuer on each transaction.

**Scheme fee**
:   The fee charged by the card network (e.g. Visa, Mastercard) for routing and rules.

**Settlement (cards)**
:   The actual movement/transfer of funds between parties, which happens after authorization — often the next business day for cards.

**Three-party model**
:   A card model where one company plays multiple roles (e.g. American Express acts as both issuer and acquirer).

**Tokenization**
:   Replacing sensitive card/account data with a secure token so the real credentials are never exposed, used in Apple Pay, card-on-file, and wallets.

## Cross-border

**Correspondent banking**
:   A network of interbank relationships used to route cross-border payments when two banks lack a direct connection, via a correspondent bank holding pre-funded accounts.

**Correspondent chain**
:   The sequence of 2-4 intermediary banks a cross-border payment may pass through, each adding fees, delay, and risk.

**Cross-border payment**
:   A payment sent between parties in different countries, subject to fragmented infrastructure, FX conversion, and multiple regulatory regimes — typically slower and costlier than domestic. Average remittance fee is ~6.2% (World Bank).

**FX margin**
:   The spread a bank or PSP earns by converting currency at a rate less favourable than the market/interbank rate.

**KYC / AML**
:   Know Your Customer / Anti-Money Laundering — compliance checks performed on parties and transactions to detect fraud, sanctions issues, and financial crime.

**Nostro account**
:   An account a bank holds in a foreign currency at a partner (correspondent) bank abroad — "our money, held by you".

**Sanctions screening**
:   Automated checks that flag transactions or parties matching government sanctions lists, required at multiple points in a cross-border chain.

**Vostro account**
:   The same account viewed from the correspondent bank's side — "your money, held by us".

## Domestic rails

**ACH (Automated Clearing House)**
:   Batch-based domestic rail used in the US. Cheap and reliable but not instant; settlement can take 1-3 business days.

**BACS**
:   UK batch-based domestic payment rail, similar in purpose to ACH.

**Domestic payment rail**
:   National infrastructure (often run by a central bank or clearing house) that moves money within a currency zone, e.g. salary deposits, bill payments.

**Faster Payments**
:   UK real-time domestic payment rail; funds settle within seconds, 24/7.

**FedNow**
:   The US Federal Reserve's real-time payment rail, launched to modernise domestic settlement, powered by ISO 20022.

**NPP (New Payments Platform)**
:   Australia's real-time domestic payment rail, notable for PayID addressing and native ISO 20022 messaging.

**PayID**
:   Australian NPP feature letting users receive payments via a phone number or email instead of a bank account number.

**RTGS (Real-Time Gross Settlement)**
:   System used for high-value interbank transfers, settled individually and immediately — not used for everyday consumer payments.

**SEPA (Single Euro Payments Area)**
:   EU framework enabling standardized euro-denominated domestic and cross-border transfers within the region.

## Ecosystem

**Closed-loop system**
:   A payment network where the provider manages the entire transaction end-to-end on one platform (e.g. PayPal, M-Pesa). Faster but less flexible.

**EMI (E-Money Institution)**
:   Regulated entity that issues and manages e-money, holding customer funds 1:1 in safeguarded accounts. Cannot lend or take deposits. Examples: Wise, Revolut.

**MSB (Money Services Business)**
:   Specialises in money transmission and remittances, often via local agents in cash-heavy or underbanked markets. Earns via FX margins and flat fees. Example: Western Union.

**Open-loop system**
:   A payment network involving multiple independent institutions (e.g. Visa, SWIFT). More interoperable, more parties involved.

**Payment fluency**
:   The ability to understand which rails were used, who earned fees, and how messages flowed through a transaction — a core skill for product, strategy, compliance, and operations roles.

**Payments ecosystem**
:   The full infrastructure of rails, protocols, and institutions that enable money movement, from a $5 coffee to a $5 million wire. Over $140 trillion moves through global payment systems annually.

**PSP (Payment Service Provider)**
:   Non-bank interface layer between merchants and the payments ecosystem. Handles onboarding, tokenization, fraud screening, payouts, and reconciliation. Cannot hold customer funds like a bank; monetizes via processing fees. Examples: Stripe, Adyen.

## ISO 20022

**camt.026**
:   ISO 20022 message used to request missing or additional information on a payment (an investigation request).

**camt.029**
:   ISO 20022 message for resolving payment investigations/exceptions.

**camt.053**
:   ISO 20022 bank-to-customer statement message — the modern replacement for MT940, used for reconciliation.

**camt.058**
:   ISO 20022 notification message for non-settlement / cancellation of a payment.

**CBPR+**
:   SWIFT's initiative to roll out ISO 20022 for cross-border and correspondent banking messages.

**ISO 20022**
:   A global standard for structured, machine-readable XML payment messaging, replacing legacy MT formats. Used natively by SWIFT CBPR+, TARGET2, CHAPS, SEPA, RTP, FedNow, and NPP.

**LEI (Legal Entity Identifier)**
:   A unique global ID for legal entities involved in financial transactions, increasingly required in ISO 20022 messages for transparency.

**pacs.002**
:   ISO 20022 payment status report message, used to communicate the outcome (accepted/rejected) of a payment.

**pacs.004**
:   ISO 20022 payment return message, used when funds need to be sent back.

**pacs.008**
:   ISO 20022 message for a customer credit transfer (settlement) — the modern replacement for MT103.

**pain**
:   ISO 20022 message family for payment initiation (customer-to-bank instructions).

**Purpose code**
:   A structured ISO 20022 field indicating why a payment is being made, enabling automated screening and validation.

## Modern & emerging

**CBDC (Central Bank Digital Currency)**
:   A digital form of a country's fiat currency issued directly by its central bank — an emerging use case enabled by ISO 20022's structured data model.

**Digital wallet**
:   An app-based interface (e.g. Apple Pay, Venmo, Alipay) that stores payment credentials, loyalty, and identity, abstracting the underlying rail from the user.

**Embedded payments**
:   Payment functionality built directly into a non-financial app or platform (e.g. paying inside a ride-share app), removing the traditional "checkout" step.

**Real-time payment**
:   A payment that settles instantly and irrevocably, 24/7, as opposed to batch-based settlement. Examples: Faster Payments (UK), NPP (Australia), FedNow (US), SEPA Instant (EU).

**Stablecoin**
:   A crypto-native asset pegged to a fiat currency, used as an emerging alternative payment rail (e.g. via Stellar, Lightning Network).

## Operations

**Break**
:   A mismatch found during reconciliation, e.g. between a ledger and a bank statement, that must be investigated and resolved.

**Exception**
:   Any payment that deviates from its expected lifecycle and requires manual intervention (e.g. failed screening, wrong beneficiary details, fee mismatch).

**Reconciliation**
:   The process of verifying that a payment occurred as intended by comparing expected transactions against actual system/bank records.

**STP (Straight-Through Processing)**
:   The proportion of payments that flow from initiation to settlement with no human intervention. Domestic/on-us payments often achieve 95-98% STP; cross-border typically 80-90%.

**STP rate**
:   A key operational KPI: higher STP means lower cost-to-serve, faster settlement, and less manual exception handling.

## Regulation

**CDR (Consumer Data Right)**
:   Australia's equivalent framework enabling customers to control and share their financial data.

**Open Banking**
:   Regulatory framework (e.g. UK) requiring banks to let customers share financial data and initiate payments via third-party APIs.

**PSD2 (Payment Services Directive 2)**
:   EU regulation that mandated Open Banking-style data sharing and strong customer authentication.

## SWIFT

**MT103**
:   The legacy SWIFT message type for a single customer cross-border payment instruction. Being replaced by ISO 20022's pacs.008.

**MT199 / MT192 / MT195**
:   Legacy free-text SWIFT messages historically used to investigate or query payment exceptions — unstructured and manual, now being replaced by structured ISO 20022 case messages.

**MT202**
:   SWIFT message type used to move interbank liquidity (bank-to-bank funding), separate from the underlying customer payment.

**MT202 COV**
:   A variant of MT202 that includes underlying customer details, enabling compliance/AML screening mid-chain.

**MT940**
:   End-of-day SWIFT statement message confirming account balances and transaction line items — used for reconciliation. Being replaced by ISO 20022's camt.053.

**SWIFT**
:   A global secure messaging network banks use to send standardized payment instructions. It does not move money itself; settlement happens via correspondent account balances.

**SWIFT Case Management**
:   A SWIFT platform for raising, tracking, and resolving cross-border payment investigations collaboratively across banks, integrated with gpi.

**SWIFT gpi**
:   An enhancement to SWIFT that adds end-to-end tracking, timestamps, and transparency across intermediary banks via a shared "gpi Tracker". Used by 4,000+ banks, covering 75%+ of SWIFT payment volume.

