# Lean OMP–Superpowers Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan through native `task`. `executing-plans` is deliberately removed by this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace contract-heavy OMP/Superpowers workflow machinery with exact approved-plan identity, read-only parent `local://` access for native task children, thin development skills, and two end-to-end smoke proofs.

**Architecture:** OMP keeps plan URI/hash, task lifecycle, structural agent output validation, and child-local read access. Superpowers supplies opt-in development judgment only. Parent owns dispatch, evidence evaluation, review policy, integration verification, and branch decisions; no second state machine or artifact database exists.

**Tech Stack:** TypeScript, Bun tests, OMP native `task`/`hub`/`local://`, Markdown skills, Node test runner, existing plugin package and lockfile.

**Source of truth:** `docs/superpowers/specs/2026-07-19-omp-superpowers-lean-overhaul-design.md`

## Global Constraints

- OMP worktree: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev`, branch `local/omp-dev`.
- Superpowers worktree: `/Users/speedzaza/Work/superpowers-agent-hardening`.
- Preserve commits implementing exact plan identity and cold/compaction rehydration (`e5482d2a8`, `62497f6a7`, `e75f6022f`).
- Preserve supervisor reply fix `3de6f8074`, canonical plan URL fixes `ef27af6f9` and `258a8b452`, unrelated OMP patches, and user changes.
- Preserve interactive/ACP approval parity, plan-mode read-only worktree enforcement, parent `local://` writes, and read-only plan scouts.
- Keep reviewer vocabulary `approved | approved_with_notes | changes_required` and `critical | important | note`; remove only runtime policy gates.
- Native task children read inherited parent `local://`; all child mutation paths to inherited `local://` fail before filesystem writes.
- No task-graph parser, mandatory `Owns`, acceptance matrix, worker/reviewer semantic gate, workflow artifact tree, `progress.json`, recovery state machine, compatibility alias, or exhaustive pressure corpus.
- Use one writer per worktree. Run all six tasks sequentially; native task children may perform read-only review or research concurrently, but writer commits never share a live Git index.
- Parent runs package-wide format/type/tests once after writer fan-in, not once per child.

---

### Task 1: Remove runtime workflow bureaucracy

**Depends on:** none
**Executor:** `worker`
**Proof mode:** `tdd`

#### Target

**Files:**
- Delete: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/plan-mode/plan-task-graph.ts`
- Delete: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/plan-mode/workflow-artifacts.ts`
- Delete: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/plan-mode/workflow-progress.ts`
- Delete: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/plan-mode/workflow-recovery.ts`
- Delete: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/task/task-contract.ts`
- Delete: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/task/report-gates.ts`
- Delete: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/task/reviewer-gates.ts`
- Delete matching tests: `packages/coding-agent/test/plan-mode/{plan-task-graph,workflow-artifacts,progress-recovery}.test.ts`
- Delete matching tests: `packages/coding-agent/test/task/{task-graph,worker-report-gates,reviewer-gates}.test.ts`
- Delete obsolete execution records: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/.superpowers/sdd/`
- Modify: `packages/coding-agent/src/modes/{interactive-mode.ts,acp/acp-agent.ts}`
- Modify: `packages/coding-agent/src/plan-mode/{approved-plan.ts,approved-plan-prompt.test.ts}`
- Modify: `packages/coding-agent/src/prompts/agents/task.md`
- Modify: `packages/coding-agent/src/prompts/system/plan-mode-{active,approved,compact-instructions,reference}.md`
- Modify: `packages/coding-agent/src/session/agent-session.ts`
- Modify: `packages/coding-agent/src/task/{agents.ts,brief-format.ts,executor.ts,index.ts}`
- Modify: `packages/coding-agent/src/tools/index.ts`
- Test: `packages/coding-agent/test/{bundled-agent-parsing,agent-session-plan-reference-compaction,agent-session-plan-mode-convergence,acp-agent,interactive-mode-plan-review}.test.ts`
- Test: `packages/coding-agent/test/task/{brief-format,task-batch,executor-warnings}.test.ts`

**Interfaces:**
- Keeps: `ApprovedPlanReference { planFilePath: string; sha256: string }` and existing exact-plan rehydration.
- Produces: small bundled worker output schema with only status, summary, changed files, optional commands, and optional concerns.
- Removes: task-graph, workflow-artifact, report-gate, reviewer-gate, progress, and recovery exports/callers.

