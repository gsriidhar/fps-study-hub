---
title: "Direct vs Indirect Access"
lesson_number: 3
track: "FPS analyst deep-dive"
block: "FPS Fundamentals"
tags: ["FPS Fundamentals", "Direct vs Indirect Access"]
summary: "Explain the difference between direct and indirect FPS participants, what a sponsor bank does, and why the distinction between payment processing and settlement matters for investi"
---
# 3. Direct vs Indirect Access

!!! abstract "Learning objective"
    Explain the difference between direct and indirect FPS participants, what a sponsor bank does, and why the distinction between payment processing and settlement matters for investigations.

## Core concepts

Not every organisation that lets you send an FPS payment actually connects to FPS itself. A direct participant holds its own scheme membership, has its own gateway, and exchanges messages with Pay.UK directly — mostly the larger, established banks, since direct membership comes with real cost and operational obligations (you have to run and support the connection, meet scheme technical standards, and participate directly in settlement). An indirect participant — commonly a fintech, challenger bank, building society, or e-money institution — reaches FPS through a sponsor bank instead: a direct participant that resells its own scheme connection, providing connectivity, message routing, settlement support, and often operational help to organisations that don't want to build all of that themselves. It's a faster, cheaper way into the scheme, at the cost of depending on someone else's infrastructure.

A second distinction that trips people up: processing and settlement are not the same thing. Processing is what happens in the seconds after you hit send — the payment is sent, received, and the beneficiary's account is credited. Settlement is the separate, ongoing process of squaring up the actual money owed between institutions: if Bank A's customers sent £1,000 to Bank B in a day, and Bank B's customers sent £700 back to Bank A, the two banks don't settle each transaction individually — they settle the £300 net position. For indirect participants, that settlement obligation is typically handled by their sponsor bank on their behalf.

## Visual overview

## Key terms

**Direct participant**
:   Holds its own FPS scheme membership and gateway; connects to Pay.UK directly.

**Indirect participant**
:   Reaches FPS through a sponsor bank's connection rather than its own — common for fintechs and smaller institutions.

**Sponsor bank**
:   A direct participant that provides connectivity, routing, settlement support, and operational help to indirect participants.

**Processing**
:   The real-time flow of sending, receiving, and crediting an individual payment — happens in seconds.

**Settlement**
:   The periodic process of calculating and transferring the net amount owed between institutions across many payments.

## Worked example

!!! example
    A new challenger bank launches a savings and payments app but hasn't built its own FPS gateway or joined the scheme directly — doing so would take months and significant investment it doesn't need on day one. Instead it partners with an established high street bank as its sponsor: customer payments flow from the challenger's app, through the sponsor bank's FPS connection, into the scheme, exactly as if the challenger were connected itself, just one hop further back.

## Comparison

**Direct vs indirect participation**

| Factor | Direct | Indirect |
|---|---|---|
| Own FPS connection | Yes | No — uses a sponsor |
| Operational control | High | Medium, shared with sponsor |
| Cost | Higher | Lower |
| Technical complexity | Higher | Lower |
| Time to market | Longer | Faster |

## Key points

- Direct participants connect to FPS themselves; indirect participants go through a sponsor bank.
- Sponsor banks provide connectivity, routing, settlement, and often operational support.
- Fintechs commonly choose indirect access to reach market faster and avoid the cost/complexity of direct membership.
- Processing (seconds) and settlement (net positions between institutions, periodic) are separate concepts — don't conflate them.

## Exam & interview tips

!!! tip
    - A strong interview answer names all three things a sponsor bank provides: connectivity, settlement support, and (often) operational support — not just "access".
    - Don't say processing and settlement are the same step; examiners and interviewers specifically probe this distinction.

!!! note "Memory trick"
    Direct = your own front door to FPS. Indirect = you use someone else's front door (the sponsor) and pay them for the privilege of speed to market.

## Scenario questions

??? question "An interviewer asks you to explain direct vs indirect participation in one or two sentences. What do you say?"
    A direct participant connects to FPS through its own gateway and scheme membership; an indirect participant accesses FPS through a sponsor bank, which provides connectivity, settlement support, and operational help — a common route for fintechs wanting faster, lower-cost market entry.

??? question "A customer of an indirect-participant fintech reports a stuck payment. What extra step does your investigation need, compared to a direct participant's payment?"
    You need to establish whether the issue sits with the fintech itself, the sponsor bank's systems, or the sponsor's connectivity to FPS — one more potential point of failure than a direct participant's payment has.

??? question "Why doesn't 'the payment was sent' necessarily mean 'the payment has settled'?"
    Sending/crediting is the real-time processing step; settlement — the actual transfer of net funds owed between institutions — happens on its own schedule and is a separate process from an individual payment reaching the beneficiary's account.

## Practice questions

??? question "1. What does a sponsor bank provide to an indirect participant?"
    ▫️ Marketing support only
    ✅ Connectivity, routing, settlement, and often operational support
    ▫️ A banking licence
    ▫️ Nothing — indirect participants are unsupported

??? question "2. Which type of organisation most commonly uses indirect access?"
    ▫️ Large established high street banks
    ✅ Fintechs and smaller institutions
    ▫️ The Bank of England
    ▫️ Pay.UK itself

??? question "3. Processing and settlement differ in that:"
    ▫️ They are the same thing
    ✅ Processing is the real-time transaction flow; settlement nets obligations between institutions over time
    ▫️ Settlement happens before processing
    ▫️ Only direct participants settle

??? question "4. Why might a fintech prefer indirect access despite the ongoing dependency?"
    ▫️ It's mandatory by law
    ✅ Faster time to market and lower upfront cost/complexity
    ▫️ It's the only legal option
    ▫️ Direct access is being discontinued

??? question "5. If Bank A's customers send £1,000 to Bank B and Bank B's customers send £700 to Bank A in a day, what is the net settlement position?"
    ▫️ Bank B owes Bank A £1,700
    ✅ Bank A owes Bank B £300
    ▫️ No settlement is needed
    ▫️ Bank A owes Bank B £1,000

??? question "6. A sponsor bank's connectivity fails. Who is most immediately affected?"
    ▫️ Only the sponsor bank
    ✅ The indirect participants relying on that connection
    ▫️ Pay.UK's core infrastructure
    ▫️ No one, FPS has no single points of failure

