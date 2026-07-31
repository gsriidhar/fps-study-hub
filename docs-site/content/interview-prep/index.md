---
title: "Interview preparation"
---

# Interview preparation

A topic-by-topic question bank for FPS Analyst, Payments Operations, and related interviews. Every answer here is written specifically for this site — use it to check your own phrasing, not to memorise word for word. For deeper background on any topic, the linked lesson has the full explanation, worked examples, and a "Read this before an interview" tip.

Each answer follows a simple pattern that works well out loud: **define it in one sentence, then show you understand the consequence or the edge case.** Interviewers are usually testing whether you understand *why* something matters, not whether you can recite a definition.

## FPS fundamentals

**Q: What is Faster Payments, in your own words?**
A UK scheme that moves money between bank accounts in seconds, 24 hours a day, every day of the year, instead of the multi-day batch cycle older systems like Bacs use. It's the rail behind most everyday transfers — mobile banking payments, one-off bill payments, standing orders — anything that isn't high-value CHAPS business or slow, low-cost bulk collection. See [F1 · What is FPS?](../fps/f1-fps-fundamentals/index.md).

**Q: Who actually operates FPS, and who moves the money?**
Pay.UK owns the scheme rules and the central infrastructure that routes payment messages between banks. It doesn't hold customer money or make credit/fraud decisions — that stays with the sending and receiving banks. It helps to describe Pay.UK as the referee and rulebook owner, not a bank. See [F1 · The FPS ecosystem](../fps/f1-fps-fundamentals/index.md).

**Q: What's the difference between a direct and an indirect participant?**
A direct participant connects to the FPS infrastructure itself and settles under its own name. An indirect participant — commonly a smaller bank or fintech — reaches FPS through a sponsor bank, which provides the technical connection and settles on its behalf. Indirect access is usually faster to set up and cheaper, at the cost of depending on the sponsor's availability and pricing. See [F1 · Direct vs indirect access](../fps/f1-fps-fundamentals/index.md).

**Q: Why would a business still use CHAPS instead of Faster Payments?**
Mainly value and finality. FPS has scheme payment limits and is designed for retail-scale transfers; CHAPS is uncapped, same-day, and used for time-critical high-value settlements such as property completions. If I were asked to choose a rail for a client, I'd weigh amount, urgency, and cost, not just speed. See [B4 · Faster Payments](../cpcm/block-b-uk-domestic-clearing/index.md).

## Payment lifecycle & status

**Q: Walk me through what happens to a payment after a customer hits send.**
The bank captures the instruction, runs validation (sort code, account number, mandatory fields), runs fraud and Confirmation of Payee checks, then hands it to the payment hub, which submits it through the bank's FPS gateway. Pay.UK routes it to the receiving bank, which runs its own checks before crediting the beneficiary. Each stage writes a status and timestamp, which is what makes the payment traceable later. See [F3 · Payment lifecycle](../fps/f3-payment-data-and-operations/index.md).

**Q: Does a payment being accepted by FPS mean the customer has received the money?**
No — that's a common misconception worth clarifying in an answer. FPS acceptance means the message was routed successfully; the receiving bank still has to validate the destination account and credit it. A payment can be "accepted by the scheme" and still be sitting in the receiving bank's own exception queue. See [F3 · Statuses explained](../fps/f3-payment-data-and-operations/index.md).

**Q: What's the difference between a rejected payment and a returned payment?**
A rejection happens before completion — the payment never lands, usually because of invalid details or a failed check. A return happens after the payment has already completed and money is sent back, for example because the account is closed or the receiving bank can't process it. The distinction matters because a return means funds moved twice and reconciliation needs to catch both legs. See [F4 · Returns and rejections](../fps/f4-investigations/index.md).

## Investigation & troubleshooting

**Q: A customer says their Faster Payment never arrived — how do you start investigating?**
I'd gather the identifying details first — payment reference, amount, date, sender and beneficiary account — then trace the payment's status history in order: was it created, did it pass validation, was it submitted to the gateway, did the receiving bank acknowledge it. Whichever step it stops at tells you who owns the next action. I always narrate this as "find the last confirmed step, then find out who's responsible for the step after it." See [F4 · Investigating missing payments](../fps/f4-investigations/index.md).

**Q: How would you tell a genuinely delayed payment from a failed one?**
A delayed payment usually still shows an in-flight status — pending, submitted, awaiting response — with no error code attached, meaning it's stuck in a queue rather than rejected. A failed payment carries an explicit rejection or error status with a reason code. I'd check the queue depth and recent system alerts before assuming it's a one-off. See [F4 · Delayed payment investigation](../fps/f4-investigations/index.md).

