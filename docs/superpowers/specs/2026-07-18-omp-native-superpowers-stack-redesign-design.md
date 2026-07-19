# OMP-Native Superpowers Stack Redesign

**Date:** 2026-07-18
**Status:** Approved design
**Scope:** OMP-native Superpowers fork, local OMP runtime integration, and user-agent contracts

## Problem

The installed Superpowers catalog contains sound individual practices, but its workflow contracts predate OMP's native plan mode, `task` orchestration, local artifacts, agent schemas, and review lifecycle. Prose and runtime now compete for ownership.

Observed failures include:

- two incompatible implementation-plan artifacts and approval paths;
- stale dispatch tools and agent names;
- incompatible task, proof, report, severity, and review vocabularies;
- strong SDD completion gates beside a weak alternate execution path;
- unconditional TDD requirements conflicting with verification and experiment proof modes;
- child-run full-suite instructions conflicting with parent-owned integration verification;
- parallel-writer rules that differ between SDD and parallel dispatch guidance;
- plan references that can be lost or replaced by an unsafe newest-file fallback;
- missing published behavioral evals for most skill contracts;
- long skills that violate the authoring guidance they prescribe.

## Goals

1. Make native OMP runtime the sole owner of workflow mechanics and state.
2. Make each active skill a short, single-purpose decision procedure.
3. Use one execution-plan artifact, task contract, proof vocabulary, and review schema.
4. Make malformed plans, reports, agents, and state transitions fail closed.
5. Preserve strong root-cause, RED/GREEN, review-intake, and claim-verification practices without forcing them onto irrelevant work.
6. Make plan execution resumable after fresh-context approval, compaction, restart, or interrupted agents.
7. Give every active skill deterministic contract tests and behavioral pressure tests.

## Non-Goals

- Preserving compatibility with non-OMP harness workflow terminology.
- Adding aliases for retired tools, agents, schemas, or skills.
- Building a generic workflow engine beyond the current OMP plan/task/review lifecycle.
- Requiring permanent repository documentation for every design or experiment.
- Requiring TDD for tasks whose approved proof mode is verification or experiment.

## Design Principle

OMP runtime owns mechanics and state. Superpowers skills own judgment procedures.

Runtime enforcement includes plan-mode permissions, artifact storage, approval, session handoff, task batching, isolation, agent validation, state transitions, and structured terminal results. Skills decide when a workflow applies and what evidence is required, but do not redefine runtime mechanics.

## Architecture

The workflow has four layers:

1. **Routing:** `using-superpowers` selects the applicable process skill.
2. **Decision procedures:** brainstorming, debugging, TDD, review intake, and skill authoring guide judgment.
3. **Execution control:** native plan mode, `writing-plans`, SDD, native `task`, review, and branch finishing move approved work through enforced states.
4. **Evidence:** local workflow artifacts, worker reports, reviewer verdicts, command results, and final verification support parent acceptance.

Primary flow:

```text
user request
  -> using-superpowers router
  -> brainstorming or systematic-debugging or receiving-code-review
  -> native OMP plan mode when implementation planning is needed
  -> writing-plans task compiler
  -> native approval
  -> SDD execution controller
  -> native task waves
  -> task reviews
  -> parent integration verification
  -> final review
  -> finishing-a-development-branch
```

`writing-skills` remains an authoring workflow entered only when creating or modifying skills.

## Canonical Runtime Vocabulary

The runtime exports one contract consumed by prompts, task validation, reports, reviews, and tests.

```text
proof_mode:
  tdd | verification | experiment

acceptance_status:
  pass | fail | not_run

worker_status:
  done | done_with_concerns | blocked | needs_context

severity:
  critical | important | note

review_status:
  approved | approved_with_notes | changes_required
```

Rules:

- New prose and schemas use these spellings exactly.
- `done` and `done_with_concerns` require every acceptance item to pass.
- `critical` and `important` block acceptance; `note` does not.
- `approved_with_notes` cannot contain blocking findings.
- Child completion is evidence input; parent acceptance is a separate state transition.

## Skill Disposition

### `using-superpowers`

Rewrite as a short trigger router. It establishes precedence and directs work to applicable process skills. Remove duplicated workflow summaries and long rationalization tables.

Key routes:

- new behavior or design change -> `brainstorming`;
- bug, failure, or unexpected behavior -> `systematic-debugging`;
- review feedback -> `receiving-code-review`;
- skill creation or modification -> `writing-skills`;
- claim of completion -> `verification-before-completion`.

### `brainstorming`

Keep intent discovery, alternatives, sectional design approval, and design self-review. Remove commit, worktree, execution-plan, and implementation ownership. It writes the approved design into the workflow artifact tree and hands implementation planning to native plan mode plus `writing-plans`.

Permanent project documentation is created only when the approved design or repository policy requires it.

### `writing-plans`

Reduce to a task-graph compiler. It converts an approved design into shared contract, dependency graph, ownership boundaries, executor classes, proof modes, and observable acceptance criteria. It does not own plan storage, approval, worktrees, commits, or execution choices.

### `using-git-worktrees`

