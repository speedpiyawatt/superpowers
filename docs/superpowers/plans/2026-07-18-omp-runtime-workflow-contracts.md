# OMP Runtime Workflow Contracts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add fail-closed approved-plan identity, canonical development task/report/review contracts, durable workflow progress, and restart recovery to native OMP.

**Architecture:** Extend existing `plan-mode`, `task`, and session modules instead of adding a second workflow engine. Native OMP owns schemas, validation, artifact persistence, transitions, and recovery; Superpowers skills only emit and consume these contracts.

**Tech Stack:** TypeScript, Bun, Zod/JSON Schema already bundled by OMP, native `local://` protocol, existing `node:test`/Bun tests.

## Global Constraints

- Worktree: `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev`.
- Preserve interactive and ACP plan approval parity.
- Preserve plan-mode read-only working-tree enforcement and `local://` write access.
- Use one canonical runtime parser and schema; do not add a Superpowers-specific duplicate.
- Persist exact approved-plan URI and SHA-256; modification-time fallback is prohibited.
- Reject malformed plans, dependency cycles, unknown dependencies, overlapping parallel ownership, invalid reports, and blocking review verdicts.
- Keep runtime vocabulary lowercase: `tdd | verification | experiment`, `pass | fail | not_run`, `critical | important | note`.
- Parent runs formatter, type checks, and the complete package test suite once after task fan-in.

---

### Task 1: Persist exact approved-plan identity

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Modify: `packages/coding-agent/src/plan-mode/approved-plan.ts`
- Modify: `packages/coding-agent/src/plan-mode/state.ts`
- Modify: `packages/coding-agent/src/session/session-entries.ts`
- Modify: `packages/coding-agent/src/session/session-manager.ts`
- Modify: `packages/coding-agent/src/session/agent-session.ts`
- Modify: `packages/coding-agent/src/modes/interactive-mode.ts`
- Modify: `packages/coding-agent/src/modes/acp/acp-agent.ts`
- Test: `packages/coding-agent/test/plan-mode/approved-plan.test.ts`
- Test: `packages/coding-agent/test/agent-session-plan-reference-compaction.test.ts`

**Interfaces:**
- Produces: `ApprovedPlanReference { planFilePath: string; sha256: string }`.
- Produces: `sha256PlanContent(content: string): string`.
- Changes: `ResolvedApprovedPlan` includes `sha256`.
- Consumes: existing `readPlan(planUrl)` callback and session `mode_change` entries.

**Ownership:** Approved-plan resolution, reference persistence, and approval call sites only.
**Non-goals:** Workflow directory creation, task parsing, reports, and reviews.

#### Change

- [ ] **Step 1: Write RED cases** proving `resolveApprovedPlan` refuses a missing exact path, returns a stable SHA-256, ignores unrelated newer plans, and compaction preserves both path and hash.

```ts
const resolved = await resolveApprovedPlan({
  suppliedTitle: "auth",
  statePlanFilePath: "local://auth-plan.md",
  readPlan: async url => url === "local://auth-plan.md" ? "# Auth\n" : null,
});
expect(resolved.planFilePath).toBe("local://auth-plan.md");
expect(resolved.sha256).toMatch(/^[0-9a-f]{64}$/);
```

- [ ] **Step 2: Run RED**

Run: `bun test packages/coding-agent/test/plan-mode/approved-plan.test.ts packages/coding-agent/test/agent-session-plan-reference-compaction.test.ts`

Expected: missing `sha256` assertions fail and fallback test still resolves an unrelated file, proving identity is not yet fail-closed.

- [ ] **Step 3: Implement exact identity**

Add this runtime shape and hash helper, remove `listPlanFiles` from `ResolveApprovedPlanInput`, remove the newest-file branch from `resolveApprovedPlan`, and persist the reference in session entries used by interactive and ACP approval:

```ts
export interface ApprovedPlanReference {
  planFilePath: string;
  sha256: string;
}

export function sha256PlanContent(content: string): string {
  return new Bun.CryptoHasher("sha256").update(content).digest("hex");
}
```

On every reread, recompute SHA-256 and throw `ToolError` when it differs from the persisted hash. Keep supplied title only for display; never use it to select another file after approval.

- [ ] **Step 4: Run GREEN**

Run: `bun test packages/coding-agent/test/plan-mode/approved-plan.test.ts packages/coding-agent/test/agent-session-plan-reference-compaction.test.ts`

Expected: exact-path, hash-mismatch, compaction, interactive, and ACP assertions pass.

- [ ] **Step 5: Commit**

