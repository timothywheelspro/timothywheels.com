---
title: "Failure Mode Runbook"
description: "Diagnostic Frameworks for Troubleshooting Backward from Impact"
date: 2025-01-31
draft: false
tags: ["troubleshooting", "diagnostics", "rme", "systems-thinking", "root-cause"]
---

{{< trust-badge >}}

**Last updated:** 2025-01-31

The first instinct when something breaks is to fix it. The second instinct - the one that separates operators from engineers - is to understand why it broke.

I learned this lesson in a kitchen at 7 PM on a Saturday. The salamander stopped heating. The line cook's instinct: crank it higher. My instinct, learned from watching equipment fail too many times: check the pilot light first. Thirty seconds of diagnosis saved us from replacing a working thermostat or, worse, flooding the kitchen with unburned gas.

**The symptom is rarely the cause. The fix that addresses the symptom without finding the cause just moves the failure somewhere else.**

This runbook documents the diagnostic frameworks I use - whether I'm troubleshooting a deployment pipeline, a conveyor jam, or a process that "just feels off." The domain changes. The methodology doesn't.

---

## The Core Principle

**Troubleshoot backward from impact, not forward from assumption.**

When something fails:
- Don't start with "I bet it's X"
- Start with "What exactly is the failure?"
- Then: "What are all the things that could cause this failure?"
- Then: "How do I test each possibility without changing anything?"

Changing things before you understand the problem is how you turn one failure into three.

---

## The Diagnostic Loop

Every troubleshooting session follows the same structure:

```
OBSERVE -> ISOLATE -> TEST -> VERIFY -> DOCUMENT
```

### Observe
What exactly is happening? Not what you think is happening - what you can see, measure, or reproduce.

- "The site is broken" -> "Page X returns a 404 error"
- "The conveyor is jammed" -> "Packages are accumulating at divert point 3"
- "Pack rates are down" -> "Packer throughput dropped 30% after first break"

**Precision matters.** Vague symptoms lead to vague diagnoses.

### Isolate
What changed? What's different between working state and failed state?

- Time: When did it start? What happened just before?
- Scope: Is it affecting everything or just one component?
- Pattern: Is it constant or intermittent? Predictable or random?

**The goal:** Narrow the search space before touching anything.

### Test
Verify each hypothesis without making permanent changes.

- Can you reproduce the failure on demand?
- Does the failure persist when you isolate components?
- What happens when you revert the most recent change?

**Rule:** Test one variable at a time. Changing multiple things simultaneously destroys your ability to identify cause.

### Verify
Confirm that your fix actually fixed the problem - and didn't create new ones.

- Does the original symptom disappear?
- Does the system pass its normal health checks?
- Are there any new anomalies?

**"It seems to work now" is not verification.** Run the full test suite. Check the audit. Confirm with data.

### Document
Record what happened, what you found, and what you did.

- Timestamp
- Symptom observed
- Root cause identified
- Action taken
- Verification performed

**Documentation is future ammunition.** The next person to see this failure - including future you - will thank you.

---

## The 5-Why Framework

When you find the immediate cause, keep asking "why" until you reach something you can actually prevent.

### Example: Deployment Failure

**Symptom:** Site shows stale content after deployment.

| Why | Answer |
|-----|--------|
| Why is the content stale? | CDN is serving cached version instead of new deployment |
| Why is CDN serving cached version? | Cache invalidation didn't trigger |
| Why didn't cache invalidation trigger? | Deployment script skipped the purge step |
| Why did it skip the purge step? | Script errored silently on API timeout |
| Why did the API timeout? | Rate limit exceeded from previous failed deploys |

**Root cause:** No retry logic or error handling on cache purge API call.

**Fix:** Add retry with exponential backoff; add error handling that halts deploy if purge fails; add alerting on purge failure.

**Note:** If I'd stopped at "CDN is serving cached version," I would have manually purged and moved on. The problem would have recurred.

---

### Example: Conveyor Jam (RME Context)

**Symptom:** Packages accumulating at divert point, line backing up.

| Why | Answer |
|-----|--------|
| Why are packages accumulating? | Divert not firing, packages continuing straight |
| Why is divert not firing? | PLC not receiving trigger signal |
| Why is PLC not receiving signal? | Photoeye not detecting packages |
| Why is photoeye not detecting? | Lens obscured by dust/debris buildup |
| Why is there debris buildup? | PM schedule doesn't include photoeye cleaning |

**Root cause:** Preventive maintenance gap - photoeye cleaning not on PM checklist.

**Fix:** Add photoeye lens inspection/cleaning to weekly PM. Immediate: clean lens, verify detection, monitor.

**Note:** If I'd stopped at "divert not firing," I might have replaced a working divert mechanism. The 5-Why found a $0 fix (cleaning) and a process improvement (PM update) instead of a $500 part replacement.

---

