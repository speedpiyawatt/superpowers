---
name: using-superpowers
description: Use when the user wants development work — code change, bug fix, review feedback, completion claim, branch finish, skill edit — or explicitly invokes a Superpowers skill. Do not use for pure research, explanation, source gathering, or read-only fan-out.
---

# Using Superpowers

Route development work to the matching skill. Research and explanation stay outside this flow unless the user explicitly names a skill.

## When this applies

**Enter this router for:**

- New behavior, feature, or design work
- Bug or failing behavior
- Review feedback to apply
- Completion, fixed, or passing claims
- Finishing a development branch
- Creating or editing a skill
- Explicit skill invocation (`/skill:name`, "use brainstorming", etc.)

**Stay out for:**

- Pure research or explanation
- Source gathering
- Read-only fan-out with no implementation intent
- Unrelated tool use that is not development work

If the user explicitly invokes a skill, run that skill even when the surrounding request looks like research.

## Precedence

1. User instructions override skills.
2. Explicit skill invocation wins over inferred routing.
3. Process skills set the approach before implementation skills run.

## Routes

| Intent | Skill |
|--------|-------|
| New behavior or design | `brainstorming` |
| Bug or failure | `systematic-debugging` |
| Review feedback | `receiving-code-review` |
| Skill create or modify | `writing-skills` |
| Completion claim | `verification-before-completion` |
| Branch finish | `finishing-a-development-branch` |
| Approved design → executable tasks | `writing-plans` |
| Execute approved plan with native tasks | `subagent-driven-development` |
| Independent parallel slices | `dispatching-parallel-agents` |
| Request a review | `requesting-code-review` |

Announce "Using [skill] to [purpose]" and follow that skill exactly.

## Rules

- Invoke the matched skill before substantive response or edits.
- Completion claims always route through `verification-before-completion` before any success language, commit, or PR.
- After brainstorming approval, use `writing-plans`; do not implement from the design directly.
- After an approved plan, use `subagent-driven-development` with native `task` — not a second execution controller.
- Subagents executing an assigned task skip this router and follow their assignment.

## Red Flags — STOP rationalizing

These thoughts mean STOP — you're rationalizing:

|Thought|Reality|
|---|---|
|"This is just a simple change"|A change is development work. Check the routes.|
|"I need more context first"|Route to the skill BEFORE clarifying questions — the skill sets how to explore.|
|"Let me explore the codebase first"|The skill tells you HOW to explore. Route first.|
|"I can check git/files quickly"|Files lack conversation context. Route first.|
|"This doesn't need a formal skill"|If a skill covers it, use it.|
|"I remember this skill"|Skills evolve. Read the current version.|
|"The skill is overkill"|Simple changes become complex. Use it.|
|"I'll just do this one thing first"|Check the routes BEFORE doing anything.|
|"This feels productive"|Undisciplined action wastes time. Skills prevent this.|
|"I know what that means"|Knowing the concept ≠ using the skill. Invoke it.|