**Ownership:** Runtime cleanup files above. Do not alter local-protocol read-only behavior yet and do not modify `src/irc/bus.ts` or `src/registry/agent-registry.ts`.
**Non-goals:** Reverting exact plan identity, canonical plan paths, supervisor reply handling, reviewer vocabulary, or generic structural output validation.

#### Change

- [ ] **Step 1: Write RED schema and completion cases**

Update `packages/coding-agent/test/bundled-agent-parsing.test.ts` so the expected task schema is:

```ts
expect(output?.properties?.status?.enum).toEqual(["done", "blocked", "needs_context"]);
expect(output?.properties?.changed_files?.elements).toBeDefined();
expect(output?.optionalProperties?.commands?.elements).toBeDefined();
expect(output?.optionalProperties?.concerns?.elements).toBeDefined();
expect(output?.properties?.acceptance).toBeUndefined();
```

Add focused executor and dispatch cases: a structurally valid `done` result with changed files and no `Owns`, acceptance array, commands, or concerns reaches normal completion; a `# Target/# Change/# Acceptance` assignment with no contract metadata dispatches; optional command evidence accepts omitted `output`. In ACP and interactive approval tests, assert approval persists only exact plan identity and creates no `tasks/`, `reports/`, `reviews/`, `progress.json`, or `final-review.json`.

- [ ] **Step 2: Run RED**

Run:

```bash
bun test packages/coding-agent/test/bundled-agent-parsing.test.ts \
  packages/coding-agent/test/task/brief-format.test.ts \
  packages/coding-agent/test/task/task-batch.test.ts \
  packages/coding-agent/test/task/executor-warnings.test.ts \
  packages/coding-agent/test/acp-agent.test.ts \
  packages/coding-agent/test/interactive-mode-plan-review.test.ts
```

Expected: schema assertion fails on `done_with_concerns`/required evidence, or executor returns `report_gate:`, proving strict workflow policy remains live.

- [ ] **Step 3: Remove overbuilt modules and live hooks**

Delete listed modules, tests, and obsolete records. Remove `initializeWorkflowArtifacts`, `recoverAllWorkflows`, `ensureWorkflowProgressRecovered`, plan-task parsing, graph validation, `owns` extraction, and semantic completion gates from modes, session, task, and tools. Keep `brief-format.ts` only as the fence-aware validator for non-empty `# Target`, `# Change`, `# Acceptance`, and batch `# Goal`, `# Constraints`, `# Contract`; remove contract metadata parsing and dependency/ownership semantics.

Rewrite `prompts/agents/task.md` for the small result shape: child follows Target/Change/Acceptance, preserves unexpected changes, returns `done | blocked | needs_context`, and reports only commands it ran. Parent—not runtime—judges acceptance. Remove `Owns`, `done_with_concerns`, mandatory command output, acceptance-matrix, and report-gate instructions.

Keep existing structural validation and schema-override behavior in `task/executor.ts` unchanged. Delete only the semantic `reportGate` branch: move the existing successful serialization block (`rawOutput`, `exitCode`, and schema-warning assignment) directly under `if (!result.success) { ... } else { ... }`. Do not create a second validator or change malformed-output handling.

Replace `TASK_OUTPUT_SCHEMA` in `task/agents.ts` with:

```ts
const TASK_OUTPUT_SCHEMA = {
  properties: {
    status: { enum: ["done", "blocked", "needs_context"] },
    summary: { type: "string" },
    changed_files: { elements: { type: "string" } },
  },
  optionalProperties: {
    commands: {
      elements: {
        properties: {
          command: { type: "string" },
          exitCode: { type: "float64" },
        },
        optionalProperties: { output: { type: "string" } },
      },
    },
    concerns: { elements: { type: "string" } },
  },
} as const;
```

Remove `progress.json`, canonical task-block, ownership, and recovery language from plan prompts. Retain exact `local://<slug>/plan.md`, SHA-backed reread, approval parity, read-only planning, and plan-scout rules. Fresh-context continuation must rehydrate and verify that same URI/SHA pair directly; it must not copy or reconstruct a workflow tree, and hash mismatch remains fail-closed.

- [ ] **Step 4: Run GREEN and dead-reference check**

Run:

