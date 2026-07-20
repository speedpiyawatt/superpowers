# Lean OMP–Superpowers Overhaul Design

**Status:** Approved direction; replaces the contract-heavy runtime design before further implementation.

**Supersedes:**

- `docs/superpowers/specs/2026-07-18-omp-native-superpowers-stack-redesign-design.md`
- `docs/superpowers/plans/2026-07-18-omp-runtime-workflow-contracts.md`
- `docs/superpowers/plans/2026-07-18-superpowers-development-workflow.md`
- `docs/superpowers/plans/2026-07-18-superpowers-installation-integration.md`

## Goal

Remove duplicate Superpowers orchestration and make native OMP `task` the only child-execution mechanism. Let native task children read parent `local://` artifacts without copying or absolute-path translation. Keep Superpowers opt-in for development and absent from ordinary research.

Do not turn OMP into a second development workflow engine.

## Decisions

### Native task children inherit parent `local://` read-only

OMP already threads parent `LocalProtocolOptions` through `TaskTool` into child sessions. Preserve that mechanism and make its access contract explicit:

- Parent can read and write its `local://` root.
- Native `task` descendants resolve the same `local://` URIs against the parent root.
- Native task descendants can read inherited artifacts.
- Native task descendants cannot create, update, delete, or rename inherited `local://` artifacts.
- Normal worktree edits remain available according to task instructions.
- Unrelated sessions, remote processes, and non-task agents do not inherit this mapping.

Implement read-only access by passing a child-scoped local-protocol option into the existing session/tool context. Do not add a new URL scheme, file copier, capability service, or artifact database.

A denied child write must report the exact URI and that inherited parent artifacts are read-only.

### Keep exact approved-plan identity

Retain exact approved-plan URI and SHA-256 persistence. Approval and later execution must refer to the same content. Missing files and hash mismatches fail closed. Do not restore modification-time discovery.

This is the only durable workflow identity OMP owns.

### Remove runtime workflow bureaucracy

OMP does not own development task graphs, acceptance matrices, reviewer policy, or persisted execution state. Remove or unwind the contract-heavy additions that introduced:

- mandatory `Owns` metadata;
- `cannot_verify changed paths without owns`;
- mandatory command output capture;
- mandatory worker acceptance arrays;
- worker semantic completion gates;
- reviewer semantic completion gates;
- canonical dependency/ownership task-graph validation;
- `progress.json` transition state machine and restart reconciliation;
- runtime-managed `tasks/`, `reports/`, `reviews/`, and `final-review.json` trees.

Do not reject a completed child because controller metadata was absent. Native `task` remains responsible for spawning, batching, blocking/async lifecycle, cancellation, and terminal child output—not project workflow policy.

### Keep child and reviewer results small

Configured workers return a small structured result:

```text
status: done | blocked | needs_context
summary: string
changed_files: string[]
commands?: { command: string; exitCode: number; output?: string }[]
concerns?: string[]
```

Command evidence is present only when a command was run. `output` is a decisive excerpt, not mandatory full capture. Parent checks evidence relevant to the task and runs integration verification.

Configured reviewers return a small status plus findings. Runtime may enforce output shape supplied by the agent definition, but it does not decide whether findings block project completion. Parent owns that decision.

### Superpowers is a thin, opt-in development procedure

Remove unconditional extension injection. Package exposes skills through normal discovery only.

`using-superpowers` routes development requests and explicit skill invocations. General research, explanation, and unrelated tool use do not enter brainstorming, planning, TDD, review, or branch ceremony.

Keep:

- `brainstorming` for intent, alternatives, design approval, and written design;
- `writing-plans` for concise executable task descriptions;
- `subagent-driven-development` as guidance for using native `task` and parent review;
- debugging, TDD, verification, review, and branch-finishing skills as focused procedures.

Delete redundant controllers and helpers:

- unconditional `.pi/extensions/superpowers.ts` injection;
- `executing-plans`;
- `using-git-worktrees` as a mandatory workflow controller;
- duplicate plan-review templates;
- SDD task-brief, workspace, and review-package parsers/scripts;
- `.superpowers/sdd` as a second workflow state store;
- platform-specific tool mapping references that duplicate OMP’s native tool descriptions.

Plans need enough information for a blank-context worker—Target, Change, Acceptance, and concrete dependencies where ordering matters—but no runtime-specific ownership taxonomy or acceptance schema.

## End-to-End Behavior

### Development

1. Development request invokes the Superpowers router.
2. Brainstorming establishes and records approved design when behavior is changing.
3. Writing-plans produces concise tasks in the parent’s `local://` plan artifact.
4. User approves the exact hash-bound plan.
5. Parent dispatches native `task` children with the relevant `local://` reference.
6. Children read parent artifacts, edit assigned worktree files, run focused checks, and return small results.
7. Parent reviews results, runs integration verification, and requests review when warranted.
8. Branch finishing occurs only after parent verification.

No runtime progress database, report files, review files, or task-state machine is required.

### Research

1. Research request uses native read-only task fan-out when parallelism helps.
2. No Superpowers development router, design, plan, proof mode, review gate, or workflow artifact tree is created.
3. Parent synthesizes source-backed results.

## Error Handling

- Missing inherited `local://` file: normal not-found error with exact URI.
- Child write to inherited `local://`: explicit read-only error; no partial write.
- Approved plan hash mismatch: fail before execution.
- Child blocked or needs context: parent supplies context or changes task; runtime does not reinterpret status.
- Child output malformed against configured output schema: structural error only.
- Review findings: returned to parent; runtime does not apply project policy.

## Verification

### Local sharing

Use a real native task child:

1. Parent writes a unique `local://` fixture.
2. Child reads exact content through the same URI.
3. Child write to that URI fails with read-only error.
4. Parent content remains unchanged.
5. Child can still perform an allowed worktree edit in an isolated fixture.

### Runtime simplification

Focused tests prove:

- approved plan URI/hash still survives supported session transitions;
- missing/hash-mismatched plans fail closed;
- ordinary worker completion without `Owns` succeeds;
- command evidence may omit output when no decisive excerpt is needed;
- removed report/reviewer/progress modules have no live callers.

### Workflow boundary

Two smoke scenarios are sufficient:

- research fans out through native `task` without Superpowers development artifacts;
- a disposable development fixture follows design → plan → native task → parent verification.

Avoid a large per-skill pressure matrix unless a real routing regression requires it.

## Migration

Existing commits from the contract-heavy attempt are not compatibility commitments. Remove unused modules, hooks, prompts, tests, agent fields, and artifact initialization in one clean cutover. Do not leave aliases or deprecated schemas.

Preserve unrelated local OMP fixes, user configuration, memory settings, remote-shell policy, model overrides, disabled agents, and writing style.

## Non-Goals

- Cross-process or remote `local://` sharing.
- Child writes into parent artifact root.
- Persistent workflow recovery after process loss.
- Runtime scheduling from dependency graphs.
- Runtime enforcement of project review policy.
- Universal proof or ownership metadata.
