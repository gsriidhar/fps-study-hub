# ISO 20022 cheat sheet

<div class="cheat-page" style="--cheat-accent:#1d4ed8;" markdown="1">

Dense reference for the message families, naming pattern, and structural pieces you'll actually see in payments work. For the full walkthrough, see [The ISO 20022 messaging standard](../../cpcm/block-f-modern-infrastructure/26-the-iso-20022-messaging-standard.md).

<div class="cheat-grid" markdown="1">

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Naming pattern</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Format</span>
<p class="cheat-def"><code>xxxx.###.###</code> — business area, three-digit message number, then a version number. Example: <code>pain.001.001.09</code>.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Business area prefix</span>
<p class="cheat-def">The first four letters group messages by purpose — <code>pain</code>, <code>pacs</code>, <code>camt</code>, <code>head</code>, <code>reda</code>, and others.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Version suffix</span>
<p class="cheat-def">The last two digits track schema revisions. A higher version means fields were added or clarified — always check which version a scheme actually accepts.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">pain — payments initiation</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">pain.001</span>
<p class="cheat-def">Customer Credit Transfer Initiation. A customer or corporate instructs their bank to make one or more payments.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">pain.002</span>
<p class="cheat-def">Customer Payment Status Report. The bank tells the initiator whether pain.001 was accepted, rejected, or is pending.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">pain.007 / pain.008</span>
<p class="cheat-def">Reversal and Direct Debit Initiation respectively — pulling funds rather than pushing them.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Sits between</span>
<p class="cheat-def">Customer/corporate ↔ their own bank. Never leaves that relationship.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">pacs — clearing and settlement</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">pacs.008</span>
<p class="cheat-def">FI to FI Customer Credit Transfer. The actual interbank leg of a payment — this is what travels through the FPS central infrastructure.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">pacs.002</span>
<p class="cheat-def">FI to FI Payment Status Report. Accept/reject response to a pacs.008, sent back through the same rail.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">pacs.004</span>
<p class="cheat-def">Payment Return. Used when a receiving bank sends money back — account closed, name mismatch, fraud hold, and similar.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">pacs.009 / pacs.028</span>
<p class="cheat-def">Financial Institution Credit Transfer (bank-to-bank, no underlying customer leg) and Payment Status Request respectively.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Sits between</span>
<p class="cheat-def">Bank ↔ bank, via the scheme's clearing and settlement infrastructure.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">camt — cash management</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">camt.052</span>
<p class="cheat-def">Bank to Customer Account Report. An intraday snapshot of balances and transactions.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">camt.053</span>
<p class="cheat-def">Bank to Customer Statement. The end-of-day statement — this is the one reconciliation jobs usually consume.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">camt.054</span>
<p class="cheat-def">Bank to Customer Debit/Credit Notification. Fired per-transaction rather than as a batch statement.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">camt.029 / camt.056</span>
<p class="cheat-def">Resolution of Investigation and FI to FI Payment Cancellation Request — the recall/investigation pair used when something needs to be chased or clawed back.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Envelope and header</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">head.001</span>
<p class="cheat-def">Business Application Header. Wraps the business message with routing metadata — sender, receiver, message ID, creation timestamp — kept separate from the payment data itself.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">GroupHeader (GrpHdr)</span>
<p class="cheat-def">Top of the business message body: message ID, creation date/time, number of transactions, control sum.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">PaymentInformation (PmtInf)</span>
<p class="cheat-def">One batch of payments sharing the same debtor and execution date, inside a pain.001.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">CreditTransferTransactionInformation (CdtTrfTxInf)</span>
<p class="cheat-def">A single transaction's detail — amount, creditor, remittance info — nested inside PmtInf or the pacs.008 equivalent.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Key data elements</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">UETR</span>
<p class="cheat-def">Unique End-to-end Transaction Reference — a UUID that follows a payment across every message and every bank it touches, used for tracing.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">EndToEndId</span>
<p class="cheat-def">A reference the originating customer chooses and expects to see echoed back unchanged all the way through.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">IBAN / BIC</span>
<p class="cheat-def">Account and institution identifiers carried in the Debtor/CreditorAgent and Debtor/CreditorAccount blocks.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Purpose / CategoryPurpose</span>
<p class="cheat-def">Structured codes describing why a payment is being made — used for screening, reporting, and routing rules.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<p class="cheat-section-title">Quick sanity checks</p>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Is this the customer leg or the bank leg?</span>
<p class="cheat-def"><code>pain</code> = customer leg. <code>pacs</code> = bank leg. If it's crossed a clearing system, it's <code>pacs</code>.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Is this a report or an instruction?</span>
<p class="cheat-def"><code>camt</code> = report/notification, read-only. <code>pain</code>/<code>pacs</code> = an instruction that moves or attempts to move money.</p>
</div>

<div class="cheat-entry" markdown="1">
<span class="cheat-term">Why not just XML tags?</span>
<p class="cheat-def">ISO 20022 is a data model first — XML (and JSON, in newer implementations) is just one serialisation of it. The field meanings stay constant across formats.</p>
</div>
</div>

</div>

## Message flow diagrams

Three common shapes a message flow takes in practice — who exchanges what, and where clearing hands off to settlement.

<div class="cheat-diagram" markdown="1">
![Cross-border payment message flow: payer to originating bank via pain.001/pain.002, originating bank to correspondent bank and correspondent to beneficiary bank via pacs.008 with camt.053/054 returned, beneficiary bank to payee by credit advice.](../../assets/diagrams/cross-border-payment-flow.svg)
</div>

<div class="cheat-diagram" markdown="1">
![High-value domestic payment: Participant A and Participant B exchange pacs.008/pacs.009 instructions and pacs.002/pacs.004 responses through a payment messaging network, which separately requests settlement from an RTGS engine that debits A and credits B.](../../assets/diagrams/high-value-domestic-flow.svg)
</div>

<div class="cheat-diagram" markdown="1">
![Liquidity transfer between settlement systems: a payment service provider sends a camt.050 liquidity transfer request that moves between a domestic RTGS, a central liquidity manager, and an instant-payments settlement service, each confirming with camt.025 and camt.054.](../../assets/diagrams/liquidity-transfer-flow.svg)
</div>

</div>

## Other sections

[Cheat sheets home](../index.md) · [Deep dives](../../deep-dives/index.md) · [Interview prep](../../interview-prep/index.md) · [Mock exams](../../mock-exams/index.md)