```bash
bun test packages/coding-agent/test/bundled-agent-parsing.test.ts \
  packages/coding-agent/test/task/brief-format.test.ts \
  packages/coding-agent/test/task/task-batch.test.ts \
  packages/coding-agent/test/task/executor-warnings.test.ts \
  packages/coding-agent/test/plan-mode/approved-plan.test.ts \
  packages/coding-agent/test/agent-session-plan-reference-compaction.test.ts \
  packages/coding-agent/test/agent-session-plan-mode-convergence.test.ts \
  packages/coding-agent/test/acp-agent.test.ts \
  packages/coding-agent/test/interactive-mode-plan-review.test.ts
```

Expected: exit 0; assignment dispatches without contract metadata; approval creates no workflow tree; exact identity, fresh-context rehydration, and parity tests pass; ordinary child completion has no semantic report gate.

Run:

```bash
bunx tsc -p packages/coding-agent/tsconfig.json --noEmit
```

Expected: exit 0 and no imports or prompt references to deleted workflow modules/contracts.

- [ ] **Step 5: Commit**

Stage only files listed under this task’s Target, including deletions; never use `git add -A`. Verify `git diff --cached --name-only` contains no unrelated path, then:

```bash
git commit -m "refactor(task): remove workflow policy machinery"
```

#### Acceptance

- [ ] Exact approved-plan URI/SHA survives interactive/ACP approval, compaction, session reload, and fresh-context continuation; mismatch still fails closed.
- [ ] Approval and dispatch create no workflow task/report/review/progress tree.
- [ ] A plain Target/Change/Acceptance assignment dispatches without contract metadata.
- [ ] Valid worker completion without `Owns`, commands, output excerpts, or acceptance matrix succeeds.
- [ ] Reviewer output remains structurally typed, but no runtime reviewer policy gate remains.
- [ ] Deleted runtime modules, contracts, and prompt instructions have no live references.
- RED: focused schema/completion command exposes strict gate.
- GREEN: focused tests and package typecheck exit 0.
- Escalate when: cleanup would remove exact plan identity, canonical URL normalization, supervisor reply fix, or an unrelated local patch.

---

### Task 2: Make inherited parent local artifacts read-only

**Depends on:** Task 1
**Executor:** `worker`
**Proof mode:** `tdd`

#### Target

**Files:**
- Modify: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/internal-urls/local-protocol.ts`
- Modify: `packages/coding-agent/src/task/index.ts`
- Modify: `packages/coding-agent/src/tools/plan-mode-guard.ts`
- Modify: `packages/coding-agent/src/tools/bash-skill-urls.ts`
- Modify: `packages/coding-agent/src/eval/backend.ts`
- Test: `packages/coding-agent/test/internal-urls/local-protocol.test.ts`
- Test: `packages/coding-agent/test/tools/{plan-mode-guard-local,bash-skill-urls}.test.ts`
- Test: `packages/coding-agent/test/{write-hashline-header,core/hashline}.test.ts`
- Test: `packages/coding-agent/test/task/task-batch.test.ts`
- Test: `packages/coding-agent/src/eval/__tests__/helpers-local-roots.test.ts`

**Interfaces:**
- Extends: `LocalProtocolOptions` with `readOnly?: boolean`.
- Produces: `assertLocalProtocolWritable(input, options)` with one stable error.
- Child mapping: `{ ...parentOptions, readOnly: true }` passed only to native task descendants.

**Ownership:** Local-protocol access flag, child handoff, write guards, and focused tests.
**Non-goals:** Cross-process sharing, remote sharing, permission tokens, copied artifacts, or blocking child worktree writes.

#### Change

- [ ] **Step 1: Write RED access tests**

Add cases proving:

```ts
const parent = { getArtifactsDir, getSessionId };
const child = { ...parent, readOnly: true };

expect(resolveLocalUrlToPath("local://feature/plan.md", child))
  .toBe(resolveLocalUrlToPath("local://feature/plan.md", parent));
expect(() => assertLocalProtocolWritable("local://feature/plan.md", child))
  .toThrow("Cannot write local://feature/plan.md: inherited parent local:// artifacts are read-only");
expect(() => assertLocalProtocolWritable("local://feature/plan.md", parent)).not.toThrow();
```

Add task handoff coverage asserting `runAgent` receives a cloned `localProtocolOptions` with the same root getters and `readOnly: true`, while the parent session options remain writable. Add guard cases with plan mode disabled for authored `local://`, bracketed URI, resolved absolute path under inherited root, delete, and both move endpoints; ordinary worktree targets remain writable.

