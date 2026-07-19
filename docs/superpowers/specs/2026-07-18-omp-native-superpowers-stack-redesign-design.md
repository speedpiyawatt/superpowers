# OMP-Native Superpowers Stack Redesign

**Date:** 2026-07-18
**Status:** Approved design
**Scope:** OMP-native Superpowers development cycle, local OMP runtime integration, and development-agent contracts

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
- the installed `superpowers@6.1.1` plugin extension injects a static legacy Pi mapping that denies current native `task`, `hub`, and `todo` capabilities;
- global `AGENTS.md` applies development-only proof, review, and suite rules to unrelated research sessions;
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
8. Keep the installed plugin dormant outside software development or explicit skill invocation.

## Non-Goals

- Preserving compatibility with non-OMP harness workflow terminology.
- Adding aliases for retired tools, agents, schemas, or skills.
- Building a generic workflow engine beyond the current OMP plan/task/review lifecycle.
- Requiring permanent repository documentation for every design or experiment.
- Requiring TDD for tasks whose approved proof mode is verification or experiment.
- Governing general OMP research, analysis, or multi-agent fan-out.

## Design Principle

OMP remains a general research and coding agent. Superpowers activates only for software development work or explicit user invocation. Native OMP owns mechanics and state; Superpowers skills own development judgment procedures.

Runtime enforcement includes plan-mode permissions, artifact storage, approval, session handoff, task batching, isolation, agent validation, state transitions, and structured terminal results. The plugin contributes discoverable skills, not an unconditional workflow bootstrap.

## Architecture

The development workflow has five layers:

1. **Runtime kernel:** native OMP owns permissions, state, task lifecycle, isolation, and session recovery.
2. **Development routing:** `using-superpowers` activates only on development intent or explicit invocation.
3. **Decision procedures:** brainstorming, debugging, TDD, review intake, and skill authoring guide development judgment.
4. **Execution control:** native plan mode, `writing-plans`, SDD, native `task`, review, and branch finishing move approved development work through enforced states.
5. **Evidence:** local workflow artifacts, worker reports, reviewer verdicts, command results, and final verification support parent acceptance.

Mode boundary:

```text
OMP loads Superpowers skill package
  |
  +-- research, analysis, or read-only fan-out
  |     -> native OMP task batches
  |     -> scout/researcher agents
  |     -> proactive hub coordination
  |     -> source-backed synthesis
  |     -> no Superpowers development ceremony
  |
  `-- software development or explicit skill invocation
        -> using-superpowers router
        -> brainstorming or systematic-debugging or receiving-code-review
        -> native OMP plan mode when implementation planning is needed
        -> writing-plans task compiler
        -> native approval
        -> SDD execution controller
        -> native task waves and proactive hub coordination
        -> task reviews
        -> parent integration verification
        -> final review
        -> finishing-a-development-branch