**Q: What could cause the same payment to appear twice?**
Usually a retry mechanism firing after a timeout, where the original request actually succeeded but the caller never received the acknowledgement, so it resubmits. I'd compare the two records on amount, reference, and timestamp, check for a shared correlation ID, and if confirmed as a duplicate, follow the recovery process and flag it so reconciliation isn't thrown off. See [F4 · Duplicate payments](../fps/f4-investigations/index.md).

## Reconciliation

**Q: Why does reconciliation matter if the payment already completed?**
Completion confirms the message was processed; reconciliation confirms the money actually balances between the bank's internal ledger and the settlement records. A payment can look complete operationally and still leave a break if the two records don't match on amount or count — and unresolved breaks are exactly what regulators and auditors ask about. See [F5 · Why reconciliation matters](../fps/f5-reconciliation-and-architecture/index.md).

**Q: What are the most common types of reconciliation break, and how would you triage them?**
Broadly: a payment missing from one side, an amount mismatch, a duplicate, or a status mismatch (one system thinks it's settled, the other doesn't). I'd triage by comparing internal records against the settlement feed on a shared key, work out which category it falls into, and route it accordingly rather than investigating each break from scratch. See [F5 · Types of reconciliation break](../fps/f5-reconciliation-and-architecture/index.md).

## Systems, SQL & architecture

**Q: In plain terms, what's a payment hub, and where does it sit in the architecture?**
It's the internal system that owns a payment once a customer channel (mobile app, online banking, branch system) hands it over. It runs validation and routing logic, decides which rail to use, and talks to the FPS gateway on one side and the bank's core ledger on the other. When something goes wrong, the payment hub is usually the first place I'd look, because it's the common point everything passes through. See [F6 · Payment hub & middleware](../fps/f6-systems-and-sql/index.md).

**Q: How would you use SQL to investigate a batch of failed payments?**
I'd start narrow — pull the failed records for the relevant time window with a `SELECT ... WHERE status = 'FAILED' AND created_at BETWEEN ...` — then group by failure/reason code to see if there's a concentration pointing at one root cause rather than random noise. If one code dominates, I'd drill into a handful of individual records to confirm the pattern before escalating. See [F6 · SQL for failed-payment analysis](../fps/f6-systems-and-sql/index.md).

**Q: What's the difference between a Payment ID, a Transaction ID, and a Correlation ID, and why keep them separate?**
The Payment ID is the business-facing reference for the whole payment. The Transaction ID often refers to one leg or system's internal record of it. The Correlation ID ties together every message that belongs to the same payment as it crosses systems and logs. Keeping them distinct matters because tracing an issue across the payment hub, gateway, and receiving bank depends on being able to follow the correlation ID even when the business reference isn't logged everywhere. See [F6 · Payment identifiers](../fps/f6-systems-and-sql/index.md).

## Fraud & Confirmation of Payee

**Q: What is Confirmation of Payee actually checking, and what does it not check?**
It checks whether the name the payer entered matches the name registered on the destination account, returning a match, close match, no match, or "unable to check" result. It does not check whether the account exists, is open, or is the "right" account for the purpose — it's a name-matching signal to reduce misdirected and authorised push payment fraud, not a full account verification. See [F2 · Confirmation of Payee](../fps/f2-checks-submission-and-settlement/index.md).

**Q: Why might a perfectly correct payment still get delayed by fraud controls?**
Fraud checks look at behaviour, not just correctness — unusual amount for that customer, a new payee, high velocity of payments in a short window, or a beneficiary account flagged elsewhere. A well-formed payment can still trip a risk rule and get held for manual review, which is why "correct details" and "clean to release" aren't the same thing. See [F2 · Fraud and risk controls](../fps/f2-checks-submission-and-settlement/index.md).

**Q: What is APP fraud, and why has it become such a big regulatory focus?**
Authorised push payment fraud is where the customer is tricked into authorising a genuine payment to a fraudster — the payment itself passes every technical check because the customer really did approve it. It's a big focus because traditional fraud controls are built to catch *unauthorised* activity, so APP scams need behavioural and warning-based controls instead, and UK regulation now requires banks to reimburse victims in most cases. See [G3 · Fraud typologies](../cpcm/block-g-risk-compliance-and-security/index.md).

