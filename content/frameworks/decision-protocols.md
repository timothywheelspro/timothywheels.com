---
title: "Decision Protocols"
subtitle: "Routing complex problems to the right specialists"
date: 2026-01-31
draft: false
tags: ["operations", "decision-making", "rme", "systems-thinking"]
description: "A practical protocol for routing decisions, enforcing quality gates, and protecting system stability."
---

## Why This Exists

Operations break down when every decision is treated as urgent and handled by whoever is available. Reliable systems route the right decisions to the right specialists and enforce verification steps before deployment.

This protocol keeps decisions traceable, auditable, and aligned with uptime.

---

## The Routing Stack

**Level 1: Frontline Triage**  
Classify the issue, isolate impact, and prevent escalation.

**Level 2: Domain Specialist**  
Assign to the tech with the most relevant system context.

**Level 3: Root Cause Review**  
Capture the failure mode, contributing factors, and next steps.

**Level 4: Decision Gate**  
Approve changes only after evidence confirms the fix.

---

## The Five Decision Gates

**Gate 1: Safety**  
Does the change introduce a new hazard or bypass a lockout?

**Gate 2: Stability**  
Does the change affect uptime or create a new failure mode?

**Gate 3: Reversibility**  
Can we roll back within one shift if the fix fails?

**Gate 4: Documentation**  
Is the change recorded with a clear rationale and owner?

**Gate 5: Validation**  
Has the system been tested under load or simulated conditions?

---

## Failure Modes This Prevents

- Band-aid fixes that create downstream outages
- Conflicting changes during multiple shifts
- Loss of historical context when techs rotate
- Unverified fixes that return within 72 hours

---

## Field Checklist

1. Define the system boundary and affected assets  
2. Assign to the specialist who owns that boundary  
3. Verify safety and reversibility before action  
4. Apply change and record the method  
5. Validate under operational conditions

---

## Example: Conveyor Line Fault

**Symptom:** Motor stalls every 30 minutes.  
**Triage:** Isolate line, capture logs, check thermal readings.  
**Specialist:** Mechanical lead confirms bearing wear.  
**Decision Gate:** Replace bearing, document torque spec, validate with a 4-hour run.  
**Outcome:** Fault removed, history preserved for preventative maintenance.

---

## RME Translation

This protocol aligns with:
- Standard Work documentation
- Root cause analysis expectations
- Reliability-centered maintenance
- Shift-to-shift continuity

See also: [Quality Gates](/frameworks/quality-gates) -- Preventive checks that keep systems stable.
