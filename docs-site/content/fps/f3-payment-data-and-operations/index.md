---
title: "Payment Data & Operations"
---

# Payment Data & Operations



## Lessons

- [11. Payment Fields](11-payment-fields.md)
- [12. Payment Statuses](12-payment-statuses.md)
- [13. Payment References](13-payment-references.md)
- [14. The FPS Operations Team](14-the-fps-operations-team.md)
- [15. Exception Queues](15-exception-queues.md)

## Revision summary

A payment record's fields fall into identification, account/routing, financial, status, and timing families — Payment ID is the business reference, Correlation/Transaction ID the technical one. The status lifecycle runs created → received → validated → fraud-checked → submitted → accepted → completed, with reject (before completion) and return (after completion) as exception branches; the core investigation technique is finding the last successful status transition. Multiple reference types (Payment ID, Transaction ID, E2E reference, Correlation ID, Message ID, Scheme Reference) each serve a different audience across the systems a payment crosses. The FPS Operations team keeps 24/7 live processing healthy, escalating incidents by severity (P1-P4) and working closely with Development, QA, Business, Compliance, and Pay.UK. Exception queues (validation, fraud, repair, technical, reconciliation, sanctions) pause payments that can't continue automatically, with tightly controlled repairs that can never touch beneficiary details or amount.

## Flashcards

??? question "Payment ID vs Correlation ID — who uses which?"
    Payment ID: operations/customer service (business reference). Correlation ID: developers (technical tracing).

??? question "What does VALIDATED mean, and not mean?"
    Means: passed technical/business checks. Does not mean: money has moved or the payment is complete.

??? question "What's the difference between ACCEPTED and COMPLETED?"
    Accepted = next stage acknowledged it. Completed = beneficiary actually credited, full lifecycle finished.

??? question "Reject vs return?"
    Reject: stopped before ever completing. Return: completed, then reversed afterward.

??? question "What's the single best investigation technique for a stalled payment?"
    Find the last successful status transition in its history — that tells you which system/team owns the next step.

??? question "What does an end-to-end reference do?"
    Lets sending bank, FPS, and receiving bank all agree they're discussing the same payment.

??? question "Why has FPS Operations run 24/7 since 2019?"
    FPS itself processes continuously with no overnight cut-off, so issues need near real-time detection, not a daily batch check.

??? question "What are the three escalation levels?"
    L1: first-line monitoring/repairs. L2: deeper technical investigation. L3: development/vendor fixes root cause.

??? question "Why can't a repair queue analyst change a beneficiary account number?"
    It would redirect customer funds without their authority — that requires reject and fresh customer resubmission instead.

??? question "What's the mindset shift for exception queues?"
    An exception means processing paused to ask a question, not that something has necessarily failed.

