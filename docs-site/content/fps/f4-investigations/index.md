---
title: "Investigations"
---

# Investigations



## Lessons

- [16. Payment Returns](16-payment-returns.md)
- [17. Payment Rejections](17-payment-rejections.md)
- [18. Missing Payment Investigation](18-missing-payment-investigation.md)
- [19. Delayed Payment Investigation](19-delayed-payment-investigation.md)
- [20. Duplicate Payment Investigation](20-duplicate-payment-investigation.md)
- [21. Fraud Investigation](21-fraud-investigation.md)

## Revision summary

A reject stops a payment before it ever completes (no funds move); a return reverses a payment that already completed (funds moved, then came back) and is tracked as its own linked event. Rejections carry ISO 20022 reason codes (AC01 incorrect account, AC04 closed account, AC06 blocked, AM02 limit exceeded, RC01 invalid identifier) that should be translated into plain, actionable language for customers. Missing and delayed payment investigations are both timeline exercises: trace status history to find the last successful stage, then assign ownership to whichever system or bank owns the next step — distinguishing an isolated case from a systemic incident via queue depth and processing rate against baseline. Duplicate investigations combine business-level pattern matching (payer, beneficiary, amount, reference, timing) with technical evidence (correlation/message IDs, retry logs), governed by idempotency as the core preventive control, and never assume recovery is automatic — check whether funds have already left the account, which can signal fraud rather than a routine duplicate. Fraud investigations flip the core question to legitimacy and recoverability rather than technical fault: APP fraud (deceived customer, PSR reimbursement rules) differs from account takeover (unauthorised access, Payment Services Regulations 2017), recall success depends heavily on speed against mule-account drainage, and since October 2024 most APP fraud victims must be reimbursed, cost-split 50/50 between sending and receiving bank, subject to a narrow Standard of Caution exception.

## Flashcards

??? question "Reject vs return, in one line each?"
    Reject: stopped before completion, no funds move. Return: completed, then reversed — funds moved first.

??? question "Why does a return get its own identifier?"
    It's a distinct financial event needing independent tracking and reconciliation, even though it's linked to the original payment.

??? question "What does ISO 20022 code AC04 mean?"
    Account closed.

??? question "What does AM02 mean?"
    Amount exceeds an agreed limit.

??? question "Why is MS03 discouraged?"
    It's an unspecified reason code — gives the customer and analyst nothing actionable.

??? question "What's the anchor question in a missing/delayed payment investigation?"
    Where did the payment last succeed, and who owns the next step?

??? question "Why can a Friday-evening payment via a smaller PSP look 'stuck'?"
    Some indirect participants batch outbound payments at fixed times rather than submitting instantly.

??? question "What two metrics separate an isolated slow payment from a systemic backlog?"
    Queue depth and processing rate against their normal baseline.

??? question "What is idempotency?"
    A design principle ensuring the same request produces only one outcome, however many times it's resubmitted — via a unique key.

??? question "Before recovering a confirmed duplicate, what must you check?"
    That the beneficiary account still holds the funds — if already withdrawn, treat it as a possible fraud case.

??? question "APP fraud vs account takeover — who authorised the payment?"
    APP fraud: the genuine customer, deceived. Account takeover: a criminal, without the customer's knowledge.

??? question "Why is speed critical in a fraud recall?"
    Mule accounts are typically drained within minutes to hours — a fast recall has a much better chance of recovering funds.

??? question "Since October 2024, how is APP fraud reimbursement cost split?"
    50/50 between the sending PSP and the receiving PSP, up to a cap, subject to a narrow Standard of Caution exception.

