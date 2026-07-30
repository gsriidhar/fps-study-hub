---
title: "Systems & SQL"
---

# Systems & SQL



## Lessons

- [26. Middleware (MQ, Kafka, Tibco)](26-middleware-mq-kafka-tibco.md)
- [27. Databases in FPS Systems](27-databases-in-fps-systems.md)
- [28. SQL Basics for Payment Analysts](28-sql-basics-for-payment-analysts.md)
- [29. Failed Payment Analysis Using SQL](29-failed-payment-analysis-using-sql.md)
- [30. Operational Reporting](30-operational-reporting.md)

## Revision summary

Middleware (MQ, Kafka, Tibco) lets separately-built banking systems exchange messages reliably without direct point-to-point wiring — MQ suits guaranteed, transactional point-to-point delivery (message removed once consumed), Kafka suits high-volume, multi-consumer event broadcasting with replay (events retained), and Tibco commonly bridges legacy platforms in merger-history banks. FPS payment data lives across related tables — PAYMENT (core record), PAYMENT_STATUS_HISTORY (where processing actually stopped), MESSAGE (what systems really said to each other), ERROR_LOG, and RECONCILIATION — with primary keys, foreign keys, indexes and transactions as the core relational concepts, typically split across Oracle (core ledger), SQL Server (mid-tier/reporting), and increasingly PostgreSQL (cloud-native) at tier-1 banks. SQL basics — SELECT/FROM/WHERE, AND/OR, ORDER BY, DISTINCT, COUNT, date-range and reason-code filtering, and joins to settlement/reconciliation tables — let an analyst answer operational questions independently rather than waiting on another team, with the settlement join specifically being what proves a payment actually cleared the scheme rather than just what the bank's own system believes. Failed payment analysis follows count → group by reason → group by time → group by system, with the time a spike started usually the most diagnostic clue, a trailing-average comparison distinguishing genuine anomalies from normal variation, and some failures only becoming visible later via a return or exception rather than the payment's own status field. Operational reporting turns raw data into audience-specific action: exception queue reports run intraday (time-sensitive SLAs), daily volume and success/failure rate reports serve operations and duty managers, and weekly reports serve senior management for trend and capacity — with the defining discipline being to always pair a number with context (a baseline, a cause) rather than reporting a bare figure.

## Flashcards

??? question "MQ vs Kafka — the core difference?"
    MQ: point-to-point, message removed once consumed. Kafka: retained, multi-consumer topics supporting replay.

??? question "Why does a growing queue depth point at a consumer problem?"
    Messages are waiting because whatever should be reading and processing them has slowed or stopped — the backlog is a symptom of the consumer, not the queue itself.

??? question "What's the difference between current status and status history?"
    Current status shows where a payment is now; status history shows the full sequence and reveals exactly where it stopped progressing.

??? question "Why check the MESSAGE table, not just the PAYMENT table's status?"
    The status field can be generic (e.g. SUBMITTED), while the message table often reveals the specific underlying event, like a gateway timeout.

??? question "What does a primary key guarantee?"
    No two rows in a table share the same identifying value — every record can be uniquely found and referenced.

??? question "AND vs OR in a WHERE clause?"
    AND narrows results (every condition must be true). OR widens results (any one condition is enough).

??? question "Why join payments to a settlement table?"
    The payment table only reflects what the bank's own system believes happened; the join confirms whether the payment actually cleared through the scheme.

??? question "What's the single most diagnostic clue in a failure spike investigation?"
    Exactly when the spike started — it usually points straight at a deployment or infrastructure event.

??? question "Why might a COMPLETED payment still need investigating as a failure?"
    It may be returned later by the receiving bank, revealing a problem only visible via a join to the returns/exception table, not the payment's own status.

??? question "Why does an exception queue report run hourly rather than daily?"
    Exceptions carry time-based SLAs — a once-daily report would discover breaches far too late to act on.

??? question "What's the core habit of a strong operational report?"
    Always pairing a raw figure with context — a baseline or a cause — rather than reporting a bare number.

