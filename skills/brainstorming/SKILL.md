---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

Turn ideas into an approved design through short collaborative dialogue. No implementation until the user approves the design.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it. This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, a config change — all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly simple projects), but you MUST present it and get approval.

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
