---
name: test-driven-development
description: Use when the task proof mode is tdd, or when adding a lasting regression test for a permanent behavior change
---

# Test-Driven Development

Write the test first. Watch it fail for the expected reason. Write the minimum code to pass. Keep tests behavior-focused.

**Iron law (when this mode applies):** No production code for the behavior under test without an observed failing test first.

## When

**Use when:**

- Task `proofMode` / proof mode is `tdd`
- Permanent behavior change needs a lasting regression test
- Bug fix under debugging explicitly chooses TDD after root cause

**Do not use when:**

- Proof mode is `verification` or `experiment`
- Throwaway spikes, generated output, or pure config with no behavior contract
- You would fabricate RED only to satisfy ceremony

Other proof modes: see `verification-before-completion` (fresh command/scenario; experiment = executed result/artifact + decision rule).

## Cycle

### RED

1. Write one failing test for one behavior.
2. Name it by behavior. Prefer real code over mocks.
3. Run it. Confirm fail (not error) for the expected reason — missing behavior, not a typo.
4. If it passes immediately, the test is wrong. Fix the test.

### GREEN

1. Write the minimum code to pass that test.
2. No extra features, refactors, or "improvements" beyond the test.
3. Run again. Confirm pass. Fix code (not test) if still red.

### REFACTOR

Only while green: clear names, remove duplication. Do not add behavior. Stay green.

## Lasting tests

- Assert observable behavior, not implementation details or mock call counts
- One behavior per test; clear failure message
- Mocks only when unavoidable — load `testing-anti-patterns.md` when adding mocks or test-only production APIs

## Bug fixes

Root cause first (`systematic-debugging`). Then RED that reproduces the bug, GREEN at the source, keep the test.

## Stop

- Code before test under `proofMode: tdd`
- "I'll test after"
- Test passes on first run and you keep it anyway
- Universal TDD on verification/experiment work

## Out of scope

- Mandatory TDD for every feature regardless of proof mode
- Full-suite ownership (parent integrates after writer fan-in)
- Runtime enforcement of proof mode fields