```bash
git add packages/coding-agent/src/plan-mode packages/coding-agent/src/session packages/coding-agent/src/modes packages/coding-agent/test/plan-mode packages/coding-agent/test/agent-session-plan-reference-compaction.test.ts
git commit -m "feat(plan-mode): persist exact approved plan identity"
```

#### Acceptance

- [ ] Approved plan identity survives approval, compaction, and session reload.
- [ ] Missing file and hash mismatch fail closed with the exact URI in the error.
- [ ] No modification-time fallback remains.
- RED: focused command fails before implementation for missing hash/fallback behavior.
- GREEN: focused command passes all identity and recovery assertions.
- Escalate when: session serialization cannot store the reference without a migration decision.

---

### Task 2: Parse canonical development task graphs

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Create: `packages/coding-agent/src/task/task-contract.ts`
- Create: `packages/coding-agent/src/plan-mode/plan-task-graph.ts`
- Modify: `packages/coding-agent/src/task/brief-format.ts`
- Modify: `packages/coding-agent/src/task/index.ts`
- Test: `packages/coding-agent/test/task/brief-format.test.ts`
- Test: `packages/coding-agent/test/task/task-batch.test.ts`
- Create: `packages/coding-agent/test/plan-mode/plan-task-graph.test.ts`
- Create: `packages/coding-agent/test/task/task-graph.test.ts`

**Interfaces:**
- Produces: `TaskContract` with `id`, `executor`, `proofMode`, `owns`, `dependsOn`, `target`, `change`, `acceptance`, and `escalateWhen`.
- Produces: `validateTaskContract(task: TaskContract): BriefIssue[]` and `validateTaskGraph(tasks: TaskContract[]): BriefIssue[]`.
- Consumes: canonical plan blocks headed `## Task: StableCamelCaseId` with `### Target/Change/Acceptance/Escalate when`, plus existing native task briefs using `# Target/# Change/# Acceptance`.

**Ownership:** Markdown contract parser and spawn-time graph validation.
**Non-goals:** Agent selection, execution scheduling, progress persistence, and report validation.

#### Change

- [ ] **Step 1: Write RED cases** for valid contracts plus duplicate IDs, unknown dependencies, cycles, empty ownership, missing proof evidence, and overlap among tasks in the same runnable wave.

```ts
const tasks = [
  contract("BuildApi", [], ["src/api.ts"]),
  contract("BuildUi", ["BuildApi"], ["src/ui.ts"]),
];
expect(validateTaskGraph(tasks)).toEqual([]);
```

- [ ] **Step 2: Run RED**

Run: `bun test packages/coding-agent/test/task/brief-format.test.ts packages/coding-agent/test/task/task-batch.test.ts packages/coding-agent/test/task/task-graph.test.ts packages/coding-agent/test/plan-mode/plan-task-graph.test.ts`

Expected: import or assertion failure for `TaskContract`, `validateTaskGraph`, or the canonical plan parser, proving shared semantic validation is absent.

- [ ] **Step 3: Implement parser and graph checks**

Use these exact enums and required fields:

```ts
export type ExecutorClass = "parent" | "mechanical" | "integration";
export type ProofMode = "tdd" | "verification" | "experiment";
export interface TaskContract {
  id: string;
  executor: ExecutorClass;
  proofMode: ProofMode;
  owns: string[];
  dependsOn: string[];
  target: string;
  change: string;
  acceptance: string;
  escalateWhen: string;
}
```

Put structured types and semantic checks in `task-contract.ts`. Keep existing fence-aware task-brief parsing, add fence-aware canonical plan parsing in `plan-task-graph.ts`, and feed both representations through `validateTaskContract`. Validate uniqueness, dependency closure, acyclicity, proof-mode evidence, and ownership overlap only among tasks whose dependencies are already satisfied. Return ordered `BriefIssue` values through existing `formatBriefIssues`.

- [ ] **Step 4: Run GREEN**

Run: `bun test packages/coding-agent/test/task/brief-format.test.ts packages/coding-agent/test/task/task-batch.test.ts packages/coding-agent/test/task/task-graph.test.ts packages/coding-agent/test/plan-mode/plan-task-graph.test.ts`

Expected: native task briefs and canonical plan blocks produce the same `TaskContract`; valid graph passes and every malformed graph returns its named issue.

- [ ] **Step 5: Commit**

