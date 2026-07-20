---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes
---

# Systematic Debugging

Find root cause before any fix. Symptom patches are failure.

**Iron law:** No fixes without root-cause investigation first.

## Process

### 1. Root cause

Before proposing a fix:

1. Read errors and stack traces completely.
2. Reproduce consistently; if not reproducible, gather data — do not guess.
3. Check recent changes (diff, deps, config, environment).
4. In multi-component systems, gather evidence at each boundary before blaming one layer.
5. Trace bad values backward to origin; fix at source.

Load `root-cause-tracing.md` when the failure is deep in a call stack and origin is unclear.

### 2. Pattern

Find a working counterpart. Diff working vs broken. List every difference. Note dependencies and assumptions.

### 3. Hypothesis

One hypothesis: "X is root cause because Y." Smallest test of that variable only. If wrong, new hypothesis — do not stack fixes.

### 4. Fix

Once root cause is known:

1. Pick the task proof mode (`tdd` | `verification` | `experiment`) from the plan/assignment — do not invent ceremony.
2. Implement one focused fix at the root cause.
3. Verify with the matching proof (see below).
4. If three honest fixes fail, stop and question architecture with the human partner.

**Proof after root cause:**

| Mode | What to run |
|------|-------------|
| `tdd` | Observed RED for the bug, minimum GREEN, lasting behavior test — use `test-driven-development` |
| `verification` | Fresh focused command/scenario proving the symptom is gone — no fake RED |
| `experiment` | Execute the probe; keep artifact/result and the decision rule that follows |

Completion claims use `verification-before-completion`. Actor evidence ≠ parent acceptance.

## Supporting references

Load only when the named condition holds:

- `root-cause-tracing.md` — deep stack, need backward trace
- `defense-in-depth.md` — after root cause, adding layered validation
- `condition-based-waiting.md` — replacing arbitrary timeouts with condition polling

## Stop

- "Quick fix now, investigate later"
- Stacking multiple untested changes
- Proposing fixes before tracing data flow
- Fix attempt ≥4 without architectural discussion

## Out of scope

- Runtime workflow state, report gates, ownership metadata
- Skipping root cause because the issue "looks simple"
