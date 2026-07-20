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

Retain one canonical `local://<slug>/plan.md` URI and its SHA-256. Interactive approval, ACP approval, fresh-context continuation, compaction, and session reload must refer to the same content. Missing files and hash mismatches fail closed. Do not restore modification-time discovery.

Preserve plan-mode read-only working-tree enforcement and parent `local://` write access while planning. Plan scouts stay read-only. Exact plan identity is the only durable workflow state OMP owns.

A sibling `local://<slug>/design.md` may hold approved design context for children. No other workflow tree is required, and `plan.md` remains the sole approved execution artifact.

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

Configured reviewers use `approved | approved_with_notes | changes_required` with `critical | important | note` findings. Runtime may enforce the output shape supplied by the agent definition, but it does not decide whether findings block project completion. Parent owns that decision; critical and important findings require a fix or an explicit user decision, while notes do not.

### Superpowers is a thin, opt-in development procedure

Remove unconditional extension injection. Package exposes skills through normal discovery only.

`using-superpowers` routes development requests and explicit skill invocations. General research, explanation, and unrelated tool use do not enter brainstorming, planning, TDD, review, or branch ceremony.

Keep:

- `brainstorming` for intent, alternatives, design approval, and written design;
- `writing-plans` for concise executable task descriptions;
- `subagent-driven-development` as guidance for using native `task` and parent review;
- `dispatching-parallel-agents` as a thin guide to one native batch per independent wave;
- debugging, TDD, verification, review, and branch-finishing skills as focused procedures.

Delete redundant controllers and helpers:

- unconditional `.pi/extensions/superpowers.ts` injection;
- `executing-plans`;
- `using-git-worktrees` as a mandatory workflow controller;
- duplicate plan-review templates;
- SDD task-brief, workspace, and review-package parsers/scripts;
- `.superpowers/sdd` as a second workflow state store;
- platform-specific tool mapping references that duplicate OMP’s native tool descriptions.

Plans need enough information for a blank-context worker—Target, Change, observable Acceptance, concrete dependencies where ordering matters, and an escalation condition for unresolved judgment. They may carry a `parent | mechanical | integration` executor hint and a proof-mode hint for planning, but runtime does not parse an ownership taxonomy or acceptance schema.

### Retain development judgment, not runtime enforcement

The lean cutover keeps the useful procedures from the superseded design:

- `brainstorming` blocks implementation until behavior and tradeoffs are approved, then self-reviews the written design;
- `systematic-debugging` establishes root cause before a bug fix;
- `tdd` means observed RED followed by minimum GREEN when a permanent behavior change needs a regression test;
- `verification` means one fresh focused command or scenario without fabricated RED ceremony;
- `experiment` means an executed result or artifact with a decision rule;
- `verification-before-completion` checks fresh evidence but does not substitute for parent acceptance;
- `receiving-code-review` verifies feedback technically before applying it, closes accepted findings with evidence, and routes discovered bugs through systematic debugging;
- `requesting-code-review` supports task, final, and ad-hoc scopes using recorded base/current ranges, never guessed `HEAD~1`; critical or important fixes receive full re-review in the same scope;
- `finishing-a-development-branch` offers merge, PR, keep, discard, or cleanup only after parent verification and any required final review;
- `writing-skills` classifies invocation, uses precise context pointers, supplies checkable completion criteria, removes duplicated sediment, and pressure-tests changed routing behavior.

Proof mode is planning guidance, not a mandatory runtime field. Review severity is parent policy, not a runtime completion gate.

### Preserve native batching and peer coordination

Parent batches genuinely independent tasks once, keeps concurrent writers on disjoint files and mutable resources, and sequences tasks that depend on another task’s result. Parent owns product, API, architecture, security, shared-contract, and final integration decisions.

Use native `hub` only when a message can change active work: deliver a dependency result, resolve overlap, warn about a changed interface or source, or request a parent decision. Native task completion already delivers terminal results, so routine status and completion pings remain absent.

Read-only roles remain read-only. Concrete agents come from runtime Available Agents; no skill or global policy maintains a static catalog. Parent runs package-wide format, type, and test checks once after writer fan-in when those checks apply.

