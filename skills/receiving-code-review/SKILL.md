---
name: receiving-code-review
description: Use when receiving code review feedback, before implementing suggestions — verify technically, do not performatively agree or blindly apply
---

# Receiving Code Review

Verify feedback against the codebase. Technical correctness over social comfort.

## Process

1. **Read** all items without implementing.
2. **Clarify** anything unclear before coding.
3. **Verify** each claim in the repo (code, tests, git history, platforms).
4. **Evaluate** whether it is right for *this* codebase.
5. **Respond** with technical acknowledgment or reasoned pushback.
6. **Implement** accepted items one at a time with proof.

## Bugs from review

If feedback is an accepted **bug or failing behavior**:

1. Route through `systematic-debugging` — establish root cause before the fix.
2. Then apply the task proof mode (`tdd` | `verification` | `experiment`).
3. Do not "just patch" a review comment that is really a defect.

## Push back when

- Breaks existing behavior or partner decisions
- Reviewer lacks context
- YAGNI / unused surface
- Technically wrong for this stack

Push back with evidence, not defensiveness.

## Implementation order

1. Blocking (breakage, security, data loss)
2. Simple accepted fixes
3. Larger accepted changes

Test each. No batch-and-hope.

## Forbidden

- Performative agreement ("You're absolutely right!", "Great point!")
- Implementing before verification
- Partial understanding of a multi-item list
- Skipping debugging for accepted bugs

## Out of scope

- Runtime reviewer policy gates
- Inventing severity the parent did not ask you to enforce