```

`writing-skills` remains an authoring workflow entered only when creating or modifying skills.

## OMP Plugin Boundary

`superpowers@6.1.1` is an installed OMP plugin with bundled skills and `.pi/extensions/superpowers.ts`. OMP's `omp-plugins` provider already discovers the adjacent `skills/` directory from the installed package.

Remove the extension and its `pi.extensions` manifest entry for the OMP-native fork. Its `resources_discover` handler has no runtime callsite, while its unconditional context injection activates development instructions in every session and carries obsolete Pi tool assumptions.

Keep `pi.skills` as the package integration point. OMP's native skill discovery exposes model-invoked descriptions, and explicit `/skill:name` invocation remains available. No additional hook, extension, bootstrap message, or platform-mapping file is required.

The `using-superpowers` description becomes the development eligibility gate. It triggers for repository or code changes, bug fixes, implementation planning, code review, branch completion, and skill authoring. It does not trigger for general research, explanation, source gathering, or read-only multi-agent synthesis unless the user invokes it explicitly.

Development skills use OMP-native `task`, `hub`, `todo`, `grep`, and `glob` vocabulary directly. Concrete agents are chosen from the runtime's Available Agents list.

## Canonical Runtime Vocabulary

The development workflow uses one contract consumed by its prompts, task validation, reports, reviews, and tests.

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

Rewrite as a short model-invoked development router. Its description carries one trigger per development branch and excludes general research. The body establishes precedence and directs development work to applicable process skills. Remove platform mappings, start-of-every-conversation rules, duplicated workflow summaries, and long rationalization tables.

Key routes:

- new behavior or design change -> `brainstorming`;
- bug, failure, or unexpected behavior -> `systematic-debugging`;
- review feedback -> `receiving-code-review`;
- skill creation or modification -> `writing-skills`;
- claim of development completion -> `verification-before-completion`.

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

Keep as the single approved-plan execution controller. Rewrite it around native `task`, proactive `hub` coordination, the canonical report schema, local progress state, task review, fix loops, parent integration verification, and final review.

### `dispatching-parallel-agents`

Keep as a thin native fan-out procedure. It emits one native `task` batch per independent wave. Parallel writers require disjoint file and mutable-resource ownership. Workers use `hub` proactively to share dependency results, resolve ownership questions, and warn affected peers about contract-changing discoveries. Parent owns shared contracts and combined verification.

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

Rewrite under the `writing-great-skills` authoring method. Keep only the ordered authoring steps every run needs, with checkable completion criteria. Put branch-specific definitions, examples, and pressure fixtures behind precise context pointers. Apply the same invocation, hierarchy, pruning, and testing rules to this skill itself.

## Skill Authoring Standard

Predictability is the root acceptance property: a skill must drive the same process across runs, not identical output.

Every skill edit classifies invocation first:

- model-invoked when the agent or another skill must reach it autonomously;
- user-invoked when only explicit human invocation should reach it;
- a user-invoked router when several user-invoked skills would otherwise overload human recall.

Model-facing descriptions contain one leading trigger per genuine branch. They do not summarize the body or repeat synonyms for the same trigger.

`SKILL.md` contains ordered steps and reference every branch needs. Each step ends with a checkable, and where needed exhaustive, completion criterion. Branch-specific reference moves behind a context pointer whose wording says exactly when to load it. Definitions, rules, and caveats for one concept remain co-located.

Every edit performs a pruning pass for single-source ownership, relevance, no-ops, sediment, duplication, sprawl, and negative steering. Positive target behavior replaces prohibitions unless a hard guardrail requires an explicit ban. Strong leading words replace repeated explanations only when pressure tests show they change behavior.

Skills split only when independent invocation or hidden post-completion steps justify the extra context or cognitive load. File size alone triggers progressive disclosure, not automatic skill proliferation.

## Global Agent Contract

Global `AGENTS.md` governs every OMP session, so it contains only universal invariants:

- ground load-bearing claims in code, documentation, or executed evidence;
- batch genuinely independent work through native `task`;
- maximize parallel read-only research and isolated work;
- keep one writer per path or mutable resource;
- keep product, security, architecture, and scope decisions with parent;
- use `hub` for consequential peer coordination;
- choose agents from the runtime's Available Agents list;
- parent synthesizes and spot-checks child evidence before claiming completion.

Move development-only executor tiers, proof modes, RED/GREEN requirements, reviewer gates, full-suite ownership, task-report matrices, and branch lifecycle into Superpowers development skills. Remove the static agent table and duplicated native task lifecycle. Replace dead `job` and `irc` instructions with current `hub` behavior.

Keep the user-specific writing-style section because it intentionally governs every session. Prune it independently under `writing-great-skills`; do not move it into Superpowers.

For research, children receive the question, boundaries, source requirements, and expected deliverable. Research acceptance is source-backed coverage or an executed artifact, not TDD, code review, or a development plan.

For development, the activated Superpowers workflow adds executor capability classes:

```text
parent | mechanical | integration
```

The dispatcher resolves each class against currently configured native agents and required tools. Missing capability blocks development dispatch with exact diagnostics; it never silently substitutes an agent.

## Native Peer Coordination

OMP's peer channel is the native `hub` tool. It serves both research fan-out and Superpowers development work.

Peers use it proactively when a message can change another active task:

- publish an upstream result a peer is waiting for;
- resolve suspected ownership, source, or mutable-resource overlap;
- warn affected peers about a discovered interface, schema, behavior, or source-quality issue;
- share concise evidence that prevents duplicated investigation;
- request a parent decision when product, architecture, security, scope, or shared-contract judgment is required.

Messages name the affected task or contract and include only the decision or evidence needed to act. Direct messages use the current peer roster; agents never invent recipients or inspect another session to infer status.

Native task completion already delivers results. Routine status, completion handoffs, polling pings, and copied reports add no coordination value. Parent decisions remain authoritative, and peer coordination cannot expand ownership or change an approved development contract.

## Workflow Artifacts

Every approved development workflow uses one local artifact tree:

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

## Development Plan and Task Contract

The canonical development plan shape is:

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

### Plugin Boundary Tests

Cover installed-package skill discovery without extension loading, absence of unconditional bootstrap injection, development-trigger invocation, explicit skill invocation, and research non-invocation. A read-only research prompt must retain native multi-agent fan-out without producing development plans, proof modes, or review gates.

### Cross-Layer Workflow Tests

Cover:

1. general research fans out through native agents without loading the Superpowers development router;
2. a development request invokes `using-superpowers` through its model-facing description;
3. explicit skill invocation still enters the requested development procedure;
4. brainstorming blocks implementation before approval;
5. plan output extracts into a native-task-valid brief;
6. bugs enter systematic debugging before proof-mode implementation;
7. TDD requires observed RED/GREEN while other proof modes do not;
8. child completion cannot bypass parent acceptance;
9. blocking review findings force fix and full re-review;
10. disjoint development tasks fan out once while overlapping writers remain sequential;
11. research and development peers share consequential discoveries through `hub`, while routine progress produces no message;
12. final review covers the complete recorded development branch range.

### Skill Pressure Tests

Every active skill gets:

- a trigger test;
- a non-trigger test;
- a premature-completion pressure test;
- a next-handoff test.
- an invocation-classification check for model-invoked, user-invoked, or routed reach;
- an information-hierarchy check proving branch-only reference loads only when its context pointer fires;
- a pruning check covering duplication, no-ops, sediment, sprawl, and negative steering.

Published package includes runnable scenarios. Release notes or references to absent evals do not count as coverage.

## Migration

Use a clean cutover:

1. narrow global `AGENTS.md` to universal research-and-development invariants;
2. remove the unconditional Superpowers extension bootstrap while retaining plugin skill discovery;
3. add canonical development schemas and validators;
4. add unified development artifacts, persisted plan pointer, and recovery;
5. rewrite routing, design, planning, execution, and proof skills;
6. rewrite review and finishing skills;
7. remove redundant skills, templates, stale tools, and duplicate dialects;
8. replace custom agent definitions with runtime-valid contracts;
9. add deterministic, boundary, and pressure-test coverage;
10. smoke-test both native research fan-out and the complete development cycle.

Do not ship aliases or compatibility shims for removed workflow terms.

## Acceptance Criteria

The redesign is complete only when:

- general OMP research can fan out through native agents without loading Superpowers development procedures;
- software development and explicit invocation enter the correct Superpowers skill;
- one approved execution plan drives every development execution context;
- every development task passes the same parser used by native dispatch;
- every development proof mode produces its required evidence without unrelated ceremony;
- every development worker and reviewer returns canonical structured output;
- no child completion can bypass parent acceptance;
- restart and compaction resume the exact approved development workflow;
- global `AGENTS.md` contains no development-only gates, stale tools, or static agent catalog;
- active skill files contain no stale tools, agents, schemas, or duplicate owners;
- research and development agents use native `hub` for consequential peer coordination without routine-status noise;
- all active skills have trigger, non-trigger, pressure, and handoff coverage;
- every edited skill passes the `writing-great-skills` invocation, hierarchy, completion-criterion, pruning, and pressure-test checks;
- one native research fan-out and one full development workflow pass end to end.
