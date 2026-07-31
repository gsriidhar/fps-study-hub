# SQL for payments cheat sheet

<div class="cheat-page" style="--cheat-accent:#d97706;" markdown="1">

Runnable-style query patterns for payments investigation and reconciliation work, using a simple illustrative schema:

```sql
-- payments(payment_id, status, amount, currency, sender_account,
--          receiver_account, channel, created_at, settled_at)
-- returns(return_id, original_payment_id, reason_code, created_at)
-- ledger_entries(entry_id, account_id, direction, amount, posted_at, payment_id)
-- bank_statement_lines(line_id, account_id, amount, value_date, reference)
```

For the concepts behind these, see [F6: Systems and SQL](../../fps/f6-systems-and-sql/index.md).

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Core lookups</p>

```sql
-- Find a specific payment by its reference
SELECT payment_id, status, amount, created_at
FROM payments
WHERE payment_id = 'PMT-2026-004821';

-- All payments for an account in the last 24 hours
SELECT payment_id, status, amount, created_at
FROM payments
WHERE sender_account = '10023456'
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Count payments by status for today
SELECT status, COUNT(*) AS payment_count
FROM payments
WHERE created_at >= CURRENT_DATE
GROUP BY status
ORDER BY payment_count DESC;
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Finding stuck or stale payments</p>

```sql
-- Payments still pending after 30 minutes (a common SLA breach signal)
SELECT payment_id, status, created_at
FROM payments
WHERE status = 'PENDING'
  AND created_at < NOW() - INTERVAL '30 minutes'
ORDER BY created_at ASC;

-- Payments that were submitted but never settled, grouped by age bucket
SELECT
  CASE
    WHEN NOW() - created_at < INTERVAL '1 hour' THEN 'under 1h'
    WHEN NOW() - created_at < INTERVAL '4 hours' THEN '1-4h'
    ELSE 'over 4h'
  END AS age_bucket,
  COUNT(*) AS stuck_count
FROM payments
WHERE status IN ('SUBMITTED', 'PENDING')
GROUP BY age_bucket;
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Duplicate detection</p>

```sql
-- Exact duplicate payments: same sender, receiver, amount, same minute
SELECT sender_account, receiver_account, amount,
       DATE_TRUNC('minute', created_at) AS minute_bucket,
       COUNT(*) AS occurrences
FROM payments
GROUP BY sender_account, receiver_account, amount, minute_bucket
HAVING COUNT(*) > 1;

-- Same query, but surfacing the actual duplicate rows (not just the count)
SELECT p.*
FROM payments p
JOIN (
  SELECT sender_account, receiver_account, amount,
         DATE_TRUNC('minute', created_at) AS minute_bucket
  FROM payments
  GROUP BY sender_account, receiver_account, amount, minute_bucket
  HAVING COUNT(*) > 1
) dup
  ON p.sender_account = dup.sender_account
 AND p.receiver_account = dup.receiver_account
 AND p.amount = dup.amount
 AND DATE_TRUNC('minute', p.created_at) = dup.minute_bucket
ORDER BY p.sender_account, p.created_at;
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Reconciliation and ledger breaks</p>

```sql
-- Payments with no matching ledger entry (a posting gap)
SELECT p.payment_id, p.amount, p.status
FROM payments p
LEFT JOIN ledger_entries le ON le.payment_id = p.payment_id
WHERE le.entry_id IS NULL
  AND p.status = 'COMPLETED';

-- Full reconciliation break report: ledger vs. bank statement
SELECT
  COALESCE(le.entry_id, 'MISSING') AS ledger_entry,
  COALESCE(bsl.line_id, 'MISSING') AS statement_line,
  le.amount AS ledger_amount,
  bsl.amount AS statement_amount
FROM ledger_entries le
FULL OUTER JOIN bank_statement_lines bsl
  ON le.reference = bsl.reference
 AND le.amount = bsl.amount
WHERE le.entry_id IS NULL OR bsl.line_id IS NULL;

