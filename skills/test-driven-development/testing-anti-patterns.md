# Testing Anti-Patterns

**Load this reference when:** writing or changing tests, adding mocks, or tempted to add test-only methods to production code.

## Rules

1. Never test mock behavior — assert real outcomes.
2. Never add test-only methods to production classes — put helpers in test utils.
3. Never mock without understanding side effects the test needs.
4. Mock complete structures (real API shape), not partial guesses.
5. Prefer a small integration test over a brittle mock tower.

## Checks

Before asserting on a mock: "Am I testing the system or the fake?"

Before adding a production method: "Is this only for tests?" If yes, do not add it.

Before mocking: run once with real deps if feasible; mock only the slow/external edge.

## Prefer

| Prefer | Avoid |
|--------|--------|
| Behavior assertion on real result | `toHaveBeenCalled` as sole proof |
| Test-utils cleanup | `destroy()` only used in tests |
| Mock at the I/O boundary | Mocking the unit under test |
| Full response fixtures | One-field partial stubs |
