---
name: requesting-code-review
description: Use when completing tasks, finishing a major slice, or needing an ad-hoc review — dispatch a reviewer on a recorded base/current range
---

# Requesting Code Review

Request a focused review on exactly what changed. Parent applies policy; this skill supplies range, scope, and vocabulary.

## Scopes

| Scope | When |
|-------|------|
| `task` | After a task slice worth review |
| `final` | Full change range before branch finish / merge decision |
| `ad_hoc` | Stuck, risky refactor, or explicit ask |

Not every trivial task needs review — parent decides when warranted.

## Range

Use a **recorded** base and current revision for this work (plan start SHA, task start SHA, branch point captured earlier).

```bash
# Example — SHAs you already recorded, not guessed
git diff --stat "$BASE_SHA".."$CURRENT_SHA"
git diff "$BASE_SHA".."$CURRENT_SHA"
```

**Never** infer the range with `HEAD~1`. If base is unknown, recover it from plan/notes/branch point or ask — do not guess.

## Dispatch

Fill [code-reviewer.md](code-reviewer.md) and dispatch a **read-only** reviewer from runtime Available Agents (no static agent catalog in this skill).

Placeholders: description, plan/requirements, `BASE_SHA`, `CURRENT_SHA`, scope (`task` | `final` | `ad_hoc`).

## Vocabulary

Severity: `critical` | `important` | `note`  
Verdict: `approved` | `approved_with_notes` | `changes_required`

Parent owns whether findings block merge. Typical handling:

- `critical` / `important` → fix, then **full re-review in the same scope**
- `note` → may remain; no mandatory re-review

## After review

- Fix blocking items; re-request review on the same scope and range discipline
- Accepted bugs go through `receiving-code-review` → `systematic-debugging`
- Do not treat reviewer prose as parent acceptance

## Out of scope

- Runtime report/reviewer gates or persisted verdict files
- `HEAD~1` range inference
- Mandatory review of every trivial edit
- Worktree/merge controllers
