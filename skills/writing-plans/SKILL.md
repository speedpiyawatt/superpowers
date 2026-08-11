---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

Write an executable plan a blank-context worker can follow. Bite-sized tasks. DRY. YAGNI. Frequent commits where the task asks for them.

**Announce:** "I'm using the writing-plans skill to create the implementation plan."

**Save to:** `local://<slug>/plan.md`. This is the sole approved execution artifact after user approval. Keep this exact canonical path; do not rename it or copy it into another local artifact.

## Root planning workflow

Stay in normal root mode. Do not call `/plan`, write to `xd://plan`, switch model or thinking level, restrict tools, or implement code before approval.

The root researches and writes the plan itself:

1. Choose a safe `<slug>`.
2. Inspect the relevant code, callers, tests, and existing conventions.
3. Write the complete plan to the exact `local://<slug>/plan.md` artifact.
4. Self-review it against the approved design and edit the same file until it is executable and complete.

Do not spawn a planner child or delegate plan drafting. The root already has the conversation, design decisions, and repository context; a child adds a lossy handoff without independent work.

## Scope

If the spec covers independent subsystems, prefer one plan per subsystem. Each plan should yield working, testable software.

## File map first

Before tasks, list files to create or modify and each file's responsibility. Prefer focused files and existing codebase patterns.

## Task right-sizing

A task is the smallest unit that carries its own test cycle and is worth a fresh reviewer's gate. When drawing task boundaries: fold setup, configuration, scaffolding, and documentation steps into the task whose deliverable needs them; split only where a reviewer could meaningfully reject one task while approving its neighbor. Each task ends with an independently testable deliverable.

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

Ordered steps. Show real code and commands — no TBD/vague steps.

#### Acceptance

Observable checks the parent can judge from evidence:
- behavior or artifact to observe
- exact commands or scenarios when proof applies
- **Escalate when:** missing decision, ownership conflict, or environment blocker
```

Notes:

- Executor and proof-mode are planning hints only — not runtime schema fields.
- Do not emit `Owns` metadata blocks, runtime acceptance arrays/matrices, or an execution-choice section.
- Name concrete dependencies when order matters; otherwise `none`.
- Parallel writers must not share mutable paths.

## No placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:

- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — the engineer may be reading tasks out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Self-review

After drafting:

1. Spec coverage — every requirement maps to a task.
2. Placeholder scan — no TBD or vague steps.
3. Type/signature consistency across tasks.
4. Every Change item has observable Acceptance evidence.
5. Independent tasks are parallel-safe; dependent tasks declare **Depends on**.

Fix inline, then re-read the exact saved plan.

## Plan preview

Before requesting approval:

1. Re-read the exact saved `local://<slug>/plan.md` Markdown.
2. If `preview_export` is available, call it with:

```json
{
  "format": "html",
  "source": "markdown",
  "markdown": "<exact saved plan content>",
  "open": true
}
```

Pass exact saved content in `markdown`, not a `local://` path. If preview is unavailable or fails, emit one concise warning and continue; preview must never block approval.

## Handoff

After the plan is reviewed and previewed, write the same `<slug>` as plain text to `xd://propose`. This requests user approval through the root review UI. Do not implement before approval. If the user refines the plan, update the same artifact, preview it again, and resubmit the same slug.

After approval, use `subagent-driven-development` with native `task`. The parent owns dispatch, evidence evaluation, integration, and final verification.
