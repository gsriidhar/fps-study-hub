---
title: "Case studies"
---

# Case studies

Two kinds of material here. The first two case studies are original write-ups of real, publicly reported UK payments incidents — summarised and analysed in our own words, with sources linked so you can read the primary coverage yourself. The rest are original composite scenarios, written for this course, that combine concepts from multiple lessons the way a real investigation would. None of the composite scenarios describe a real customer, bank, or event — they're realistic practice material only.

## Real incident: the TSB 2018 migration outage

**What happened.** In April 2018, TSB moved customer and account data from an old IT platform onto a new one as part of separating its systems from a former group parent. The data migration itself largely worked, but the new platform failed under real customer load immediately afterward — online and mobile banking became unreliable, branch systems struggled, and some customers were reportedly able to see account information belonging to other customers. The disruption ran for months rather than hours; regulators later recorded roughly 225,000 customer complaints in the year following the migration, and TSB was fined tens of millions of pounds by UK regulators once the post-incident review concluded.

**Why it matters for a payments role.** This wasn't a Faster Payments scheme failure — FPS itself worked correctly throughout. The failure was in TSB's own core banking platform: the system that has to be healthy *before* a payment instruction ever reaches a scheme like FPS or Bacs. It's a useful reminder that "the payment failed" can mean very different things depending on which layer broke, and that operational resilience — a bank's own ability to keep its core systems available — is now a specific, formal regulatory expectation in UK financial services precisely because of incidents like this one.

**Discussion questions.**

- If you were a payments operations analyst during a core-banking migration like this, what would you want visibility into *before* go-live, not just after?
- The scheme (FPS) worked fine; the bank's own platform didn't. How would you explain that distinction to a non-technical stakeholder or a frustrated customer?
- What's the difference between a migration "succeeding" (data moved correctly) and a migration being "safe to go live" (the platform can handle real production load)?

