#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TASK_BRIEF="$ROOT/skills/subagent-driven-development/scripts/task-brief"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
FAILURES=0

pass() { echo "  [PASS] $1"; }
fail() { echo "  [FAIL] $1"; FAILURES=$((FAILURES + 1)); }

cat > "$TMP/plan.md" <<'PLAN'
# Implementation Plan

## Global Constraints
- Preserve user work.

## Task 1: First

#### Target
- first.py

#### Change
1. Change first.

#### Acceptance
- [ ] first passes

```markdown
## Task 2: Fake fenced heading
```

## Task 10: Tenth

#### Target
- tenth.py

#### Change
1. Change tenth.

#### Acceptance
- [ ] tenth passes
PLAN

if "$TASK_BRIEF" "$TMP/plan.md" 1 "$TMP/task-1.md" >/dev/null; then
  if grep -q 'Change first' "$TMP/task-1.md" && ! grep -q 'Change tenth' "$TMP/task-1.md" && grep -q 'Preserve user work' "$TMP/task-1.md"; then
    pass "extracts exact task and appends global constraints"
  else
    fail "extracts exact task and appends global constraints"
  fi
else
  fail "extracts exact task and appends global constraints"
fi

set +e
"$TASK_BRIEF" "$TMP/plan.md" 2 "$TMP/missing.md" >/dev/null 2>"$TMP/missing.err"
status=$?
set -e
if [[ "$status" -eq 3 ]]; then pass "ignores fenced fake task heading"; else fail "ignores fenced fake task heading"; fi

list="$($TASK_BRIEF --list "$TMP/plan.md" 2>/dev/null || true)"
if [[ "$list" == *$'1\tFirst'* && "$list" == *$'10\tTenth'* && "$list" != *$'2\t'* ]]; then
  pass "lists real tasks with exact multi-digit numbers"
else
  fail "lists real tasks with exact multi-digit numbers"
fi

cat > "$TMP/unclosed.md" <<'PLAN'
# Plan
## Task 1: Broken
```text
## Task 2: Hidden forever
PLAN
set +e
"$TASK_BRIEF" "$TMP/unclosed.md" 1 "$TMP/unclosed-out.md" >/dev/null 2>"$TMP/unclosed.err"
status=$?
set -e
if [[ "$status" -eq 4 && "$(cat "$TMP/unclosed.err")" == *"unclosed Markdown fence"* ]]; then
  pass "rejects unclosed Markdown fence"
else
  fail "rejects unclosed Markdown fence"
fi

cat > "$TMP/thin.md" <<'PLAN'
# Plan
## Task 1: Thin
No contract sections.
PLAN
set +e
"$TASK_BRIEF" "$TMP/thin.md" 1 "$TMP/thin-out.md" >/dev/null 2>"$TMP/thin.err"
status=$?
set -e
if [[ "$status" -eq 5 && "$(cat "$TMP/thin.err")" == *"missing required section"* ]]; then
  pass "rejects task without Target Change Acceptance"
else
  fail "rejects task without Target Change Acceptance"
fi

if [[ "$FAILURES" -ne 0 ]]; then
  echo "FAILED: $FAILURES assertion(s)."
  exit 1
fi
echo PASS
