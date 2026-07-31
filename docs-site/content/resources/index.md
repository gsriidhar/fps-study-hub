---
title: "Resources"
---

# Resources

External, publicly available material worth bookmarking alongside this course. None of this is required reading to pass an interview — the lessons here already distil what you need — but each link is genuinely useful if you want to go one level deeper into the real data and organisations behind UK payments.

## Reference data & scheme information

**[EISCD data file — sortcodes.co.uk](https://www.sortcodes.co.uk/eiscd-data-file)**
The Extended Industry Sort Code Directory (EISCD) is the industry-maintained list mapping UK sort codes to the bank or building society that owns them, along with which payment schemes each sort code can receive on. It's the kind of reference data that sits behind sort-code validation in a real payment hub — useful if you want to see what "sort code validation" is actually validating against, beyond a simple format check.

**[Bank Account Checker — download](https://www.bankaccountchecker.com/download)**
A tool for running the UK modulus checking algorithm against a sort code and account number pair, which is the same class of check banks run during payment validation to catch obviously malformed account details before a payment is ever submitted. Handy for building intuition about what modulus checking actually does, distinct from Confirmation of Payee (which checks the *name*, not the number format).

**[Pay.UK — What we do: payment systems](https://www.wearepay.uk/what-we-do/payment-systems/)**
Pay.UK's own overview of the schemes it operates — Faster Payments, Bacs, and the Image Clearing System. Worth reading directly from the source if you want the scheme operator's own framing of its role, separate from any third-party course material (including this one).

**[SWIFT — Payments](https://www.swift.com/payments)**
SWIFT's own explanation of its cross-border payments messaging network, useful context for understanding how UK domestic rails like FPS and CHAPS fit alongside international payment infrastructure, and relevant if a CPCM-track interview touches cross-border or correspondent banking.

## Practice data

**[PaySim1 — Kaggle](https://www.kaggle.com/datasets/ealaxi/paysim1)**
A synthetic mobile-money transaction dataset (not real bank data) built to simulate the shape of genuine payment and fraud patterns at scale. If you want to practise the kind of SQL, filtering, and pattern-spotting analysis an FPS Analyst does — finding failed transactions, spotting anomalies, grouping by type — this is a safe, realistic dataset to load into a spreadsheet or a local SQL database and query against. Good complement to the [Block F6 SQL lessons](../fps/f6-systems-and-sql/index.md).

## Other sections

- [Deep dives](../deep-dives/index.md)
- [Cheat sheets](../cheatsheets/index.md)
- [Interview preparation](../interview-prep/index.md)
- [Mock exams](../mock-exams/index.md)
- [Case studies](../case-studies/index.md)