## Testing & QA

**Q: How would you approach testing a new FPS payment journey before release?**
I'd start with happy-path scenarios — a valid payment that should sail through every stage — to confirm the baseline works, then layer in negative cases: invalid account details, insufficient funds, CoP mismatches, and fraud-rule triggers, checking that each one fails safely with the right status and message rather than silently. I'd also check the backend evidence, not just the on-screen result, since a customer-facing "success" message means nothing if the ledger disagrees. See [F7 · Happy-path and negative testing](../fps/f7-testing-fps/index.md).

**Q: Why is negative testing especially important for a payment system?**
Because the cost of a badly-handled failure isn't just a bug report — it can mean money moved when it shouldn't have, a duplicate charge, or a customer left in limbo with no clear status. I treat "what happens when this goes wrong" as equally important to "does this work," and I always check the audit trail left behind, not just the immediate response. See [F7 · Why negative testing matters](../fps/f7-testing-fps/index.md).

## Production support & monitoring

**Q: What would you actually watch on a dashboard for a live payment system?**
Payment volume against the expected pattern for that time of day, success/failure rate, queue depth, and the health of dependencies like the CoP service or the FPS gateway itself. A sudden volume drop is often more urgent than a rise in failures, because it can mean payments aren't reaching the system at all rather than reaching it and failing loudly. See [F8 · Monitoring FPS systems](../fps/f8-monitoring-and-live-simulation/index.md).

**Q: Talk me through how you'd handle a spike in failed payments during your shift.**
First confirm scale — is this genuinely above normal, or normal daily noise — then group failures by reason code to see if it's one root cause or scattered. If it clusters around a technical error (timeouts, a specific gateway response), I'd check recent deployments and infrastructure logs; if it clusters around validation or fraud outcomes, I'd loop in the relevant team rather than treating it as an infrastructure incident. Communicating what I know and don't know yet, early, matters as much as the diagnosis itself. See [F8 · Live incident simulation](../fps/f8-monitoring-and-live-simulation/index.md).

## Behavioural & scenario questions

**Q: Tell me about a time you had to explain a technical issue to someone non-technical.**
Use the STAR structure — Situation, Task, Action, Result — and for payments specifically, show that you can translate "the reconciliation break was a timestamp mismatch in the settlement feed" into "the money moved correctly, our records just logged it a few minutes apart, here's how we fixed the record." Interviewers are checking you won't bury a stakeholder in jargon during a live incident.

**Q: How would you prioritise if you had three payment issues open at once?**
Impact and reversibility first: an issue affecting many customers or involving money already moved outranks a single stuck payment that's still recoverable. I'd also factor in whether a fix is quick to apply — sometimes clearing a small, fast issue first reduces total queue pressure before tackling the bigger one.

**Q: Why do you want to work in payments operations specifically?**
This is genuinely personal, but a strong answer usually connects a concrete interest — the mix of real-time systems, investigation work, and consumer impact — to something you've actually done, whether that's structured self-study like this course, a related role, or a project. Avoid a generic "I like problem-solving" answer with nothing underneath it.

## Current market context (useful to mention)

Interviewers sometimes probe whether you follow the industry, not just the mechanics. A few things worth being able to speak to in your own words:

- **Pay.UK's Interbank Infrastructure Renewal (IIR) programme** — the ongoing project to replace the core FPS infrastructure (formerly branded the New Payments Architecture). Know that it exists and roughly what problem it solves — resilience and flexibility of the central rail — without needing exact delivery dates, which change.
- **Mandatory APP fraud reimbursement** — UK payment firms are required to reimburse most authorised push payment scam victims, split between sending and receiving banks, which has pushed fraud prevention further up the priority list industry-wide.
- **Confirmation of Payee expansion** — CoP coverage has been widening across more account types and payment methods over time, reducing misdirected-payment risk.
- **ISO 20022** — the richer, structured messaging standard now used across UK and international payment rails, replacing older, less structured message formats; worth knowing why "more structured data" helps with fraud detection and reconciliation, not just that it exists.

Treat exact dates, percentages, and programme names as subject to change — check Pay.UK, the Payment Systems Regulator, and SWIFT's own published material close to your interview date rather than quoting fixed figures from memory.

## Other sections

- [Deep dives](../deep-dives/index.md)
- [Cheat sheets](../cheatsheets/index.md)
- [Mock exams](../mock-exams/index.md)
- [Case studies](../case-studies/index.md)
- [Resources](../resources/index.md)
