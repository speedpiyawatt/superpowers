---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

Write an executable plan a blank-context worker can follow. Bite-sized tasks. DRY. YAGNI. Frequent commits where the task asks for them.

**Announce:** "I'm using the writing-plans skill to create the implementation plan."

**Save to:** returned `planFilePath` from plan-mode entry (canonical `local://<slug>/plan.md`; user plan-path preference overrides only via that binding). This is the sole approved execution artifact after plan approval.

## Enter plan mode

Before any codebase research or plan drafting:

1. Choose a safe `<slug>` for this plan.
2. Write that slug as plain text to `xd://plan`.
3. Use the returned `planFilePath` as the exact sole save target for `plan.md`.
4. If entry fails, stop with the actionable error — never continue planning outside plan mode.

## Scope

If the spec covers independent subsystems, prefer one plan per subsystem. Each plan should yield working, testable software.

## File map first

Before tasks, list files to create or modify and each file's responsibility. Prefer focused files and existing codebase patterns.

## Task shape

Each task is one cohesive outcome and one acceptance cycle. Split on independent interfaces, proof cycles, or ownership boundaries — not merely to shrink file count.

Every task includes:

```markdown
### Task N: [Cohesive outcome]

**Depends on:** [none | Task ids this waits for]
**Executor hint:** `parent | mechanical | integration` (optional planning hint)
**Proof mode:** `tdd | verification | experiment` (optional planning hint)

#### Target

**Files:** exact paths to create/modify/test
**Interfaces:** consumes / produces
**Ownership:** paths this writer may edit
**Non-goals:** explicit exclusions

#### Change

Ordered steps. Show real code and commands — no TBD/TODO placeholders.

#### Acceptance

Observable checks the parent can judge from evidence:
- behavior or artifact to observe
- exact commands or scenarios when proof applies
- **Escalate when:** missing decision, ownership conflict, or environment blocker
```

Notes:

- Executor and proof-mode are planning hints only — not runtime schema fields.
- Do **not** emit `Owns` metadata blocks, runtime acceptance arrays/matrices, or an execution choice involving `executing-plans` (removed).
- Name concrete dependencies when order matters; otherwise `none`.
- Parallel writers must not share mutable paths.

## Header

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development with native `task`. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** …
**Architecture:** …
**Tech Stack:** …

## Global Constraints

…
```

## Self-review

After drafting:

1. Spec coverage — every requirement maps to a task
2. Placeholder scan — no TBD/vague steps
3. Type/signature consistency across tasks
4. Every Change item has observable Acceptance evidence
5. Independent tasks are parallel-safe; dependent tasks declare **Depends on**

Fix inline.

## Plan preview

Before native plan approval:

1. Re-read the exact saved plan Markdown.
2. If `preview_export` is available, call it with:

```json
{
  "format": "html",
  "source": "markdown",
  "markdown": "<exact saved plan content>",
  "open": true
}
```

Pass exact saved content in `markdown` — not a `local://` path.
3. Then request approval by writing the same slug as plain text to `xd://propose`.
4. If preview is unavailable or fails, emit one concise warning and continue to approval. Preview must never block plan review.

## Handoff

After saving `plan.md` at the bound `planFilePath` and completing plan preview, stop for native plan approval via `xd://propose` (same slug). Do not offer inline/`executing-plans` execution. Once approved, parent uses `subagent-driven-development`.
