---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs — requires fresh verification evidence before any success claim
---

# Verification Before Completion

Evidence before claims. Fresh run in this turn — not memory, not earlier logs.

**Iron law:** No completion claims without fresh verification evidence.

## Gate

Before any success/completion/fixed/passing language, commit, or PR:

1. **Identify** the command or scenario that proves the claim.
2. **Run** it fresh (full enough to be decisive).
3. **Read** exit code and relevant output.
4. **Claim only what the output supports.**

Skip any step = do not claim.

## Proof modes (planning guidance)

Proof mode is assignment/plan guidance — not a runtime schema field.

| Mode | Evidence |
|------|----------|
| `tdd` | Observed RED for expected reason, then minimum GREEN; lasting behavior test. Do not fake RED after the fact. |
| `verification` | One fresh focused command or scenario. No fabricated RED ceremony. |
| `experiment` | Execute the probe; keep the result or artifact and the decision rule (ship / retry / abandon). |

This skill gates the **claim**. It does not choose the mode — the task/plan does.

## Actor vs parent

- Your command output supports **your** status summary.
- **Parent acceptance remains separate** — parent maps Acceptance to evidence and decides integration.
- Passing focused proof ≠ parent merged/accepted the work.
- Do not treat this gate as an acceptance matrix, report gate, or persisted verdict.

## Insufficient

| Claim | Not enough |
|-------|------------|
| Tests pass | Previous run, "should pass" |
| Bug fixed | Code changed, symptom not re-checked |
| Agent done | Agent prose without command/diff check |
| Requirements met | Green tests alone without checklist against plan |

## Stop

- "Should work", "looks good", "probably fine"
- Satisfaction language before the command runs
- Trusting delegated success without independent check
- Inventing RED solely to satisfy TDD when mode is verification/experiment

## Out of scope

- Parent integration suite ownership
- Runtime completion gates or workflow state
- Replacing `systematic-debugging` root-cause work