```bash
git add packages/coding-agent/src/task/task-contract.ts packages/coding-agent/src/task/brief-format.ts packages/coding-agent/src/task/index.ts packages/coding-agent/src/plan-mode/plan-task-graph.ts packages/coding-agent/test/task packages/coding-agent/test/plan-mode/plan-task-graph.test.ts
git commit -m "feat(task): validate development task graphs"
```

#### Acceptance

- [ ] Native dispatch and plan execution call the same validator.
- [ ] Cycles, unknown dependencies, duplicate IDs, missing proof fields, and concurrent ownership overlap are rejected before spawn.
- RED: focused command fails because graph API is absent.
- GREEN: focused command passes valid and invalid graph cases.
- Escalate when: an ownership expression cannot be normalized to path or symbol scope without changing the approved contract.

---

### Task 3: Create durable workflow artifact tree

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Create: `packages/coding-agent/src/plan-mode/workflow-artifacts.ts`
- Modify: `packages/coding-agent/src/internal-urls/local-protocol.ts`
- Modify: `packages/coding-agent/src/modes/interactive-mode.ts`
- Test: `packages/coding-agent/test/plan-mode/workflow-artifacts.test.ts`
- Test: `packages/coding-agent/test/internal-urls/local-protocol.test.ts`

**Interfaces:**
- Consumes: `ApprovedPlanReference` from Task 1.
- Produces: `WorkflowArtifactPaths` for `design.md`, `plan.md`, `progress.json`, `tasks/`, `reports/`, `reviews/`, and `final-review.json`.
- Produces: atomic JSON write helper using write-to-temp then rename inside one `local://<slug>/` root.

**Ownership:** Workflow path construction and local artifact initialization/copy.
**Non-goals:** Task transition semantics and report/review schemas.

#### Change

- [ ] **Step 1: Write RED** asserting exact paths, directory initialization, fresh-context copy, and atomic replacement without partial JSON.

```ts
expect(workflowArtifactPaths("auth").progress).toBe("local://auth/progress.json");
expect(workflowArtifactPaths("auth").finalReview).toBe("local://auth/final-review.json");
```

- [ ] **Step 2: Run RED**

Run: `bun test packages/coding-agent/test/plan-mode/workflow-artifacts.test.ts packages/coding-agent/test/internal-urls/local-protocol.test.ts`

Expected: module-not-found failure for `workflow-artifacts`.

- [ ] **Step 3: Implement minimum artifact API**

```ts
export interface WorkflowArtifactPaths {
  root: string;
  design: string;
  plan: string;
  progress: string;
  tasks: string;
  reports: string;
  reviews: string;
  finalReview: string;
}
```

Initialize only paths required by the approved plan. Copy the whole root for fresh-context approval. Keep reports and reviews append-only; reject overwrite of an existing evidence file.

- [ ] **Step 4: Run GREEN** using the RED command; expect all exact-path, copy, append-only, and atomic-write assertions to pass.

- [ ] **Step 5: Commit**

```bash
git add packages/coding-agent/src/plan-mode/workflow-artifacts.ts packages/coding-agent/src/internal-urls/local-protocol.ts packages/coding-agent/src/modes/interactive-mode.ts packages/coding-agent/test/plan-mode/workflow-artifacts.test.ts packages/coding-agent/test/internal-urls/local-protocol.test.ts
git commit -m "feat(plan-mode): add durable workflow artifacts"
```

#### Acceptance

- [ ] Runtime creates and copies the canonical tree under one `local://<slug>/` root.
- [ ] JSON state writes are atomic; evidence writes are immutable.
- RED: module missing before implementation.
- GREEN: focused artifact and protocol tests pass.
- Escalate when: local protocol lacks a safe same-filesystem rename primitive.

---

### Task 4: Enforce worker report semantics

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Modify: `packages/coding-agent/src/task/agents.ts`
- Modify: `packages/coding-agent/src/task/executor.ts`
- Create: `packages/coding-agent/src/task/report-gates.ts`
- Modify: `packages/coding-agent/src/prompts/agents/task.md`
- Test: `packages/coding-agent/test/task/worker-report-gates.test.ts`

**Interfaces:**
- Consumes: parsed `TaskContract.owns` and runtime task output.
- Produces: canonical worker report validation result.
- Changes command items to `{ command, exitCode, output }`.

**Ownership:** Worker output schema and semantic acceptance gate.
**Non-goals:** Reviewer output, workflow transitions, and parent verification.

#### Change

- [ ] **Step 1: Write RED** for `done` with `not_run`, `done_with_concerns` with missing proof, changed file outside `owns`, missing exit code, and a valid all-pass report.