### Example: Rate Variance (Operations Context)

**Symptom:** Pack rates varying 30% between shifts with similar staffing.

| Why | Answer |
|-----|--------|
| Why are rates varying? | Some shifts completing more units per hour |
| Why are some shifts faster? | Less downtime waiting for work |
| Why is there downtime waiting? | Bins running empty before restock |
| Why are bins running empty? | Waterspider restocking reactively, not predictively |
| Why reactive restocking? | No visibility into consumption rate; waiting for "empty" signal |

**Root cause:** Information gap - Waterspider lacks consumption rate data to anticipate need.

**Fix:** Implement consumption rate monitoring. Train predictive restocking based on rate, not empty bins.

---

## Diagnostic Decision Trees

For common failure modes, pre-built decision trees accelerate diagnosis.

### Deployment Pipeline Failure

```
Site not loading correctly
├── Check: Can you reach the domain?
│   ├── No -> DNS issue
│   │   ├── Check DNS propagation
│   │   ├── Verify nameserver config
│   │   └── Check domain registration status
│   └── Yes -> Continue
├── Check: Is the server responding?
│   ├── No -> Hosting issue
│   │   ├── Check Vercel status page
│   │   ├── Verify deployment completed
│   │   └── Check for build errors in logs
│   └── Yes -> Continue
├── Check: Is content correct?
│   ├── No -> Content/cache issue
│   │   ├── Run `make audit` for hash verification
│   │   ├── Check CDN cache status
│   │   ├── Force cache purge and reverify
│   │   └── Compare local build to deployed files
│   └── Yes -> Continue
└── Check: Are assets loading?
    ├── No -> Asset path issue
    │   ├── Check browser console for 404s
    │   ├── Verify asset paths in HTML
    │   └── Check build output for missing files
    └── Yes -> Issue may be intermittent; monitor
```

### Conveyor System Failure (RME Context)

```
Conveyor stopped or jamming
├── Check: Is E-stop engaged?
│   ├── Yes -> Determine why; reset only after verification
│   └── No -> Continue
├── Check: Is motor running?
│   ├── No -> Power/motor issue
│   │   ├── Check breaker/disconnect
│   │   ├── Verify motor starter status
│   │   ├── Check for thermal overload trip
│   │   └── Inspect motor for damage/noise
│   └── Yes -> Continue
├── Check: Is belt/chain moving?
│   ├── No -> Mechanical issue
│   │   ├── Check belt tension
│   │   ├── Inspect for broken belt/chain
│   │   ├── Check drive coupling
│   │   └── Look for obstruction in drive
│   └── Yes -> Continue
├── Check: Are packages moving?
│   ├── No -> Accumulation/jam
│   │   ├── Clear jam point
│   │   ├── Identify jam source (upstream issue?)
│   │   ├── Check for damaged packages
│   │   └── Verify sensor alignment
│   └── Yes -> Continue
└── Check: Are packages routing correctly?
    ├── No -> Control/sensor issue
    │   ├── Check photoeye alignment and cleanliness
    │   ├── Verify PLC inputs/outputs
    │   ├── Check scanner read rate
    │   └── Review divert timing
    └── Yes -> System operational; monitor
```

### Process Health Decline (Operations Context)

```
Rates/quality declining
├── Check: Is it across all stations or localized?
│   ├── Localized -> Station-specific issue
│   │   ├── Check equipment at that station
│   │   ├── Check staffing/training at that station
│   │   └── Check material flow to that station
│   └── All stations -> Systemic issue; continue
├── Check: When did it start?
│   ├── Shift start -> Setup/handoff issue
│   │   ├── Review shift handoff notes
│   │   ├── Check staffing plan vs. actual
│   │   └── Verify equipment startup completed
│   └── Mid-shift -> Something changed; continue
├── Check: What changed at that time?
│   ├── Volume change -> Capacity issue
│   ├── Staffing change -> Coverage issue
│   ├── Equipment event -> Mechanical issue
│   └── Nothing obvious -> Hidden variable; investigate
└── Check: Are associates signaling anything?
    ├── Yes -> Follow their signal
    │   ├── "Equipment feels different"
    │   ├── "We're working around something"
    │   └── "This keeps happening"
    └── No -> Check metrics for leading indicators
```

---

## Emergency Recovery Protocols

When the situation is critical, you need protocol, not improvisation.

### Deployment Emergency: Site Down

**Priority:** Restore service. Investigate later.

1. **Assess:** Confirm site is actually down (not local issue)
2. **Rollback:** Deploy last known good commit immediately
3. **Verify:** Confirm site is up with `make audit`
4. **Communicate:** Update stakeholders that service is restored
5. **Investigate:** Root cause analysis on failed deployment
6. **Prevent:** Implement fix to prevent recurrence

**Time target:** Service restored within 15 minutes.

### Equipment Emergency: Safety Event

