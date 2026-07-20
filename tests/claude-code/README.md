# Claude Code Skills Tests

Harness helpers for optional Claude Code CLI checks.

## Status

Lean OMP cutover removed the SDD controller, worktree controller, and
CLI skill tests that depended on them:

- `test-subagent-driven-development.sh`
- `test-subagent-driven-development-integration.sh`
- `test-sdd-workspace.sh`
- `test-task-brief.sh`
- `test-worktree-native-preference.sh`
- `test-worktree-path-policy.sh`

Focused package contracts now live in:

```bash
node --test \
  tests/pi/test-pi-extension.mjs \
  tests/omp/test-development-routing.mjs \
  tests/omp/test-planning-execution-contract.mjs
```

## Helpers retained

### test-helpers.sh
Common functions if a future Claude CLI check is added:

- `run_claude "prompt" [timeout]`
- `assert_contains` / `assert_not_contains` / `assert_count` / `assert_order`
- `create_test_project` / `create_test_plan`

### run-skill-tests.sh

Runner remains for optional future CLI tests. With no registered entries it
exits 0 and points at the Node contract suite above.

```bash
./run-skill-tests.sh
./run-skill-tests.sh --help
```