Add direct writer, `WriteTool`, hashline edit/delete/move, resource-note, bash expansion, and eval coverage. Every inherited-local mutation must fail before filesystem change; authored URI failures include that exact URI. `resolveEvalUrlRoots` omits `local` for read-only options.

- [ ] **Step 2: Run RED**

```bash
bun test packages/coding-agent/test/internal-urls/local-protocol.test.ts \
  packages/coding-agent/test/task/task-batch.test.ts \
  packages/coding-agent/test/tools/plan-mode-guard-local.test.ts \
  packages/coding-agent/test/tools/bash-skill-urls.test.ts \
  packages/coding-agent/test/write-hashline-header.test.ts \
  packages/coding-agent/test/core/hashline.test.ts \
  packages/coding-agent/src/eval/__tests__/helpers-local-roots.test.ts
```

Expected: missing `readOnly` contract/helper and child handoff assertions fail.

- [ ] **Step 3: Implement minimum read-only boundary**

In `local-protocol.ts`:

```ts
export interface LocalProtocolOptions {
  getArtifactsDir?: () => string | null;
  getSessionId?: () => string | null;
  readOnly?: boolean;
}

export function assertLocalProtocolWritable(input: string, options: LocalProtocolOptions): void {
  if (options.readOnly) {
    throw new Error(`Cannot write ${input}: inherited parent local:// artifacts are read-only`);
  }
}
```

Call this helper from direct local atomic/exclusive writers. In `enforcePlanModeWrite`, enforce inherited-local read-only access for both target and move destination **before** the existing `getPlanModeState()` early return: when session options are read-only and `targetsLocalSandbox` matches an authored URI, bracketed URI, or resolved absolute path, call `assertLocalProtocolWritable` and preserve its exact input/error. Existing `WriteTool` and `HashlineFilesystem` mutation paths already call this function; focused integration tests must prove write/edit/delete/move cannot bypass it with plan mode disabled. Keep existing plan-mode worktree behavior after this generic access check.

In `expandInternalUrls`, detect a read-only `local://` token and throw `ToolError` with the same URI/read-only message instead of swallowing the error and leaving the token for shell execution. Omit the local eval root when `readOnly` so eval helpers cannot mutate it; child reads still use native `read` or `tool.read`. When resolving a local resource for display, replace `LOCAL_WRITE_NOTE` with `Inherited parent local:// artifacts are read-only.` for read-only options.

In `task/index.ts`, keep parent options unchanged and pass this clone to child creation:

```ts
const childLocalProtocolOptions: LocalProtocolOptions = {
  ...localProtocolOptions,
  readOnly: true,
};
```

Pass `childLocalProtocolOptions` where child `runAgent` currently receives `localProtocolOptions`.

- [ ] **Step 4: Run GREEN and real child proof**

Run the RED command; expect exit 0.

Then use patched CLI/native task in a disposable session:

1. Parent writes unique `local://local-sharing/fixture.txt`.
2. Blocking task child reads exact fixture through same URI.
3. Child attempts `write` to same URI and receives exact read-only error.
4. Parent rereads unchanged content.
5. Child writes one allowed file inside disposable worktree fixture.

Capture decisive terminal output in parent evidence/chat; do not create a task report or persistent workflow artifact tree.

- [ ] **Step 5: Commit**

```bash
git add packages/coding-agent/src/internal-urls/local-protocol.ts \
  packages/coding-agent/src/task/index.ts \
  packages/coding-agent/src/tools/plan-mode-guard.ts \
  packages/coding-agent/src/tools/bash-skill-urls.ts \
  packages/coding-agent/src/eval/backend.ts \
  packages/coding-agent/test/internal-urls/local-protocol.test.ts \
  packages/coding-agent/test/tools/plan-mode-guard-local.test.ts \
  packages/coding-agent/test/tools/bash-skill-urls.test.ts \
  packages/coding-agent/test/write-hashline-header.test.ts \
  packages/coding-agent/test/core/hashline.test.ts \
  packages/coding-agent/test/task/task-batch.test.ts \
  packages/coding-agent/src/eval/__tests__/helpers-local-roots.test.ts
git commit -m "feat(task): share parent local artifacts read-only"
```

#### Acceptance

- [ ] Parent and child resolve same local URI and content.
- [ ] Child write/edit/delete/move, bash path expansion, direct local writer, and eval helper cannot mutate inherited root.
- [ ] Parent local writes and child worktree writes still work.
- [ ] Child access does not mutate parent options object.
- RED: focused access tests fail on absent read-only boundary.
- GREEN: focused tests and real native child scenario pass.
- Escalate when: any mutation-capable tool reaches inherited root without passing `LocalProtocolOptions`.