Remove from the active OMP skill catalog. Native task isolation owns worktree creation and lifecycle. If shell fallback guidance remains useful outside OMP, move it to a non-invoked platform reference.

### `executing-plans`

Remove. Native approved-plan execution plus SDD owns this lifecycle. There is no alternate weak inline execution path.

### `subagent-driven-development`

Keep as the single approved-plan execution controller. Rewrite it around native `task`, the canonical report schema, local progress state, task review, fix loops, parent integration verification, and final review.

### `dispatching-parallel-agents`

Keep as a thin native fan-out procedure. It emits one native `task` batch per independent wave. Parallel writers require disjoint file and mutable-resource ownership. Parent owns shared contracts and combined verification.

### `systematic-debugging`

Keep root-cause investigation, hypothesis testing, and anti-symptom-fix discipline. Its implementation handoff selects the approved proof mode instead of universally requiring TDD.

### `test-driven-development`

Keep observed RED, minimum GREEN, and behavior-focused tests. Invoke only when `proof_mode=tdd`. Workers run focused RED/GREEN checks; parent runs formatter, type checks, and full suites once after writer fan-in.

### `receiving-code-review`

Keep technical verification before agreement, anti-performative behavior, and one-by-one feedback handling. Normalize findings to canonical severity. Route discovered bugs through systematic debugging and accepted changes through the selected proof mode. Close every feedback item with evidence.

### `requesting-code-review`

Keep as a thin native reviewer-dispatch procedure for task, final, and ad-hoc scopes. Use recorded base and head revisions; never infer `HEAD~1`. One reviewer checks specification compliance and code quality together.

### `verification-before-completion`

Keep as the claim-time fresh-evidence gate. Clarify that local verification supports the actor's claim but never replaces parent acceptance or final integration evidence.

### `finishing-a-development-branch`

Keep final integration choices. Require parent verification and approved final review before merge, PR, keep, discard, or cleanup actions. Respect native worktree provenance.

### `writing-skills`

Keep trigger-writing, completion-criteria design, match-the-test-to-the-failure guidance, and pressure-testing. Move long references and examples behind explicit reads. Apply its size, trigger, and testing rules to the installed catalog itself.

## Global Agent Contract

Global `AGENTS.md` contains only cross-workflow invariants:

- parent owns product decisions, shared contracts, integration, and final verification;
- children receive scoped executable contracts;
- one writer owns each path or mutable resource;
- workers run focused checks; parent runs project-wide checks once;
- canonical status, proof, severity, and review schemas apply everywhere;
- child reports are evidence, not acceptance;
- native `task` and `hub` are the only orchestration and coordination vocabulary.

Skill-specific sequences remain in skills. Runtime-specific agent mappings remain in configuration.

Plans name executor capability classes rather than concrete agent IDs:

```text
parent | mechanical | integration
```

The dispatcher resolves each class against currently configured native agents and required tools. Missing capability blocks dispatch with exact diagnostics; it never silently substitutes an agent.

## Workflow Artifacts

Every approved workflow uses one local artifact tree:

```text
local://<slug>/
|-- design.md
|-- plan.md
|-- progress.json
|-- tasks/<task-id>.md
|-- reports/<task-id>.json
|-- reviews/<task-id>.json
`-- final-review.json
```

Ownership:

- `design.md`: approved behavior and decisions;
- `plan.md`: canonical execution graph;
- `progress.json`: current execution state;
- task briefs: exact scoped child contracts;
- reports: immutable worker evidence;
- reviews: immutable reviewer verdicts;
- Git: source-code history, not workflow state.

The exact approved-plan URI and hash are persisted in session metadata. Fresh-context approval copies the complete workflow tree. Compaction injects only the URI and reread requirement. Missing plan, missing pointer, or hash mismatch fails closed. Modification-time fallback is prohibited.

## Plan and Task Contract

The canonical plan shape is:

```markdown
# Goal

# Constraints

# Contract

## Task: StableCamelCaseId

**Depends on:** TaskId, TaskId
**Executor:** parent | mechanical | integration
**Proof mode:** tdd | verification | experiment
**Owns:** exact files, symbols, and mutable resources

### Target

### Change

### Acceptance

