---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute an approved plan with native `task`. Parent coordinates; children implement one assignment each; parent judges evidence and integration.

**Announce:** "I'm using Subagent-Driven Development to execute this plan."

## Source of truth

- Read the approved plan at `local://<slug>/plan.md` (and design at `local://<slug>/design.md` when present).
- Hand children the same `local://` URIs — never copy plan text into prompts and never translate to absolute paths.
- Children inherit parent `local://` read-only; they edit worktree files only.

## Process

1. **Read plan once.** Note global constraints, task order, and dependencies.
2. **Dispatch ready work with native `task`.**
   - Independent tasks with disjoint writers → one batch (see `dispatching-parallel-agents`).
   - Overlap or dependency → sequential dispatch.
3. **Each child assignment** is plain Target / Change / Acceptance text (plus shared Goal/Constraints/Contract context). No second controller or local workflow ledger.
4. **Collect terminal structured results** as evidence input. Status values are whatever the runtime schema allows (`done`, `blocked`, `needs_context`, …). Missing or weak evidence is a parent problem to resolve — re-dispatch, supply context, or escalate — not a skill-side parser gate.
5. **Review when warranted.** Request scoped review (task or final) via `requesting-code-review` using recorded base/current ranges. Parent applies finding policy; critical/important findings get a fix task then re-review in the same scope.
6. **Integrate.** After writer fan-in, parent runs the smallest combined verification that proves slices coexist (format/type/full suite once when they apply).
7. **Finish.** After parent verification (and required final review), use `finishing-a-development-branch`.

## Judgment rules

- **Record BASE before every dispatch** — `git rev-parse HEAD` before the implementer starts; review ranges use the recorded BASE, never `HEAD~1` (which silently truncates multi-commit tasks).
- **Never dispatch multiple implementation subagents in parallel.** Implementers get disjoint or dependent work; only reviewers may fan out.
- **Fix loop — max 5 rounds per task.** Rounds 1–3: re-dispatch the original implementer carrying the open findings. Rounds 4–5: dispatch a fresh implementer on a more capable model. Subagent completion is terminal in OMP, so every re-dispatch carries the findings and the prior report file path — the report file is the persistent memory. At the cap, the parent adjudicates each open finding: park with a ruling (reviewer wrong, or real-but-deferred) or STOP and escalate on load-bearing findings.
- **Model tiers.** Cheapest tier for transcription-from-plan tasks (the plan text contains the code); mid-tier floor for reviewers and prose-driven implementers; most capable for architecture work and the final whole-branch review.
- **The controller never fixes findings itself** — fixes go through a dispatch and a scoped re-review; controller fixes skip review and pollute context.

## Parent owns

- Product, API, architecture, security, and shared-contract decisions
- Mapping Acceptance items to observed evidence
- Integration claims and completion claims
- Whether review findings block merge

## Children own

- Staying inside Target paths
- Focused proof named by the task
- Returning status, summary, changed files, and optional commands/concerns

## Do not

- Use a second execution or worktree controller
- Restore deleted parser, workspace, or review-package scripts
- Keep a parallel workflow state store beside the approved plan
- Trust child success prose without evidence
- Bypass parent integration verification