---

### Task 3: Cut Superpowers to routing, planning, and native execution

**Depends on:** Task 2
**Executor:** `worker`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `/Users/speedzaza/Work/superpowers-agent-hardening/package.json`
- Delete: `.pi/extensions/superpowers.ts`
- Modify: `skills/using-superpowers/SKILL.md`
- Delete: `skills/using-superpowers/references/{pi-tools,codex-tools,antigravity-tools}.md`
- Modify: `skills/brainstorming/SKILL.md`
- Delete: `skills/brainstorming/spec-document-reviewer-prompt.md`
- Modify: `skills/writing-plans/SKILL.md`
- Delete: `skills/writing-plans/plan-document-reviewer-prompt.md`
- Modify: `skills/subagent-driven-development/SKILL.md`
- Delete: `skills/subagent-driven-development/{implementer-prompt,task-reviewer-prompt}.md`
- Delete: `skills/subagent-driven-development/scripts/`
- Modify: `skills/dispatching-parallel-agents/SKILL.md`
- Delete: `skills/executing-plans/`
- Delete: `skills/using-git-worktrees/`
- Replace: `tests/pi/test-pi-extension.mjs`
- Create: `tests/omp/test-development-routing.mjs`
- Create: `tests/omp/test-planning-execution-contract.mjs`
- Delete: `tests/claude-code/{test-sdd-workspace,test-task-brief,test-worktree-native-preference,test-worktree-path-policy}.sh`
- Delete: `tests/claude-code/{test-subagent-driven-development,test-subagent-driven-development-integration}.sh`
- Modify: `tests/claude-code/{README.md,run-skill-tests.sh}` to remove deleted test entries and descriptions.
- Modify: `tests/codex/test-package-codex-plugin.sh`

**Interfaces:**
- Keeps: `pi.skills: ["./skills"]` and explicit `/skill:name` discovery.
- Produces: development-only `using-superpowers` router and one Superpowers execution procedure using native `task`.
- Consumes: parent-readable/child-read-only `local://<slug>/{design,plan}.md` from Task 2.

**Ownership:** Files above only. Task 4 owns proof, review, branch, and skill-authoring procedures.
**Non-goals:** Runtime parsing, plan approval, progress persistence, worktree lifecycle, commits, report files, reviewer files, or research ceremony.

#### Change

- [ ] **Step 1: Add focused boundary assertions**

Tests must assert:

```text
package: pi.skills exists; pi.extensions absent; extension file absent
router positive: code change, bug, review feedback, completion claim, branch finish, skill edit, explicit invocation
router negative: research, explanation, source gathering, read-only fan-out
brainstorming: approval gate + written design + self-review; no implementation/commit/worktree control
writing-plans: Target + Change + observable Acceptance + dependency/escalation when needed
SDD: native task only; child reads local plan; parent reviews evidence and verifies integration
parallel dispatch: one batch per independent wave; overlap/dependency stays sequential; hub only for consequential coordination
removed: executing-plans, mandatory worktree skill, duplicate prompt templates, SDD task-brief/workspace/review scripts, `.superpowers/sdd` state
```

- [ ] **Step 2: Run baseline verification**

```bash
node --test tests/pi/test-pi-extension.mjs tests/omp/test-development-routing.mjs tests/omp/test-planning-execution-contract.mjs
```

Expected before edits: extension manifest/file exists, router injects globally or carries platform mappings, and duplicate execution/controller files remain.

- [ ] **Step 3: Apply lean skill cutover**

Set package integration exactly:

```json
"pi": {
  "skills": ["./skills"]
}
```

Rewrite skill bodies as ordered procedures, not runtime schemas. `using-superpowers` must route a completion claim to `verification-before-completion`. `writing-plans` may emit executor/proof hints but must not require `Owns`, runtime acceptance arrays, or an execution choice involving deleted `executing-plans`. SDD dispatches native tasks, accepts terminal child output as evidence input, requests scoped review when warranted, and leaves integration claims to parent. Research remains outside this router unless user explicitly invokes a skill. Delete SDD parser/workspace/review scripts and remove or invert their package/Claude/Codex tests; no shipped test may require a deleted controller.

- [ ] **Step 4: Run GREEN and package checks**

Run the baseline command; expect exit 0.

