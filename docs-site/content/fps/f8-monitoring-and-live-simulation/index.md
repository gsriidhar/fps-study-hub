---
title: "Monitoring & Live Simulation"
---

# Monitoring & Live Simulation



## Lessons

- [37. Monitoring FPS Systems in Production](37-monitoring-fps-systems-in-production.md)
- [38. Incident Management](38-incident-management.md)
- [39. Root Cause Analysis](39-root-cause-analysis.md)
- [40. Live Production Simulation (End-to-End FPS Investigation)](40-live-production-simulation-end-to-end-fps-investigation.md)

## Revision summary

Production monitoring exists to surface FPS problems before customers do, using a layered view across infrastructure, messaging, application, data, and business-level health, with thresholds set against a time-and-day-aware baseline rather than a single fixed number, and a three-tier dashboard model (Executive, Operations/NOC, Engineering) giving each audience the right level of detail. Incident management takes over once a genuine problem is confirmed, moving through detection, severity triage (P1-P4, driven by actual current customer impact and scope, not technical fix difficulty), structured communication via an incident bridge with a fixed update cadence, mitigation/resolution, and a post-incident review that feeds into Root Cause Analysis. RCA goes beyond restoring the symptom to find the genuine underlying cause, typically using the 5 Whys technique against an evidence-based timeline, and translates its findings into immediate, corrective, and preventive actions — with preventive actions specifically expected to feed back into the regression pack so an understood fault can't silently recur. The capstone lesson applies all of this to four recurring real-world investigation types — failed, missing, duplicate, and settlement-mismatched payments — each with its own diagnostic pattern (status-journey divergence, receiving-bank posting windows, shared idempotency keys, and settlement cut-off timing respectively), and shows a full incident lifecycle from alert through classification, communication, recovery confirmation, and RCA in one connected worked example. This completes all 40 lessons of the FPS analyst deep-dive curriculum, from what a Faster Payment is through to independently monitoring, investigating, triaging, and resolving a live production incident.

## Flashcards

??? question "Why must FPS monitoring be proactive rather than reactive?"
    FPS runs 24/7 with fast, often irreversible payments, so faults generate customer impact almost immediately if not caught early.

??? question "What does a baseline-aware alert threshold compare against?"
    The expected normal pattern for that specific time of day and day of week, not one fixed number applied at all times.

??? question "What is alert fatigue?"
    The effect of thresholds firing too often on non-issues, which trains a team to start ignoring alerts — often more dangerous than no alert at all.

??? question "What are the three dashboard tiers?"
    Executive (high-level KPIs), Operations/NOC (live metrics and alerts), Engineering (detailed logs and diagnostics).

??? question "What determines an incident's P1-P4 severity?"
    Actual current customer impact and scope — not how technically complex the fix looks.

??? question "What is an incident bridge?"
    A continuously-open call or chat channel where all relevant teams coordinate during an active incident, run by a single Incident Manager.

??? question "What is the difference between mitigating and resolving an incident?"
    Mitigating reduces or contains impact quickly (e.g. a rollback); resolving fixes the actual underlying issue, which may come later.

??? question "What does the 5 Whys technique do?"
    Repeatedly asks 'why did that happen' from the visible symptom, using each answer as the next question, until a genuine root cause is reached.

??? question "What are the three RCA action categories?"
    Immediate (restore service now), corrective (fix the actual defect), preventive (stop the whole class of problem recurring differently).

??? question "What should RCA findings ultimately feed into?"
    The regression test pack, so an understood fault can't silently reach production again undetected.

??? question "What confirms two payment records are a genuine duplicate?"
    A shared, identical transaction ID or idempotency key on both records — not just matching amount and timing.

??? question "Why shouldn't every missing-payment complaint be escalated immediately?"
    The receiving bank has a short, normal additional window to complete posting after acceptance; a delay inside that window isn't necessarily a fault.

??? question "Why can a settlement mismatch resolve itself without real loss?"
    A payment recorded near the settlement cut-off can legitimately fall into the next day's batch, appearing as a timing gap rather than a genuine shortfall.

??? question "What is the seven-step FPS investigation framework?"
    Understand impact → identify affected payments → check payment journey → analyse logs/data → identify root cause → restore service → confirm recovery.