```ts
const result = validateWorkerReport(report, { owns: ["src/auth.ts"] });
expect(result.ok).toBe(false);
expect(result.issues).toContain("done requires every acceptance item to pass");
```

- [ ] **Step 2: Run RED**

Run: `bun test packages/coding-agent/test/task/worker-report-gates.test.ts`

Expected: module-not-found failure for `report-gates`.

- [ ] **Step 3: Implement schema and gate**

Use existing lowercase status enums. Require every acceptance item to pass for `done`; allow `done_with_concerns` only when proof is complete and concerns are non-blocking; reject out-of-ownership changes and missing command exit codes. Do not allow `schemaOverridden` to convert a semantically invalid completion into success.

- [ ] **Step 4: Run GREEN** using the RED command; expect every invalid report to fail with its named issue and the valid report to pass.

- [ ] **Step 5: Commit**

```bash
git add packages/coding-agent/src/task packages/coding-agent/src/prompts/agents/task.md packages/coding-agent/test/task/worker-report-gates.test.ts
git commit -m "feat(task): enforce worker completion gates"
```

#### Acceptance

- [ ] Child completion cannot bypass acceptance or ownership checks.
- [ ] Every command records exit code and decisive output.
- RED: report gate module absent.
- GREEN: focused report-gate test passes.
- Escalate when: runtime cannot determine changed paths for a worker result.

---

### Task 5: Normalize reviewer schema and blocking gates

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Modify: `packages/coding-agent/src/task/types.ts`
- Modify: `packages/coding-agent/src/tools/review.ts`
- Modify: `packages/coding-agent/src/prompts/agents/reviewer.md`
- Create: `packages/coding-agent/src/task/reviewer-gates.ts`
- Test: `packages/coding-agent/test/tools/review.test.ts`
- Create: `packages/coding-agent/test/task/reviewer-gates.test.ts`

**Interfaces:**
- Produces: review status `approved | approved_with_notes | changes_required`.
- Produces: severity `critical | important | note` and scope `task | final | ad_hoc`.
- Produces: `validateReviewerResult(review): GateResult`.

**Ownership:** Reviewer schema, parser, rendering, and blocking decision.
**Non-goals:** Review dispatch sequencing and progress persistence.

#### Change

- [ ] **Step 1: Write RED** proving critical/important findings force `changes_required`, notes may produce `approved_with_notes`, and approved verdicts cannot contain blocking findings.

```ts
expect(validateReviewerResult({
  status: "approved",
  critical: [finding],
  important: [],
  notes: [],
  cannot_verify: [],
}).ok).toBe(false);
```

- [ ] **Step 2: Run RED**

Run: `bun test packages/coding-agent/test/tools/review.test.ts packages/coding-agent/test/task/reviewer-gates.test.ts`

Expected: missing canonical status/severity types and gate assertions fail.

- [ ] **Step 3: Replace P0-P3/overall-correctness dialect** across types, parser, prompt, and renderer in one cutover. Do not retain aliases.

- [ ] **Step 4: Run GREEN** using the RED command; expect canonical parse/render/gate cases to pass.

- [ ] **Step 5: Commit**

```bash
git add packages/coding-agent/src/task/types.ts packages/coding-agent/src/task/reviewer-gates.ts packages/coding-agent/src/tools/review.ts packages/coding-agent/src/prompts/agents/reviewer.md packages/coding-agent/test/tools/review.test.ts packages/coding-agent/test/task/reviewer-gates.test.ts
git commit -m "feat(review): enforce canonical reviewer gates"
```

#### Acceptance

- [ ] Runtime and reviewer prompt expose one vocabulary.
- [ ] Zero open critical or important findings is required for approval.
- RED: legacy types cannot satisfy canonical tests.
- GREEN: focused review tests pass.
- Escalate when: another public consumer requires a staged schema migration; approved design requires clean cutover.

---

### Task 6: Persist progress and recover interrupted workflows

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Create: `packages/coding-agent/src/plan-mode/workflow-progress.ts`
- Create: `packages/coding-agent/src/plan-mode/workflow-recovery.ts`
- Modify: `packages/coding-agent/src/session/agent-session.ts`
- Modify: `packages/coding-agent/src/task/index.ts`
- Test: `packages/coding-agent/test/plan-mode/progress-recovery.test.ts`

**Interfaces:**
- Consumes: artifact paths from Task 3, task graph from Task 2, report gate from Task 4, reviewer gate from Task 5.
- Produces: task states `pending | ready | running | reported | reviewed | accepted | blocked | changes_required`.
- Produces: atomic `transitionTask` and `recoverWorkflow`.