Run existing package checks:

```bash
bash tests/shell-lint/test-lint-shell.sh
bash tests/codex/test-package-codex-plugin.sh
cd tests/brainstorm-server && npm test
```

Expected: all exit 0; packaged archives contain no deleted SDD controller.

- [ ] **Step 5: Commit**

Stage only files listed under this task’s Target, including deletions; verify `git diff --cached --name-only`, then:

```bash
git commit -m "refactor(skills): use native OMP development flow"
```

#### Acceptance

- [ ] Installed package discovers skills without unconditional extension injection.
- [ ] Development, completion claims, and explicit invocation route correctly; research does not.
- [ ] One plan artifact and native task path replace duplicate execution/worktree controllers.
- [ ] SDD parser/workspace/review scripts and every package test requiring them are gone.
- [ ] Child local handoff uses `local://`, not copies or absolute-path translation.
- Escalate when: OMP package discovery does not expose model-invoked descriptions after extension removal.

---

### Task 4: Retain proof, review, finishing, and skill-authoring judgment

**Depends on:** Task 3
**Executor:** `worker`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `/Users/speedzaza/Work/superpowers-agent-hardening/skills/systematic-debugging/SKILL.md`
- Modify: `skills/test-driven-development/{SKILL.md,testing-anti-patterns.md}`
- Modify: `skills/verification-before-completion/SKILL.md`
- Modify: `skills/receiving-code-review/SKILL.md`
- Modify: `skills/requesting-code-review/{SKILL.md,code-reviewer.md}`
- Modify: `skills/finishing-a-development-branch/SKILL.md`
- Modify: `skills/writing-skills/{SKILL.md,anthropic-best-practices.md,persuasion-principles.md,testing-skills-with-subagents.md}`
- Delete: `skills/writing-skills/examples/CLAUDE_MD_TESTING.md`
- Create: `tests/omp/test-development-procedures.mjs`
- Create: `tests/omp/test-skill-authoring-contract.mjs`

**Interfaces:**
- Produces planning guidance `tdd | verification | experiment`; no mandatory runtime field.
- Produces reviewer vocabulary `approved | approved_with_notes | changes_required` and `critical | important | note`; parent applies policy.
- Produces branch choices only after parent verification and required final review.

**Ownership:** Files above only. Do not edit router/planning/SDD files owned by Task 3.
**Non-goals:** Runtime gates, persisted verdicts, `HEAD~1`, mandatory review of trivial tasks, or one pressure case per active skill.

#### Change

- [ ] **Step 1: Add focused procedure assertions**

Tests must prove these exact contracts:

```text
bug/failure -> establish root cause before fix
TDD -> observed RED for expected reason, minimum GREEN, behavior-focused lasting test
verification -> fresh focused command/scenario, no fake RED
experiment -> executed result/artifact + decision rule
completion -> evidence supports actor claim; parent acceptance remains separate
review intake -> verify feedback technically; accepted bug returns through debugging
review request -> task/final/ad_hoc + recorded base/current range; never HEAD~1
review fixes -> critical/important fixed then full re-review in same scope; notes may remain
branch finishing -> merge/PR/keep/discard/cleanup only after parent verification and required final approval
skill authoring -> invocation class, precise context pointer, checkable completion, pruning, changed-route pressure test
```

- [ ] **Step 2: Run baseline verification**

```bash
node --test tests/omp/test-development-procedures.mjs tests/omp/test-skill-authoring-contract.mjs
```

Expected before edits: legacy universal-TDD, reviewer dialect, inferred range, branch, or authoring assertions fail.

- [ ] **Step 3: Rewrite only judgment procedures**

Keep root-cause, review-intake, and evidence discipline. Remove workflow-controller prose, stale tools/agents, duplicated schemas, universal TDD activation, and branch-only reference text from primary skill files. Use progressive disclosure only where a retained reference has an exact load condition.

- [ ] **Step 4: Run GREEN**

Run the baseline command; expect exit 0.

- [ ] **Step 5: Commit**

Stage only files listed under this task’s Target, including deletions; verify `git diff --cached --name-only`, then:

```bash
git commit -m "refactor(skills): keep focused development judgment"
```

#### Acceptance

- [ ] Root-cause, proof, review, completion, and finishing behavior from audited spec remains explicit.
- [ ] Runtime policy/state language and stale tool dialects are absent.
- [ ] Skill-authoring guidance self-applies hierarchy and pruning rules without exhaustive pressure corpus.
- GREEN: focused procedure and authoring tests exit 0.
- Escalate when: pruning a reference would remove unique behavior required by approved spec.