Unexpected user or peer changes are preserved. Children never revert work outside their assignment, and missing required agent capability returns an exact blocked diagnostic rather than silent substitution.

### Preserve installation and configuration boundaries

Keep `pi.skills: ["./skills"]`; remove `pi.extensions`. Explicit `/skill:name` invocation must continue to work, and interactive plus ACP plan approval must use the same exact plan identity. Plan scouts remain read-only.

Narrow global `AGENTS.md` to universal grounding, batching, parent-decision, peer-coordination, and agent-selection rules. Keep development-only proof, review, test, and branch procedures inside Superpowers.

Update enabled custom agents to current native tool names and small result shapes. Keep scout and researcher read-only, keep writer roles capable of assigned edits, preserve disabled-agent settings, and fail invalid frontmatter or output-schema structure with exact diagnostics.

Install only passing full runtime and plugin revisions, record immutable pins in the existing plugin lockfile, and restart OMP once so skills and agent definitions reload.

## End-to-End Behavior

### Development

1. Development intent or explicit invocation enters the Superpowers router; behavior changes enter brainstorming, bugs enter systematic debugging, review feedback enters review intake, and skill edits enter skill authoring.
2. Brainstorming establishes and records approved design when behavior is changing; implementation remains blocked until approval.
3. Writing-plans produces concise tasks in the parent’s `local://` plan artifact.
4. User approves the exact hash-bound plan through interactive or ACP plan approval.
5. Parent dispatches independent native `task` children with the relevant `local://` reference and sequences dependent or overlapping writers.
6. Children read parent artifacts, edit assigned worktree files, run focused proof, and return small results.
7. Parent reviews child evidence, resolves findings, and runs integration verification.
8. Required final review covers the recorded full change range.
9. Branch finishing becomes available only after parent verification and final approval.

No runtime progress database, report files, review files, or task-state machine is required.

### Research

1. Research request uses one native read-only task batch when independent fan-out helps.
2. No Superpowers development router, design, plan, proof mode, review gate, or workflow artifact tree is created.
3. Peers use `hub` only for consequential findings or decisions, never status spam.
4. Parent spot-checks evidence and synthesizes source-backed results.

## Error Handling

- Missing inherited `local://` file: normal not-found error with exact URI.
- Child write to inherited `local://`: explicit read-only error; no partial write.
- Approved plan hash mismatch: fail before execution.
- Child blocked or needs context: parent supplies context or changes task; runtime does not reinterpret status.
- Child output malformed against configured output schema: structural error only.
- Review findings: returned to parent; runtime does not apply project policy.
- Unexpected existing changes: preserve them and narrow task scope; do not clean or revert them.

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

Use focused contract tests for changed runtime and skill boundaries, then run two live smoke scenarios:

- research fans out through one native `task` batch, can share a consequential finding through `hub`, produces source-backed synthesis, and creates no Superpowers development artifacts;
- a disposable development fixture follows routing → approved design → hash-bound plan → native task → selected proof → parent verification → final review → branch choice.

Focused checks also cover explicit skill invocation, implementation blocking before design approval, root-cause routing for bugs, TDD versus verification/experiment behavior, sequential overlapping writers, recorded review ranges, valid custom-agent discovery, and absence of routine `hub` messages.

Avoid a large per-skill pressure matrix. Pressure-test only changed routing, handoff, hierarchy, or completion behavior.

## Migration

Existing commits from the contract-heavy attempt are not compatibility commitments. Remove unused modules, hooks, prompts, tests, agent fields, and artifact initialization in one clean cutover. Do not leave aliases or deprecated schemas.

Preserve `/Users/speedzaza/.omp/agent/APPEND_SYSTEM.md`, user rules, memory settings, remote-shell policy, model overrides, disabled-agent settings, writing style, and unrelated local OMP fixes. Keep user-owned configuration changes outside repository commits unless installation requires an exact pin or the user explicitly requests the edit.

## Non-Goals

- Cross-process or remote `local://` sharing.
- Child writes into parent artifact root.
- Persistent workflow recovery after process loss.
- Runtime scheduling from dependency graphs.
- Runtime enforcement of project review policy.
- Universal proof or ownership metadata.