**Ownership:** `progress.json`, transition validation, restart/compaction reconciliation.
**Non-goals:** Skill orchestration prose and final branch operations.

#### Change

- [ ] **Step 1: Write RED** for legal transitions, illegal skips, dependency promotion, interrupted `running` recovery, accepted-task immutability, report/review disagreement, and ownership conflict refusal.

```ts
expect(() => transitionTask(progress, "BuildApi", "accepted")).toThrow(
  "running cannot transition directly to accepted",
);
```

- [ ] **Step 2: Run RED**

Run: `bun test packages/coding-agent/test/plan-mode/progress-recovery.test.ts`

Expected: module-not-found failure for progress/recovery modules.

- [ ] **Step 3: Implement state machine** with explicit transition table, atomic writes, report/review evidence paths, exact plan hash, base/current revisions, and recovery rules. Recovery marks interrupted `running` tasks `blocked`, promotes dependency-satisfied tasks to `ready`, preserves accepted tasks, and refuses ambiguous overlapping ownership.

- [ ] **Step 4: Run GREEN** using the RED command; expect all transition and recovery scenarios to pass.

- [ ] **Step 5: Commit**

```bash
git add packages/coding-agent/src/plan-mode/workflow-progress.ts packages/coding-agent/src/plan-mode/workflow-recovery.ts packages/coding-agent/src/session/agent-session.ts packages/coding-agent/src/task/index.ts packages/coding-agent/test/plan-mode/progress-recovery.test.ts
git commit -m "feat(plan-mode): recover durable workflow progress"
```

#### Acceptance

- [ ] Restart and compaction resume exact plan and accepted evidence.
- [ ] Illegal transitions and ambiguous ownership fail closed.
- RED: state machine absent.
- GREEN: focused recovery test passes.
- Escalate when: session restart lacks a deterministic hook before first task dispatch.

---

### Task 7: Align native prompts and run integration proof

**Executor:** `parent`
**Leaf class:** `parent`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `packages/coding-agent/src/prompts/system/plan-mode-active.md`
- Modify: `packages/coding-agent/src/prompts/system/plan-mode-approved.md`
- Modify: `packages/coding-agent/src/prompts/system/plan-mode-compact-instructions.md`
- Modify: `packages/coding-agent/src/prompts/system/plan-mode-reference.md`
- Modify: `packages/coding-agent/src/prompts/system/plan-mode-subagent.md`
- Test: `packages/coding-agent/src/plan-mode/approved-plan-prompt.test.ts`
- Test: `packages/coding-agent/test/agent-session-plan-mode-convergence.test.ts`

**Interfaces:**
- Consumes: Tasks 1-6 runtime contracts.
- Produces: one native prompt contract for plan creation, approval, reread, compaction, and read-only plan scouts.

**Ownership:** Plan-mode prompt text and final runtime integration verification.
**Non-goals:** Superpowers skill prose and global agent configuration.

#### Change

- [ ] **Step 1: Update prompt assertions** to require exact `local://<slug>/plan.md`, hash-backed reread, canonical task headings, and `progress.json` recovery instructions.

- [ ] **Step 2: Run focused verification**

Run: `bun test packages/coding-agent/src/plan-mode/approved-plan-prompt.test.ts packages/coding-agent/test/agent-session-plan-mode-convergence.test.ts packages/coding-agent/test/plan-mode packages/coding-agent/test/task/brief-format.test.ts packages/coding-agent/test/task/task-graph.test.ts packages/coding-agent/test/task/worker-report-gates.test.ts packages/coding-agent/test/task/reviewer-gates.test.ts`

Expected: all focused runtime contract tests pass.

- [ ] **Step 3: Run package checks**

Run: `bun run typecheck`

Expected: exit 0.

Run: `bun test packages/coding-agent/test`

Expected: exit 0 with no plan-mode, task, session, or review regressions.

- [ ] **Step 4: Commit**

```bash
git add packages/coding-agent/src/prompts/system packages/coding-agent/src/plan-mode/approved-plan-prompt.test.ts packages/coding-agent/test/agent-session-plan-mode-convergence.test.ts
git commit -m "feat(plan-mode): align workflow prompts and recovery"
```

#### Acceptance

- [ ] Interactive and ACP approval use the same plan identity and workflow contracts.
- [ ] Plan scouts remain read-only.
- [ ] Focused tests, type check, and complete coding-agent test suite pass.
- GREEN: commands above exit 0.
- Escalate when: any unrelated existing suite failure prevents distinguishing regression from baseline.
