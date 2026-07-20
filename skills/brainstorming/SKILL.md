---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

Turn ideas into an approved design through short collaborative dialogue. No implementation until the user approves the design.

## Hard gate

Do not write code, scaffold projects, create worktrees, commit, or invoke implementation skills until:

1. Design sections are presented and approved, and
2. A written design exists, and
3. Spec self-review is done, and
4. The user approves the written design.

## Process

1. **Explore project context** — files, docs, recent commits.
2. **Clarify intent** — one question at a time; prefer multiple choice when helpful. Cover purpose, constraints, success criteria.
3. **Offer visual companion only when needed** — first time a mockup/diagram question is clearer shown than described, offer it alone; on approval see `visual-companion.md`. Skip if never needed.
4. **Propose 2–3 approaches** — trade-offs plus recommendation.
5. **Present design in sections** — architecture, components, data flow, error handling, testing. Get approval per section; revise on request.
6. **Write design** — save to parent-readable `local://<slug>/design.md` (user path preference overrides). Keep it concise and decision-complete.
7. **Spec self-review** — fix placeholders, contradictions, ambiguity, and excess scope inline.
8. **User reviews written design** — wait for approval or apply requested changes and re-review.
9. **Hand off** — invoke `writing-plans` only. Do not implement.

## Scale

Small asks still need a short design and explicit approval. Large multi-subsystem asks decompose first; each sub-project gets its own design → plan → implementation cycle.

## Out of scope

- Implementation, commits, branches, worktrees
- Running tests as proof of the design
- Invoking any skill other than `writing-plans` after approval
