# CPCM cheat sheet

<div class="cheat-page" style="--cheat-accent:#7c3aed;" markdown="1">

A glossary-style sweep across the whole [CPCM curriculum](../../cpcm/index.md) — one line per term, grouped by the block it belongs to. Good for a final pre-exam skim.

<div class="cheat-grid" markdown="1">

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Block A — Foundations</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Cash management</span>
<p class="cheat-def">Managing an organisation's short-term cash position — collections, disbursements, and liquidity — so obligations are met without idle balances.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Payment participant roles</span>
<p class="cheat-def">Payer, payee, originating bank, beneficiary bank, and the scheme/infrastructure operator sitting between them.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Push vs pull payment</span>
<p class="cheat-def">Push: payer's bank sends funds (credit transfer). Pull: payee collects funds with prior authorisation (Direct Debit, card payment).</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Payment instrument</span>
<p class="cheat-def">The mechanism used to move money — credit transfer, direct debit, card, cheque, or a digital wallet sitting on top of one of these.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Block B — UK domestic clearing</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Clearing</span>
<p class="cheat-def">The process of transmitting, reconciling, and confirming a payment instruction between banks, prior to settlement.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Settlement</span>
<p class="cheat-def">The actual discharge of the payment obligation — final movement of central-bank money between participants.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Bacs</span>
<p class="cheat-def">UK batch-processed scheme for Direct Debits and Direct Credits; three-day processing cycle, used heavily for payroll and recurring collections.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">CHAPS</span>
<p class="cheat-def">UK's same-day, high-value RTGS scheme — used for time-critical or large payments (property completions, large corporate transfers) with no upper limit.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Block C — Cross-border and high-value</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">RTGS</span>
<p class="cheat-def">Real-Time Gross Settlement — each payment is settled individually and immediately in central-bank money, rather than netted with others.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">SWIFT</span>
<p class="cheat-def">A secure global messaging network banks use to instruct each other on cross-border payments — a messaging layer, not a settlement system itself.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Correspondent banking</span>
<p class="cheat-def">A bank without a direct relationship in a foreign market routes payments through a correspondent bank that does.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Nostro / Vostro account</span>
<p class="cheat-def">Nostro: "our account, held at your bank" (from the account-holding bank's perspective). Vostro: "your account, held at our bank" — same account, opposite viewpoint.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">SEPA</span>
<p class="cheat-def">Single Euro Payments Area — harmonises euro-denominated credit transfers and direct debits across participating European countries as if domestic.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Block D — Cards and merchant payments</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Four-party card model</span>
<p class="cheat-def">Cardholder, issuer, acquirer, merchant — with the card scheme (Visa/Mastercard) providing the rails and rules connecting issuer and acquirer.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Interchange fee</span>
<p class="cheat-def">A fee the acquirer pays the issuer on each card transaction, set by the scheme, and typically passed through to the merchant.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Payment gateway</span>
<p class="cheat-def">The technology layer that captures and encrypts card details at checkout and routes them to the acquirer/processor.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Merchant acquiring</span>
<p class="cheat-def">The service that lets a merchant accept card payments — the acquirer underwrites the merchant and settles funds to their account.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Block E — Corporate cash and treasury</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Liquidity management</span>
<p class="cheat-def">Ensuring an organisation has enough accessible cash to meet obligations, without holding excess idle balances that cost in opportunity terms.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Cash pooling</span>
<p class="cheat-def">Concentrating balances from multiple accounts/subsidiaries into one to optimise interest and reduce borrowing needs.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Reconciliation</span>
<p class="cheat-def">Matching two independent records (e.g. bank statement vs. internal ledger) to confirm they agree, and investigating any breaks.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Treasury operations</span>
<p class="cheat-def">The corporate function managing cash, funding, FX exposure, and counterparty risk day to day.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Block F — Modern infrastructure</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">ISO 20022</span>
<p class="cheat-def">A global data-modelling standard for financial messaging, gradually replacing older proprietary formats — see the dedicated [ISO 20022 cheat sheet](../iso20022/index.md).</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Open banking</span>
<p class="cheat-def">Regulatory framework requiring banks to expose account data and payment initiation via secure APIs to authorised third parties, with customer consent.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">API in payments</span>
<p class="cheat-def">A structured interface allowing systems (bank, fintech, merchant) to programmatically initiate payments or retrieve account data, replacing older file-based batch integration.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Block G — Risk, compliance and security</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">KYC / CDD</span>
<p class="cheat-def">Know Your Customer / Customer Due Diligence — verifying a customer's identity and assessing risk before and during a banking relationship.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Sanctions screening</span>
<p class="cheat-def">Checking parties to a transaction against government/regulatory watchlists before allowing the payment to proceed.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">APP fraud</span>
<p class="cheat-def">Authorised Push Payment fraud — the victim is tricked into authorising a genuine payment themselves, rather than the account being taken over.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Operational risk</span>
<p class="cheat-def">Risk of loss from failed internal processes, people, systems, or external events — distinct from credit or market risk.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Block H — Regulation, innovation, career</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">PSD2 (concept)</span>
<p class="cheat-def">EU/UK regulatory framework underpinning open banking and strong customer authentication requirements for electronic payments.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">CBDC</span>
<p class="cheat-def">Central Bank Digital Currency — a digital form of central-bank money, distinct from commercial bank deposits or cryptocurrency.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Payments operations</span>
<p class="cheat-def">The day-to-day function that keeps payment processing running: monitoring, exception handling, investigations, and reporting.</p>
</div>
</div>

</div>

## Flow diagrams

<div class="cheat-diagram" markdown="1">
![Four-party card model: the cardholder pays the merchant, who submits the transaction to the acquirer; the acquirer and issuer exchange authorization through the card scheme (Visa or Mastercard), and the issuer bills the cardholder while also paying the acquirer via the scheme's interchange fee.](../../assets/diagrams/card-four-party-model.svg)
</div>

<div class="cheat-diagram" markdown="1">
![Correspondent banking nostro and vostro: Bank A sends a payment instruction to its correspondent bank, which forwards it to Bank B; the account the correspondent holds in Bank A's name is Bank A's nostro account and the correspondent's vostro account — the same account described from opposite sides.](../../assets/diagrams/correspondent-banking-nostro-vostro.svg)
</div>

</div>

## Other sections

[Cheat sheets home](../index.md) · [Deep dives](../../deep-dives/index.md) · [Interview prep](../../interview-prep/index.md) · [Mock exams](../../mock-exams/index.md)