Sources: [Bank of England — fine over 2018 IT migration](https://www.aol.com/bank-england-fines-former-tsb-111403480.html), [Panorama Consulting — lessons from the TSB failure](https://www.panorama-consulting.com/tsb-software-failure/), [Protecht Group — resilience failures analysis](https://www.protechtgroup.com/en-au/blog/resilience-failures-why-was-tsb-bank-fined-and-what-can-we-learn-from-it)

## Real incident: the July 2018 Faster Payments outage

**What happened.** In July 2018, the Faster Payments Scheme suffered an outage in its central infrastructure lasting roughly four and a half hours on a Sunday afternoon — reported at the time as the first recorded service-level outage since FPS went live a decade earlier, in 2008. Most of the backlog of delayed payments was cleared later the same day, but a smaller number remained unresolved almost two days later. Some customers were reportedly hit with knock-on overdraft fees from payments arriving later than expected, though the scheme said no one would be left permanently out of pocket.

**Why it matters for a payments role.** This is the scenario every FPS production support and monitoring lesson in this course is ultimately preparing you for: a scheme-level infrastructure issue, not a single customer's problem. The interesting operational question isn't "why did it break" — infrastructure fails occasionally, however well built — it's "how do you detect it fast, communicate it clearly, and manage the backlog safely once it recovers," since a sudden flood of delayed payments releasing at once is its own operational risk (duplicate submissions, reconciliation pressure, queue overload).

**Discussion questions.**

- A four-and-a-half-hour central outage releases a backlog all at once when it recovers. What could go wrong operationally in that recovery window, and how would you guard against it?
- How would you distinguish, from a bank's own monitoring dashboard, between "our system is broken" and "the scheme itself is degraded"? See [F8 · Monitoring FPS systems](../fps/f8-monitoring-and-live-simulation/index.md).
- Customers experienced knock-on fees (like overdraft charges) from a scheme-level delay that wasn't their bank's fault or their own. Whose responsibility is that outcome, and why?

Sources: [Finextra — Faster Payments outage delays thousands of transactions](https://www.finextra.com/newsarticle/32372/faster-payments-outage-delays-thousands-of-transactions), [Wikipedia — Faster Payment System (United Kingdom)](https://en.wikipedia.org/wiki/Faster_Payment_System_(United_Kingdom))

## Composite scenario: the Friday afternoon queue backlog

*(Original practice scenario — not a real event.)*

It's 4:40pm on a Friday. Your monitoring dashboard shows outbound FPS payment volume tracking normally, but the success rate has dropped from a typical 99.6% to 91% over the last twenty minutes, and the exception queue depth is climbing. No recent deployment has gone out. A handful of customer complaints are starting to come in describing payments as "stuck on pending."

**Work through it yourself first, then check the approach below.**

A reasonable investigation path: confirm scale (is this genuinely abnormal against Friday-afternoon volume patterns, which are often naturally higher?), then group the failing payments by reason or status code rather than looking at them one by one. If they cluster around a specific failure type — say, timeouts on responses from one particular downstream dependency, such as the Confirmation of Payee service or the FPS gateway itself — that points you toward an external dependency issue rather than a fault in your own validation logic. You'd check that dependency's own status or recent alerts, and if it's confirmed as degraded, the priority shifts from "fix it yourself" to "contain the backlog safely and communicate clearly" — pausing new submissions if appropriate, monitoring the queue rather than letting it silently grow, and preparing a clear, honest update for stakeholders before you have a full root cause. See [F4 · Investigating missing payments](../fps/f4-investigations/index.md) and [F8 · Live incident simulation](../fps/f8-monitoring-and-live-simulation/index.md).

## Composite scenario: the reconciliation break that wasn't a break

*(Original practice scenario — not a real event.)*

The end-of-day reconciliation report flags 40 payments as "missing" from the settlement feed compared with the internal ledger. Total value: roughly £180,000. It's tempting to treat this as a crisis.

A methodical approach: before assuming money is lost, check timing first. Settlement feeds and internal ledgers don't always update on identical schedules, so a genuine timing lag — payments that settle just after the feed cutoff — can look identical to a real missing-record break for a few hours. You'd compare a sample of the 40 payments against the following day's feed before concluding anything, then only escalate the ones still unmatched after that check. If a subset remains genuinely unmatched, the next step is comparing them for a shared pattern — same time window, same originating system, same payment type — since a shared cause is far more likely than 40 unrelated coincidences. See [F5 · Types of reconciliation break](../fps/f5-reconciliation-and-architecture/index.md).

## Composite scenario: the payment that ran twice

*(Original practice scenario — not a real event.)*

A corporate customer's payroll batch shows two identical-looking payments to the same beneficiary, same amount, four minutes apart. The customer is adamant they only submitted one.

Worth separating two possibilities before reacting: a genuine technical duplicate (a retry fired after a timeout, even though the original request had actually succeeded), or two separate legitimate submissions that happen to look alike (an accidental double-click, or a scheduled batch overlapping a manual resubmission). Checking for a shared correlation ID or message ID across the two records usually settles which one it is — a true technical duplicate typically shares upstream identifiers, while two independent submissions won't. Getting this classification right matters beyond the individual case, because it determines the fix: a technical duplicate points at a retry-handling defect worth escalating to prevent recurrence, while two independent submissions point at a process or UI issue instead. See [F4 · Duplicate payments](../fps/f4-investigations/index.md).

## Case study: why APP fraud reimbursement changed the industry's incentives

Since October 2024, UK payment firms have operated under a mandatory reimbursement regime for most authorised push payment scam victims, with the cost typically split between the sending and receiving payment firm. Industry reporting into 2025 showed total APP fraud losses still running at hundreds of millions of pounds across the first half of the year, with the large majority of in-scope claims now being reimbursed — a marked shift from reimbursement rates before the policy existed.

**Why it matters for a payments role.** Before mandatory reimbursement, the sending bank's fraud controls carried most of the practical consequence of a missed scam. Splitting liability between sending *and* receiving banks changed the incentive for every participant in the chain — a receiving bank now has a direct financial reason to monitor for mule-account activity, not just accept whatever the sending bank approved. It's a good example of how a regulatory change can reshape day-to-day operational priorities, not just compliance paperwork.

**Discussion question.** If you were designing fraud controls for a receiving bank knowing you now share reimbursement liability, what would you want to monitor that you might not have prioritised before?

Sources: [UK Finance — over £600 million stolen in H1 2025](https://www.ukfinance.org.uk/news-and-insight/press-release/over-ps600-million-stolen-fraudsters-in-first-half-2025), [Payment Systems Regulator — payment fraud falls following reimbursement scheme](https://www.psr.org.uk/news-and-updates/latest-news/news/payment-fraud-falls-by-73m-following-psr-reimbursement-scheme/)

## Other sections

- [Deep dives](../deep-dives/index.md)
- [Cheat sheets](../cheatsheets/index.md)
- [Interview preparation](../interview-prep/index.md)
- [Mock exams](../mock-exams/index.md)
- [Resources](../resources/index.md)