### Escalate when
```

Remove separate leaf classification because it duplicates executor capability without changing dispatch.

### Task Requirements

- IDs are unique and stable after execution begins.
- Dependencies form an acyclic graph.
- `Target`, `Change`, and `Acceptance` are non-empty and unique.
- Ownership names exact paths, symbols, and mutable resources.
- Acceptance maps every requested behavior to observable evidence.
- Parent tasks own unresolved architecture, shared contracts, integration, and irreversible operations.
- Mechanical tasks contain one locked local transformation and no unresolved judgment.
- Integration tasks own debugging, concurrency, persistence, public interfaces, migrations, recovery, or cross-module behavior.

### Proof Modes

TDD requires an exact RED command, expected failure, GREEN command, and pass condition. Production edits cannot begin before observed RED fails for the expected reason.

Verification requires an exact focused command or scenario and its observable pass condition. It does not require fake pre-edit failure ceremony.

Experiment requires an executable run, output artifact or result, and a decision rule. The experiment output is proof; permanent tests are required only when a lasting product contract is introduced.

## Dependency and Dispatch Rules

Task states are:

```text
pending -> ready -> running -> reported -> reviewed -> accepted
running -> blocked
reported -> changes_required -> running
reviewed -> changes_required -> running
```

A task becomes ready only when every dependency is accepted. Tasks may share a parallel wave only when write ownership and mutable resources are disjoint and no task requires another task's result. Read-only tasks may overlap writers when they do not depend on uncommitted output.

The controller sends one native `task` batch per parallel wave. Children receive shared Goal/Constraints/Contract, their task brief URI, and the approved-plan URI. Full plan content is not injected automatically.

Runtime rejects:

- missing or duplicate task fields;
- dependency cycles or unknown dependencies;
- unobservable acceptance;
- incomplete proof-mode requirements;
- parallel ownership overlap;
- unavailable agent capability;
- contradiction with shared contract;
- malformed child output.

## Worker Report Contract

Every worker returns:

```text
status
summary
changed_files
commands
acceptance
concerns
```

Each command includes command text, exit status, and decisive output. Each acceptance item includes `pass`, `fail`, or `not_run` plus evidence. `done` and `done_with_concerns` require every item to pass. `done_with_concerns` is reserved for non-blocking risks, never missing proof. Writes outside ownership reject the report.

## Review Contract

One reviewer schema supports `task`, `final`, and `ad_hoc` scopes:

```text
status
spec_compliant
correct
critical
important
notes
cannot_verify
```

Task review begins only after the worker report passes validation. Reviewer receives the approved design, shared contract, task brief, report, evidence, recorded base/head range, and relevant files.

Any critical or important finding requires changes. Notes may remain under `approved_with_notes`. Accepted findings are fixed in one focused task, followed by full re-review. “Approved with fixes” is not a terminal state.

Final review starts after all tasks are accepted and parent integration checks pass. It reviews the complete branch range and cross-task effects. Zero critical or important findings are required before finishing.

## Persistence and Recovery

`progress.json` stores plan revision/hash, worktree, base/current revisions, task states, active task IDs, accepted evidence paths, open findings, and last transition. Updates are atomic after every transition.

On restart:

1. load the exact plan and progress state;
2. validate hash, worktree, and revisions;
3. reconcile tasks left running;
4. inspect existing report and owned changes;
5. resume, review, or mark interrupted;
6. refuse continuation on ownership conflicts.

The controller never blindly reruns an interrupted task. Reports and reviews are immutable; corrections create superseding artifacts. Task-local discoveries go in reports. Product, API, architecture, security, ownership, or shared-contract changes pause execution and require a revised approved plan.

## Error Handling

- Invalid custom-agent frontmatter disables that agent with exact field diagnostics.
- Unknown tools and malformed output schemas do not silently degrade.
- Missing capable agent produces `blocked`.
- Missing decision or approved context produces `needs_context`.
- Failed or absent proof remains `fail` or `not_run`; it cannot become a concern.
- Reviewer `cannot_verify` goes to parent for evidence or blocks acceptance.
- Unexpected user changes are preserved and excluded from owned work until ownership is resolved.

## Testing

### Deterministic Runtime Tests

Cover plan/task parsing, schema validation, DAG errors, ownership overlap, worker completion gates, reviewer severity gates, custom-agent validation, exact plan-reference persistence, restart recovery, compaction recovery, and interactive/ACP approval parity.

### Cross-Layer Workflow Tests

Cover:

1. brainstorming blocks implementation before approval;
2. plan output extracts into a native-task-valid brief;
3. bugs enter systematic debugging before proof-mode implementation;
4. TDD requires observed RED/GREEN while other proof modes do not;
5. child completion cannot bypass parent acceptance;
6. blocking review findings force fix and full re-review;
7. disjoint tasks fan out once while overlapping writers remain sequential;
8. final review covers the complete recorded branch range.

### Skill Pressure Tests

Every active skill gets:

- a trigger test;
- a non-trigger test;
- a premature-completion pressure test;
- a next-handoff test.

Published package includes runnable scenarios. Release notes or references to absent evals do not count as coverage.

## Migration

Use a clean cutover:

1. add canonical runtime schemas and validators;
2. add unified artifacts, persisted plan pointer, and recovery;
3. rewrite routing, design, planning, execution, and proof skills;
4. rewrite review and finishing skills;
5. remove redundant skills, templates, stale tools, and duplicate dialects;
6. replace custom agent definitions with runtime-valid contracts;
7. add deterministic and pressure-test coverage;
8. smoke-test native plan through branch completion.

Do not ship aliases or compatibility shims for removed workflow terms.

## Acceptance Criteria

The redesign is complete only when:

- one approved execution plan drives every execution context;
- every task passes the same parser used by native dispatch;
- every proof mode produces its required evidence without unrelated ceremony;
- every worker and reviewer returns canonical structured output;
- no child completion can bypass parent acceptance;
- restart and compaction resume the exact approved workflow;
- active skill files contain no stale tools, agents, schemas, or duplicate owners;
- all active skills have trigger, non-trigger, pressure, and handoff coverage;
- one full native workflow passes from design through final branch decision.