-- Daily debit/credit balance check per account (should net to the day's movement)
SELECT account_id,
       SUM(CASE WHEN direction = 'CREDIT' THEN amount ELSE 0 END) AS total_credits,
       SUM(CASE WHEN direction = 'DEBIT' THEN amount ELSE 0 END) AS total_debits,
       SUM(CASE WHEN direction = 'CREDIT' THEN amount ELSE -amount END) AS net_movement
FROM ledger_entries
WHERE posted_at >= CURRENT_DATE
GROUP BY account_id;
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Failed and returned payments</p>

```sql
-- Payments that show COMPLETED internally but were later returned
-- (the "delayed visibility" pattern — status alone doesn't tell the full story)
SELECT p.payment_id, p.status AS internal_status, r.reason_code, r.created_at AS return_date
FROM payments p
JOIN returns r ON r.original_payment_id = p.payment_id
WHERE p.status = 'COMPLETED';

-- Return reason breakdown, most common first
SELECT reason_code, COUNT(*) AS occurrences
FROM returns
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY reason_code
ORDER BY occurrences DESC;

-- Failure rate by channel, last 7 days
SELECT channel,
       COUNT(*) FILTER (WHERE status = 'FAILED') AS failed,
       COUNT(*) AS total,
       ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'FAILED') / COUNT(*), 2) AS failure_pct
FROM payments
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY channel
ORDER BY failure_pct DESC;
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Window functions</p>

```sql
-- Running total of payment value per account, ordered by time
SELECT payment_id, sender_account, amount, created_at,
       SUM(amount) OVER (
         PARTITION BY sender_account
         ORDER BY created_at
       ) AS running_total
FROM payments;

-- Rank each payment's size within its own account (largest = 1)
SELECT payment_id, sender_account, amount,
       RANK() OVER (PARTITION BY sender_account ORDER BY amount DESC) AS size_rank
FROM payments;

-- Time since the previous payment from the same account (velocity check)
SELECT payment_id, sender_account, created_at,
       created_at - LAG(created_at) OVER (
         PARTITION BY sender_account ORDER BY created_at
       ) AS gap_since_previous
FROM payments;

-- Split payments into value quartiles for a quick distribution view
SELECT payment_id, amount,
       NTILE(4) OVER (ORDER BY amount) AS value_quartile
FROM payments;
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">CTEs for readable investigations</p>

```sql
-- Break a multi-step investigation into named, readable stages
WITH recent_payments AS (
  SELECT * FROM payments
  WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
),
flagged AS (
  SELECT * FROM recent_payments
  WHERE amount > 10000 OR status = 'FAILED'
)
SELECT f.payment_id, f.amount, f.status, r.reason_code
FROM flagged f
LEFT JOIN returns r ON r.original_payment_id = f.payment_id
ORDER BY f.amount DESC;
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Set operations and idempotency</p>

```sql
-- UNION removes duplicate rows across two result sets; UNION ALL keeps everything
SELECT payment_id FROM payments WHERE status = 'FAILED'
UNION
SELECT payment_id FROM payments WHERE status = 'REVERSED';

-- Safe re-insert of a payment record without erroring on a repeat run
INSERT INTO payments (payment_id, status, amount, created_at)
VALUES ('PMT-2026-004821', 'COMPLETED', 250.00, NOW())
ON CONFLICT (payment_id) DO NOTHING;

-- Upsert variant: insert, or update status if the payment already exists
INSERT INTO payments (payment_id, status, amount, created_at)
VALUES ('PMT-2026-004821', 'COMPLETED', 250.00, NOW())
ON CONFLICT (payment_id)
DO UPDATE SET status = EXCLUDED.status;
```

</div>

<div class="cheat-code-section" markdown="1">
<p class="cheat-section-title">Quick reference: clauses and operators</p>
</div>

<div class="cheat-grid" markdown="1">

<div class="cheat-section" markdown="1">
<div class="cheat-entry" markdown="1">
<span class="cheat-term">HAVING vs WHERE</span>
<p class="cheat-def">WHERE filters rows before grouping. HAVING filters groups after aggregation — needed for conditions like <code>COUNT(*) > 1</code>.</p>
</div>
<div class="cheat-entry" markdown="1">
<span class="cheat-term">LEFT JOIN + IS NULL</span>
<p class="cheat-def">The standard pattern for "find rows in A with no match in B" — filter the right-hand side's key for NULL after the join.</p>
</div>
<div class="cheat-entry" markdown="1">
<span class="cheat-term">FULL OUTER JOIN</span>
<p class="cheat-def">Keeps unmatched rows from both sides — the right shape for a two-sided reconciliation break report.</p>
</div>
</div>

<div class="cheat-section" markdown="1">
<div class="cheat-entry" markdown="1">
<span class="cheat-term">COUNT(*) FILTER (WHERE ...)</span>
<p class="cheat-def">Conditional aggregation in one pass — cleaner than multiple CASE-wrapped SUMs for simple counts.</p>
</div>
<div class="cheat-entry" markdown="1">
<span class="cheat-term">DATE_TRUNC</span>
<p class="cheat-def">Rounds a timestamp down to a given precision (minute, hour, day) — the standard way to bucket events for grouping.</p>
</div>
<div class="cheat-entry" markdown="1">
<span class="cheat-term">ON CONFLICT DO NOTHING/UPDATE</span>
<p class="cheat-def">Postgres's idempotent-write pattern — safe to re-run the same insert without creating duplicates or erroring.</p>
</div>
</div>

</div>

</div>

## Other sections

[Cheat sheets home](../index.md) · [Deep dives](../../deep-dives/index.md) · [Interview prep](../../interview-prep/index.md) · [Mock exams](../../mock-exams/index.md)