---

### Task 5: Align universal policy, configured agents, and installation

**Depends on:** Task 4
**Executor:** `parent`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `/Users/speedzaza/.omp/agent/AGENTS.md`
- Modify enabled pairs only: `/Users/speedzaza/.omp/agent/agents/{scout,planner,reviewer,dumb-worker,worker,researcher}{,-blocking}.md`
- Preserve unchanged: `/Users/speedzaza/.omp/agent/APPEND_SYSTEM.md`, `/Users/speedzaza/.omp/agent/rules/`, `/Users/speedzaza/.omp/agent/config.yml`, disabled-agent files.
- Modify: `/Users/speedzaza/.omp/plugins/package.json`
- Modify: `/Users/speedzaza/.omp/plugins/bun.lock`
- Create: `/Users/speedzaza/Work/superpowers-agent-hardening/tests/omp/test-installed-contracts.mjs`

**Interfaces:**
- Produces universal global policy plus current native custom-agent tools/result shapes.
- Produces immutable plugin revision pin to passing Superpowers commit.
- Uses patched OMP CLI: `bun /Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/cli.ts`.

**Ownership:** Parent-owned user configuration, install pins, and deterministic installed-contract test.
**Non-goals:** Changing model choices, memory, disabled agents, remote shell, user writing style, or unrelated rules.

#### Change

- [ ] **Step 1: Add installed-contract test and capture baseline**

Test these invariants:

```text
global AGENTS: grounding, native task batching, one writer, parent decisions, consequential hub, runtime agent discovery, preserved writing style
global AGENTS absent: proof modes, RED/GREEN, reviewer gates, branch lifecycle, static agent table, job/irc, ban on native child local reads
native child local rule: parent local URI may be read; inherited root is read-only; external/remote handoffs use absolute paths
enabled agents: current task/hub tools only; scout/researcher are read-only; writer roles can edit; small worker/reviewer schemas
planner: one optional parent/mechanical/integration planning hint taxonomy; no Leaf class/Owns/runtime task-graph requirement
preserved files/settings: exact pre-edit checksums for APPEND_SYSTEM, rules, config model/memory/disabled sections
plugin pin: Superpowers Git dependency and `bun.lock` resolve exact full commit SHA; do not infer this from version-only plugin metadata
```

Run:

```bash
node --test /Users/speedzaza/Work/superpowers-agent-hardening/tests/omp/test-installed-contracts.mjs
```

Expected: fails on current global/local handoff rule and legacy configured-agent contracts.

- [ ] **Step 2: Apply smallest configuration edits**

Narrow global policy to universal rules while preserving its writing-style section verbatim. Update only enabled agent definitions. Use current `task` and `hub`; remove `intercom`, `contact_supervisor`, stale progress/report paths, mandatory acceptance/ownership fields, and dual executor/leaf taxonomy. Remove mutation tools, including `write`/`edit`, from scout and researcher pairs; keep writer tools only on writer roles. Keep structural output frontmatter valid.

- [ ] **Step 3: Verify agent discovery before installation**

Run installed-contract test; expect exit 0.

Run one native read-only identity batch containing `scout`, `researcher`, `dumb-worker`, `worker`, and `reviewer`; require every definition to load, return structured output, and report no unknown tool/schema diagnostic. No child edits files in this probe.

- [ ] **Step 4: Pin and install exact passing plugin**

Record full revisions:

```bash
git -C /Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev rev-parse HEAD
git -C /Users/speedzaza/Work/superpowers-agent-hardening rev-parse HEAD
```

Update existing Superpowers Git dependency to full plugin revision, then run:

```bash
bun install --cwd /Users/speedzaza/.omp/plugins
bun /Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/cli.ts --version
bun /Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/cli.ts plugin list --json
```

Expected: install exit 0; `/Users/speedzaza/.omp/plugins/package.json` and `bun.lock` resolve the exact full Superpowers commit SHA; patched CLI starts; installed package has `pi.skills` and no `pi.extensions`. Do not use version-only `omp-plugins.lock.json` metadata as revision proof.

Restart OMP once after installation so skill metadata and agent definitions reload.

- [ ] **Step 5: Commit repository-owned test and plugin source changes only**

Commit only `tests/omp/test-installed-contracts.mjs` in the Superpowers repository:

```bash
git -C /Users/speedzaza/Work/superpowers-agent-hardening add tests/omp/test-installed-contracts.mjs
git -C /Users/speedzaza/Work/superpowers-agent-hardening commit -m "test(omp): verify installed lean contracts"
```

Do not commit `~/.omp/agent` user configuration. Plugin lockfile remains installation state outside source repository.

#### Acceptance

- [ ] Universal policy contains no development ceremony and allows native child read-only local handoff.
- [ ] Enabled agents load with current `task`/`hub` tools and small schemas; scout/researcher cannot mutate; disabled/model/memory settings remain unchanged.
- [ ] Installed plugin dependency and package lock resolve exact passing full revision; no extension bootstrap loads.
- [ ] Patched CLI and plugin listing succeed after install.
- GREEN: installed-contract test and native agent batch pass.
- Escalate when: any preserved user-setting checksum changes, package manager resolves another revision, or enabled-agent schema cannot express optional command output.

---

### Task 6: Run final verification and two live workflows

**Depends on:** Task 5
**Executor:** `parent`
**Proof mode:** `experiment`

#### Target

**Files:**
- No production edits.
- Use: OMP and Superpowers focused tests from Tasks 1–5.
- Produce: terminal evidence only for one research smoke and one disposable development smoke.

**Interfaces:**
- Consumes installed patched runtime, plugin, global policy, and enabled agents.
- Produces final acceptance evidence for both research and development modes.

**Ownership:** Parent verification and final decision only.
**Non-goals:** New features, new workflow artifacts, inline scope expansion, or hidden compatibility shims.

#### Change

- [ ] **Step 1: Run parent integration checks once**

OMP:

```bash
cd /Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev
bunx tsc -p packages/coding-agent/tsconfig.json --noEmit
bun test packages/coding-agent/test
```

Superpowers:

```bash
cd /Users/speedzaza/Work/superpowers-agent-hardening
node --test tests/pi/*.mjs tests/omp/*.mjs
bash tests/shell-lint/test-lint-shell.sh
cd tests/brainstorm-server && npm test
```

Expected: every command exits 0. If an unrelated baseline failure exists, isolate it with exact prior/current evidence before judging regression.

- [ ] **Step 2: Run research smoke in fresh patched OMP process**

Prompt:

```text
Research three independent primary sources about one current technical question. Dispatch all three read-only slices in one native task batch and synthesize source-backed findings.
```

Expected:

```text
one native task batch
no using-superpowers, brainstorming, design, plan, proof mode, review, or branch ceremony
source links plus parent spot-check
hub only if one consequential finding changes another slice; no status messages
```

- [ ] **Step 3: Run disposable development smoke**

Prompt:

```text
Add one observable behavior to a disposable fixture using installed development workflow.
```

Expected sequence:

```text
using-superpowers route
brainstorming and user approval before edits
local://<slug>/design.md and exact hash-bound local://<slug>/plan.md
native task child reads parent local plan
child local write denied; assigned fixture edit succeeds
selected proof evidence
parent verification
task/final review when required, using recorded range
branch choice only after approval
no progress.json, task/report/review artifact tree, Owns gate, or report_gate failure
```

- [ ] **Step 4: Review complete change ranges**

Request one final review for:

- OMP range: pre-Task-1 revision through final runtime revision.
- Superpowers range: `f619184` through final plugin revision.

Require no open critical or important findings. Fix accepted findings in one scoped pass, rerun affected focused checks, then re-review complete scope.

- [ ] **Step 5: Record terminal result and choose branch action**

Report exact commands, exit codes, smoke observations, installed revisions, review status, and any non-blocking notes in final chat. Do not create permanent JSON reports. Offer merge/PR/keep/discard only after all preceding acceptance items pass.

#### Acceptance

- [ ] OMP typecheck and complete coding-agent tests pass.
- [ ] Superpowers focused and existing package tests pass.
- [ ] Research remains native, parallel, source-backed, and ceremony-free.
- [ ] Development follows approved design-to-final-branch flow with read-only child local access.
- [ ] No overbuilt runtime module, duplicate execution skill, stale configured-agent contract, or workflow state tree remains.
- [ ] Final review has zero open critical or important findings.
- Artifact: executed terminal results and final response; no persistent workflow report file.
- Escalate when: either smoke leaks the other mode’s instructions, child can mutate parent local root, or full verification cannot distinguish regression from baseline.
