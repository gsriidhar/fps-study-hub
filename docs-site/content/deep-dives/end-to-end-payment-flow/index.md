---
title: "End-to-end payment flow"
---

# End-to-end payment flow

A single walkthrough of a Faster Payment's full journey, from the moment a customer hits send to the moment the beneficiary is credited — and what happens when a step along the way doesn't go to plan. Each stage links to the lesson that covers it in depth; this page is the map, not a replacement for the detail.

This is a genuinely common interview question in its own right — "walk me through what happens when a customer sends a payment" — so it doubles as a rehearsal script. Try narrating it out loud in under 90 seconds before you look at the detail below.

## The journey in one line

Customer → sending bank (capture, validate, check, submit) → Pay.UK / FPS infrastructure (route) → receiving bank (validate, credit) → beneficiary — with a status and timestamp written at every stage.

## Stage 1 — Initiation

The customer submits a payment through a channel — mobile banking, online banking, a standing order due to run, or a business payment file. The bank captures the instruction and creates an internal payment record with a unique identifier before anything else happens. See [F1 · Payment initiation](../../fps/f1-fps-fundamentals/index.md).

## Stage 2 — Validation

Before anything is submitted anywhere, the sending bank runs a set of checks against the payment itself: are the mandatory fields present, is the sort code correctly formatted, does the account number pass modulus checking, is the amount within limits, is the source account open and able to pay. A payment that fails here never reaches the next stage — it's rejected immediately with a reason. See [F1 · Validation rules](../../fps/f1-fps-fundamentals/index.md).

## Stage 3 — Confirmation of Payee and fraud checks

Once the payment is structurally valid, most journeys run a Confirmation of Payee check — does the name the customer entered match the name on the destination account — and a set of fraud and risk checks: is this amount, payee, or pattern unusual for this customer, does it match known mule-account or scam indicators. A technically correct payment can still be held here for manual review. See [F2 · Confirmation of Payee](../../fps/f2-checks-submission-and-settlement/index.md) and [F2 · Fraud and risk controls](../../fps/f2-checks-submission-and-settlement/index.md).

## Stage 4 — Submission

A payment that clears validation and fraud checks is handed to the bank's payment hub, which prepares the outbound message and routes it through the bank's own FPS gateway into the scheme. This is the point where the payment leaves the sending bank's own systems. See [F2 · FPS submission](../../fps/f2-checks-submission-and-settlement/index.md).

## Stage 5 — Scheme routing

Pay.UK's central infrastructure routes the payment instruction to the receiving participant — directly if they're a direct participant, or via their sponsor bank if they're indirect. Pay.UK does not hold customer money or decide fraud outcomes at this stage; it routes the message. See [F1 · The FPS ecosystem](../../fps/f1-fps-fundamentals/index.md) and [F1 · Direct vs indirect access](../../fps/f1-fps-fundamentals/index.md).

## Stage 6 — Receiving-bank processing

The receiving bank gets the incoming instruction and runs its own checks: does the destination account exist and is it able to receive funds, does anything about the payment trigger their own fraud rules. Only after these checks pass does the receiving bank actually credit the beneficiary's account — a payment being "accepted by the scheme" is not the same as the beneficiary having the money yet. See [F2 · Receiving-bank processing](../../fps/f2-checks-submission-and-settlement/index.md).

## Stage 7 — Settlement

Separately from the customer-visible movement of money, the sending and receiving banks' obligations to each other are settled — the process that actually balances the books between institutions, distinct from the payment being processed. See [F2 · Settlement and reconciliation](../../fps/f2-checks-submission-and-settlement/index.md) and [F5 · Why reconciliation matters](../../fps/f5-reconciliation-and-architecture/index.md).

## When it doesn't go smoothly

- **Rejected before completion** — invalid details, failed checks. See [F4 · Payment rejections](../../fps/f4-investigations/index.md).
- **Returned after completion** — the payment succeeded but funds need to come back (closed account, can't process). See [F4 · Payment returns](../../fps/f4-investigations/index.md).
- **Stuck or delayed** — passed validation but held somewhere in the chain. See [F4 · Delayed payment investigation](../../fps/f4-investigations/index.md).
- **Missing entirely** — customer says it never arrived. See [F4 · Missing payment investigation](../../fps/f4-investigations/index.md).
- **Duplicated** — the same payment appears twice, usually a retry after a timeout. See [F4 · Duplicate payment investigation](../../fps/f4-investigations/index.md).

## Behind the scenes throughout

None of this happens in a vacuum — three things run underneath every stage above:

- **Systems and data** — middleware queues messages between systems, and every stage writes a status and timestamp to a database that becomes the audit trail for any later investigation. See [F6 · Middleware](../../fps/f6-systems-and-sql/index.md) and [F6 · SQL for failed-payment analysis](../../fps/f6-systems-and-sql/index.md).
- **Testing** — before any of this goes live, each stage is tested for both the happy path and deliberate failure cases. See [F7 · Happy-path testing](../../fps/f7-testing-fps/index.md) and [F7 · Negative testing](../../fps/f7-testing-fps/index.md).
- **Monitoring** — in production, volume, success/failure rate, and queue depth are watched continuously so a break in this flow is caught within minutes, not from a customer complaint. See [F8 · Monitoring FPS systems](../../fps/f8-monitoring-and-live-simulation/index.md).

## Other sections

- [Deep dives](../index.md)
- [Cheat sheets](../../cheatsheets/index.md)
- [Interview preparation](../../interview-prep/index.md)
- [Case studies](../../case-studies/index.md)