**Priority:** People first. Equipment second.

1. **Stop:** E-stop engaged, energy isolated
2. **Assess:** Anyone injured? Scene safe?
3. **Secure:** Establish perimeter, prevent access
4. **Report:** Notify supervisor, safety, maintenance
5. **Document:** Preserve scene, note conditions
6. **Investigate:** Root cause only after safety confirmed

**Rule:** Never restart equipment after a safety event without understanding why it happened.

### Process Emergency: Critical Metric Failure

**Priority:** Stop the bleeding, then diagnose.

1. **Acknowledge:** Confirm the metric is accurate, not data error
2. **Contain:** What's the immediate impact? What can we stop?
3. **Triage:** What's causing the largest portion of the problem?
4. **Act:** Address the largest contributor first
5. **Monitor:** Is the intervention working?
6. **Escalate:** If not improving, bring in additional resources

---

## Common Failure Patterns

Failures cluster around predictable patterns. Knowing them accelerates diagnosis.

### The Silent Error

**Pattern:** Process completes without error message, but output is wrong.

**Cause:** Missing validation. System doesn't check its own work.

**Prevention:** Build verification into every critical step. If it matters, check it.

**Example:** Deployment "succeeds" but serves stale content because cache purge failed silently.

### The Cascade

**Pattern:** One small failure triggers multiple downstream failures.

**Cause:** Tight coupling without isolation. No circuit breakers.

**Prevention:** Design for graceful degradation. Isolate failure domains.

**Example:** One jammed package causes conveyor backup, which causes upstream accumulation, which triggers weight fault, which stops the entire line.

### The Intermittent

**Pattern:** Problem appears and disappears unpredictably.

**Cause:** Often environmental (temperature, load, timing) or resource exhaustion.

**Prevention:** Log everything. Correlate failure times with external variables.

**Example:** Scanner read rate drops every afternoon. Correlation: direct sunlight on scanner lens from 2-4 PM.

### The Workaround That Became Normal

**Pattern:** Associates have been working around a problem so long they forgot it's a problem.

**Cause:** Initial "temporary fix" never got properly resolved.

**Prevention:** Track workarounds formally. Schedule permanent fixes.

**Example:** "We always skip that divert because it jams." Why does it jam? "It's always jammed."

### The Wrong Fix

**Pattern:** Problem "fixed" but recurs. Or new problem appears.

**Cause:** Addressed symptom, not cause. Or fix introduced new issue.

**Prevention:** 5-Why to root cause. Verification after fix. Monitor for recurrence.

**Example:** Replaced motor on conveyor that kept stopping. Still stops. Actual cause: thermal overload from belt tension, not motor failure.

---

## Documentation Template

Use this format for every significant troubleshooting event:

```markdown
## Incident: [Brief description]
**Date:** YYYY-MM-DD HH:MM
**Duration:** X minutes/hours
**Severity:** Low / Medium / High / Critical

### Symptom
[Exact observation that triggered investigation]

### Timeline
- HH:MM — [First observation]
- HH:MM — [Diagnostic step taken]
- HH:MM — [Root cause identified]
- HH:MM — [Fix implemented]
- HH:MM — [Verification completed]

### Root Cause
[5-Why analysis result]

### Resolution
[What was done to fix it]

### Verification
[How we confirmed the fix worked]

### Prevention
[What changes prevent recurrence]

### Lessons Learned
[What we know now that we didn't before]
```

---

## The Mindset

Troubleshooting is not about being smart. It's about being systematic.

The best troubleshooters I've worked with share three traits:

1. **Patience:** They don't rush to fix before they understand.
2. **Curiosity:** They ask "why" until they hit bedrock.
3. **Humility:** They document for others, knowing they won't remember either.

The goal isn't to be the hero who fixes everything. The goal is to build systems - and knowledge bases - where fewer things break, and when they do, anyone can fix them.

---

## Connection to Control Your World

Failure mode analysis is one instantiation of the CYW principle: **systems that fail predictably can be defended against.**

The same diagnostic discipline appears across the framework:
- **Stoplight Process Health:** Detect drift before it becomes failure
- **Threat Model Analysis:** Identify failure modes before they occur
- **This Runbook:** Diagnose and resolve failures systematically

Whether the system is software, hardware, or human, the pattern holds:

1. Observe precisely
2. Isolate variables
3. Test hypotheses
4. Verify fixes
5. Document for the future

**This is how you Control Your World.**

---

**Related Resources:**
- [RME Translation Packet](/frameworks/rme-translation-packet/) — How deployment thinking maps to reliability engineering
- [Threat Model Analysis](/frameworks/threat-model-analysis/) — Identifying failure modes before they occur
- [Awareness in Action](/awareness-in-action/) — Early-warning systems for operational drift

---

**The symptom is rarely the cause. Keep asking why.**

*This is how you Control Your World.*
