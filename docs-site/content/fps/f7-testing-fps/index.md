---
title: "Testing FPS"
---

# Testing FPS



## Lessons

- [31. Test Strategy for FPS](31-test-strategy-for-fps.md)
- [32. Happy Path Testing](32-happy-path-testing.md)
- [33. Negative Testing in FPS](33-negative-testing-in-fps.md)
- [34. Confirmation of Payee (CoP) Testing](34-confirmation-of-payee-cop-testing.md)
- [35. Fraud Testing in FPS](35-fraud-testing-in-fps.md)
- [36. Regression Testing](36-regression-testing.md)

## Revision summary

A test strategy defines how a system will be tested before test cases are written — scope, test levels (functional, integration, end-to-end, regression), the standard Dev → SIT → UAT → Pre-Prod → Production environment chain, test data handling, and explicit entry/exit criteria between stages. Happy path testing proves a valid payment completes successfully through the expected status journey (created → validated → approved → submitted → accepted → completed), validated against backend evidence independently of the confirmation screen, and extended across realistic variation like new/existing beneficiaries, boundary amounts, and midnight cut-offs. Negative testing proves the system fails safely across customer input, business rule, fraud, and technical failure categories, with boundary testing (just below/at/above a limit) and duplicate-submission testing (verified against the database, not the screen) as core disciplines. CoP testing covers all four response types — Match, Close Match, No Match, Unable To Check — each needing its own correctly-tested customer journey, plus realistic edge cases like joint accounts, trading names, and unsupported account types, with a customer's override of a No Match warning specifically requiring an explicit recorded decision. Fraud testing covers APP fraud, velocity checks, mule indicators, new-beneficiary risk, and account takeover signals via APPROVE/HOLD/REJECT/REFER decisions, with false positive testing (protecting genuine customers from over-blocking) treated as equally important as catching real fraud, and — since October 2024 — an evidentiary responsibility to prove the fraud case record supports APP reimbursement assessment. Regression testing pulls the highest-confidence scenarios from all of the above into a tiered pack (smoke, critical, full), run at defined trigger points, with every failure following a consistent defect verification workflow (retest, re-run surrounding pack, add a permanent new case) and requiring ongoing maintenance to avoid becoming stale and misleading.

## Flashcards

??? question "What does a test strategy define?"
    How a system will be tested overall — scope, test levels, environments, test data, and entry/exit criteria — before test cases are written.

??? question "Functional vs integration testing?"
    Functional: one feature against its own requirement, in isolation. Integration: whether connected systems correctly exchange data together.

??? question "What's the expected FPS status journey for a successful payment?"
    Created → validated → approved → submitted → accepted → completed.

??? question "Why check backend evidence, not just the confirmation screen?"
    A payment can appear successful on screen while the backend records a different, incorrect status — the screen alone doesn't prove every system agrees.

??? question "What are the four negative test categories?"
    Customer input, business rule, fraud control, technical failure.

??? question "How should a payment limit be boundary-tested?"
    Just below the limit (accepted), exactly at the limit (accepted), and just above it (rejected).

??? question "How is duplicate payment prevention actually verified?"
    By querying the database directly to confirm only one payment record exists — not by trusting the confirmation screen.

??? question "What are the four CoP response types?"
    Match, Close Match, No Match, Unable To Check.

??? question "Why must a customer's override of a No Match warning be recorded?"
    It's critical evidence for later APP fraud reimbursement dispute assessments.

??? question "What are the four fraud decision outcomes?"
    APPROVE, HOLD, REJECT, REFER.

??? question "Why does false positive testing matter as much as catching real fraud?"
    Over-blocking genuine customers causes real harm and erodes trust, just as under-blocking causes financial loss.

??? question "What question does a regression pack answer?"
    Has anything that used to work stopped working because of this change?

??? question "What are the three regression pack tiers?"
    Smoke (every deployment), critical (nightly), full (pre-production gate).

??? question "What happens after a regression defect fix passes retest?"
    The surrounding pack is re-run for side effects, and a new permanent case is added if one didn't already exist.

