# Superpowers Development Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert Superpowers into an opt-in OMP development workflow that uses native runtime contracts and stays dormant during general research.

**Architecture:** Remove unconditional Pi extension injection and expose skills through package discovery only. Rewrite skills around one native plan/task/report/review vocabulary, delete duplicate execution and worktree controllers, and rely on OMP runtime validation instead of package-local workflow state.

**Tech Stack:** Markdown skills, TypeScript extension removal, Python/shell helper deletion or retargeting, Node test runner, existing explicit-skill pressure harness.

## Global Constraints

- Worktree: `/Users/speedzaza/Work/superpowers-agent-hardening`.
- Prerequisite: `2026-07-18-omp-runtime-workflow-contracts.md` is complete and installed OMP exposes its canonical contracts.
- General research must not invoke `using-superpowers` or development ceremony unless user explicitly requests a skill.
- Preserve package `pi.skills: ["./skills"]`; remove `pi.extensions` for this OMP-native fork.
- Use native `task`, `hub`, `todo`, `grep`, and `glob`; no Pi mappings or invented tools.
- Use executor classes `parent | mechanical | integration`; runtime resolves concrete agents.
- Use one plan artifact tree, one execution controller, one report schema, and one reviewer schema.
- No compatibility aliases for removed skills, paths, tools, statuses, or severity terms.
- Parent runs package-wide tests once after writer fan-in.

---

## Implementation Tasks

### Task 1: Cut over plugin boundary and development router

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Modify: `package.json`
- Delete: `.pi/extensions/superpowers.ts`
- Modify: `skills/using-superpowers/SKILL.md`
- Delete: `skills/using-superpowers/references/pi-tools.md`
- Delete: `skills/using-superpowers/references/codex-tools.md`
- Delete: `skills/using-superpowers/references/antigravity-tools.md`
- Replace: `tests/pi/test-pi-extension.mjs`
- Create: `tests/pi/test-development-router.mjs`

**Interfaces:**
- Consumes: OMP `omp-plugins` skill discovery.
- Produces: model-invoked `using-superpowers` description for development eligibility.
- Produces: explicit `/skill:name` access without context injection.

**Ownership:** Package Pi manifest, removed extension, router skill, Pi boundary tests.
**Non-goals:** Other harness plugins and hooks, downstream skill bodies, OMP runtime.

#### Change

- [ ] **Step 1: Replace legacy extension test with RED boundary assertions**

```js
assert.deepEqual(pkg.pi.skills, ["./skills"]);
assert.equal("extensions" in pkg.pi, false);
assert.equal(existsSync(extensionPath), false);
```

Add behavioral router fixtures for these outcomes:

```js
const cases = [
  ["Implement OAuth callback", "using-superpowers"],
  ["Fix failing cache test", "using-superpowers"],
  ["Research five competing weather archives with parallel scouts", null],
  ["Explain this paper", null],
];
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/pi/test-pi-extension.mjs tests/pi/test-development-router.mjs`

Expected: manifest still contains `pi.extensions`, extension exists, and old router description says every conversation.

- [ ] **Step 3: Remove extension and rewrite router**

Set package integration to:

```json
"pi": {
  "skills": ["./skills"]
}
```

Router frontmatter description must enumerate development triggers and research non-triggers. Body contains only precedence and routes:

```text
new behavior/design -> brainstorming
bug/failure -> systematic-debugging
review feedback -> receiving-code-review
skill create/modify -> writing-skills
completion claim -> verification-before-completion
```

Remove session bootstrap rules, platform adaptation, rationalization tables, and platform reference files.

- [ ] **Step 4: Run GREEN**

Run: `node --test tests/pi/test-pi-extension.mjs tests/pi/test-development-router.mjs`

Expected: skills-only manifest, no extension, development fixtures route, research fixtures do not.

- [ ] **Step 5: Commit**

```bash
git add package.json skills/using-superpowers tests/pi
git add -u .pi/extensions/superpowers.ts
git commit -m "feat(omp): make Superpowers development-only"
```

#### Acceptance

- [ ] Installed package discovers skills with no unconditional bootstrap message.
- [ ] Development intent and explicit invocation enter router; research does not.
- [ ] Other harness packaging remains untouched.
- RED: old manifest/router fail boundary assertions.
- GREEN: focused Node tests pass.
- Escalate when: installed OMP fails to discover `pi.skills` without an extension; verify provider behavior before adding any adapter.

---

### Task 2: Compile approved designs into native task graphs

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Modify: `skills/brainstorming/SKILL.md`
- Modify: `skills/brainstorming/spec-document-reviewer-prompt.md`
- Modify: `skills/writing-plans/SKILL.md`
- Delete: `skills/writing-plans/plan-document-reviewer-prompt.md`
- Delete: `skills/executing-plans/SKILL.md`
- Delete: `skills/using-git-worktrees/SKILL.md`
- Create: `tests/omp/test-plan-contract.mjs`

**Interfaces:**
- Consumes: native plan mode and canonical runtime `TaskContract`.
- Produces: `local://<slug>/design.md` and `local://<slug>/plan.md`.
- Produces per task: stable CamelCase ID, executor, proof mode, owns, depends-on, Target, Change, Acceptance, and Escalate.

**Ownership:** Design and planning skills plus redundant planning/worktree skill removal.
**Non-goals:** Execution, report/review handling, proof procedures, branch completion.

#### Change

- [ ] **Step 1: Write RED contract scenarios** asserting a generated sample plan passes native task-graph validation and rejected samples cover missing proof mode, ownership overlap, and dependency cycle.

```js
assert.equal(validPlan.tasks[0].id, "BuildAuthApi");
assert.deepEqual(validPlan.tasks[0].dependsOn, []);
assert.equal(validPlan.tasks[0].proofMode, "tdd");
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/omp/test-plan-contract.mjs`

Expected: current plan format lacks stable IDs, `owns`, and `dependsOn`; test fails.

- [ ] **Step 3: Rewrite planning flow**

`brainstorming` keeps intent discovery, alternatives, sectional user approval, written design, and self-review. It writes `design.md` inside the native plan artifact root and hands off to native plan mode; it does not commit, create worktrees, approve, or execute.

`writing-plans` becomes a task-graph compiler. Every task emits exactly:

```markdown
## Task: BuildAuthApi
**Depends on:** none
**Executor:** integration
**Proof mode:** tdd
**Owns:** `src/auth/**`; `tests/auth/**`

### Target
Modify `src/auth.ts:createAuthCallback`; add `tests/auth/auth-callback.test.ts`. Do not change session storage.
### Change
Reject callbacks whose state token does not match the active session before exchanging the authorization code.
### Acceptance
RED: mismatched state currently reaches token exchange. GREEN: focused test proves token exchange is not called and response is 400.
### Escalate when
Callback state ownership or expected HTTP status is not established by code, tests, or approved design.
```

Delete `executing-plans`, `using-git-worktrees`, and the second plan-review template. Native plan approval and SDD are the only handoff.

- [ ] **Step 4: Run GREEN**

Run: `node --test tests/omp/test-plan-contract.mjs`

Expected: valid plan passes runtime validator; malformed examples fail with named issues.

- [ ] **Step 5: Commit**

```bash
git add skills/brainstorming skills/writing-plans tests/omp/test-plan-contract.mjs
git add -u skills/executing-plans skills/using-git-worktrees
git commit -m "feat(planning): compile native development task graphs"
```

#### Acceptance

- [ ] Native plan mode is sole planner, artifact owner, and approval owner.
- [ ] `writing-plans` only compiles approved design into runtime-valid tasks.
- [ ] No alternate execution or worktree lifecycle skill remains active.
- RED: current plan shape fails canonical parser.
- GREEN: focused contract test passes.
- Escalate when: repo policy requires permanent committed design docs; preserve a copy as project documentation without making it workflow state.

---

### Task 3: Make SDD the single execution controller

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `tdd`

#### Target

**Files:**
- Modify: `skills/subagent-driven-development/SKILL.md`
- Modify: `skills/subagent-driven-development/implementer-prompt.md`
- Modify: `skills/subagent-driven-development/task-reviewer-prompt.md`
- Delete: `skills/subagent-driven-development/scripts/task-brief`
- Delete: `skills/subagent-driven-development/scripts/sdd-workspace`
- Delete: `skills/subagent-driven-development/scripts/review-package`
- Modify: `skills/dispatching-parallel-agents/SKILL.md`
- Replace: `tests/claude-code/test-subagent-driven-development.sh`
- Replace: `tests/claude-code/test-subagent-driven-development-integration.sh`
- Delete: `tests/claude-code/test-task-brief.sh`
- Delete: `tests/claude-code/test-sdd-workspace.sh`
- Delete: `tests/claude-code/test-worktree-native-preference.sh`
- Delete: `tests/claude-code/test-worktree-path-policy.sh`
- Create: `tests/omp/test-sdd-contract.mjs`

**Interfaces:**
- Consumes: native approved plan, `progress.json`, runtime task parser, worker report gate, and reviewer gate.
- Produces: one native `task` batch per dependency wave, canonical worker/reviewer JSON, parent acceptance transitions, integration verification, and final review.

**Ownership:** SDD controller, worker/reviewer templates used by SDD, thin fan-out skill, obsolete SDD scripts/tests.
**Non-goals:** Proof-method skill content, generic review skill, final branch choice.

#### Change

- [ ] **Step 1: Write RED scenarios** for one batched wave, sequential overlap, report rejection, review fix-loop, accepted transition, and restart from persisted progress.

```js
assert.equal(trace.taskCalls.length, 1);
assert.deepEqual(trace.taskCalls[0].tasks.map(task => task.name), ["ApiTask", "UiTask"]);
assert.equal(trace.progress.ApiTask.state, "accepted");
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/omp/test-sdd-contract.mjs`

Expected: current SDD depends on `.superpowers/sdd`, numeric Task N parsing, and separate scripts; canonical trace assertions fail.

- [ ] **Step 3: Rewrite controller and templates**

SDD reads exact approved plan URI, asks runtime for ready tasks, dispatches one native batch, consumes structured results, requests task review only after report validation, records accepted evidence, loops `changes_required` through one focused fix task, and runs parent integration verification once after fan-in. It never injects full plan text into children.

`dispatching-parallel-agents` stays a thin generic fan-out procedure and uses executor capabilities `mechanical`/`integration`, not concrete agent names in plan contracts.

Delete scripts whose parser, workspace, or review-package ownership now belongs to runtime.

- [ ] **Step 4: Run GREEN**

Run: `node --test tests/omp/test-sdd-contract.mjs`

Expected: dependency, ownership, report, review, restart, and single-batch scenarios pass.

- [ ] **Step 5: Commit**

```bash
git add skills/subagent-driven-development skills/dispatching-parallel-agents tests/omp/test-sdd-contract.mjs tests/claude-code
git commit -m "feat(sdd): execute native workflow contracts"
```

#### Acceptance

- [ ] SDD is the only approved-plan execution controller.
- [ ] Parent acceptance cannot be bypassed by child prose or invalid JSON.
- [ ] Independent tasks batch once; overlapping writers remain sequential.
- [ ] `.superpowers/sdd` and duplicate parser scripts are gone.
- RED: legacy SDD trace fails canonical scenario.
- GREEN: focused SDD contract test passes.
- Escalate when: native runtime lacks an API required to query ready tasks or record transitions; fix runtime rather than recreating state in the skill package.

---

### Task 4: Align debugging, TDD, and completion evidence

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `skills/systematic-debugging/SKILL.md`
- Modify: `skills/test-driven-development/SKILL.md`
- Modify: `skills/verification-before-completion/SKILL.md`
- Modify: `skills/test-driven-development/testing-anti-patterns.md`
- Create: `tests/omp/test-proof-modes.mjs`

**Interfaces:**
- Consumes: task `proofMode`.
- Produces: `tdd` RED/GREEN evidence, `verification` focused command evidence, or `experiment` executed artifact evidence.

**Ownership:** Root-cause, proof selection, TDD, and completion-claim procedures.
**Non-goals:** Review intake, review dispatch, parent acceptance, full SDD control.

#### Change

- [ ] **Step 1: Write RED matrix**

```js
assert.equal(runCase("bugfix", "tdd").requiresRed, true);
assert.equal(runCase("config audit", "verification").requiresRed, false);
assert.equal(runCase("benchmark", "experiment").requiresArtifact, true);
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/omp/test-proof-modes.mjs`

Expected: current TDD skill demands RED for all features/bug fixes and completion skill does not distinguish proof contracts.

- [ ] **Step 3: Rewrite proof procedures**

Systematic debugging owns root cause and hands off to the approved task proof mode. TDD activates only for `proofMode=tdd`; worker runs focused RED/GREEN while parent owns full-suite integration. Verification requires fresh focused output. Experiment requires executed result/artifact. Completion evidence never marks parent acceptance by itself.

- [ ] **Step 4: Run GREEN** using the RED command; expect all proof-mode routing assertions to pass.

- [ ] **Step 5: Commit**

```bash
git add skills/systematic-debugging skills/test-driven-development skills/verification-before-completion tests/omp/test-proof-modes.mjs
git commit -m "feat(proof): align evidence with task proof modes"
```

#### Acceptance

- [ ] TDD is strict when selected and absent when unrelated.
- [ ] Verification and experiment cannot fabricate RED ceremony.
- [ ] Completion claims require fresh evidence and parent acceptance remains separate.
- GREEN: focused proof-mode test passes.
- Escalate when: a task has no proof mode; runtime must reject the plan before execution.

---

### Task 5: Unify review and branch finishing

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `skills/receiving-code-review/SKILL.md`
- Modify: `skills/requesting-code-review/SKILL.md`
- Modify: `skills/requesting-code-review/code-reviewer.md`
- Modify: `skills/finishing-a-development-branch/SKILL.md`
- Create: `tests/omp/test-review-contract.mjs`

**Interfaces:**
- Consumes: canonical runtime review schema and recorded base/current revisions.
- Produces: task/final/ad_hoc review requests and approved final-review gate before branch decisions.

**Ownership:** Review intake, review request, reviewer template, final branch decision.
**Non-goals:** Runtime schema, SDD task scheduling, proof implementation.

#### Change

- [ ] **Step 1: Write RED review matrix**

```js
assert.equal(review({ critical: 1, important: 0, notes: 0 }).status, "changes_required");
assert.equal(review({ critical: 0, important: 0, notes: 1 }).status, "approved_with_notes");
assert.equal(finalize({ parentVerified: false, finalReview: "approved" }).allowed, false);
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/omp/test-review-contract.mjs`

Expected: legacy Critical/Important/Minor, Approved/NeedsFixes, and `HEAD~1` guidance fail canonical assertions.

- [ ] **Step 3: Rewrite review lifecycle**

Use only `critical | important | note`, `approved | approved_with_notes | changes_required`, and `task | final | ad_hoc`. Review exact recorded base/current range; remove `HEAD~1`. Receiving feedback verifies claims, routes bugs to systematic debugging, and applies accepted changes under the task proof mode. Finishing requires parent integration verification and approved final review before merge/PR/keep/discard.

- [ ] **Step 4: Run GREEN** using the RED command; expect review vocabulary, blocking, range, and finishing gate cases to pass.

- [ ] **Step 5: Commit**

```bash
git add skills/receiving-code-review skills/requesting-code-review skills/finishing-a-development-branch tests/omp/test-review-contract.mjs
git commit -m "feat(review): unify review and branch gates"
```

#### Acceptance

- [ ] Critical or important findings block completion; notes do not.
- [ ] Final review uses recorded range, never inferred `HEAD~1`.
- [ ] Branch choice is unavailable before parent verification and final approval.
- GREEN: focused review contract test passes.
- Escalate when: worktree provenance cannot identify the recorded branch range.

---

### Task 6: Rewrite skill authoring under precise pruning rules

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `skills/writing-skills/SKILL.md`
- Modify: `skills/writing-skills/anthropic-best-practices.md`
- Modify: `skills/writing-skills/persuasion-principles.md`
- Modify: `skills/writing-skills/testing-skills-with-subagents.md`
- Delete: `skills/writing-skills/examples/CLAUDE_MD_TESTING.md`
- Create: `tests/omp/test-skill-authoring-contract.mjs`

**Interfaces:**
- Produces: one authoring procedure with invocation, hierarchy, completion criteria, context pointers, pruning, and pressure tests.
- Consumes: the approved `writing-great-skills` glossary principles.

**Ownership:** Skill-authoring content and its deterministic checks.
**Non-goals:** Rewriting other skills in this task.

#### Change

- [ ] **Step 1: Write RED** for model-invoked/user-invoked descriptions, branch-per-trigger structure, explicit completion criteria, no-op/duplication/sediment/pruning checks, and trigger/non-trigger/handoff pressure cases.

- [ ] **Step 2: Run RED**

Run: `node --test tests/omp/test-skill-authoring-contract.mjs`

Expected: current skill lacks the approved ordered authoring and pruning contract.

- [ ] **Step 3: Rewrite skill and prune references** so one leading concept anchors each behavior, progressive disclosure has precise context pointers, every branch has a checkable completion criterion, and every edit self-applies no-op, duplication, sediment, sprawl, and negative-steering checks.

- [ ] **Step 4: Run GREEN** using the RED command; expect all authoring-contract scenarios to pass.

- [ ] **Step 5: Commit**

```bash
git add skills/writing-skills tests/omp/test-skill-authoring-contract.mjs
git commit -m "feat(skills): enforce precise authoring contracts"
```

#### Acceptance

- [ ] Authoring skill governs every skill edit with checkable completion and pressure evidence.
- [ ] Long references load only through precise context pointers.
- [ ] Dead example sediment is removed.
- GREEN: focused authoring contract test passes.
- Escalate when: a retained external reference lacks a runnable pressure scenario.

---

### Task 7: Run research and development pressure workflows

**Executor:** `parent`
**Leaf class:** `parent`
**Proof mode:** `experiment`

#### Target

**Files:**
- Create: `tests/omp/pressure-cases.json`
- Create: `tests/omp/run-pressure-tests.mjs`
- Modify: `docs/testing.md`

**Interfaces:**
- Consumes: completed Tasks 1-6 and installed patched OMP runtime.
- Produces: deterministic results for trigger, non-trigger, premature completion, handoff, hierarchy, pruning, research fan-out, and complete development cycle.

**Ownership:** End-to-end pressure runner, scenario corpus, testing instructions, final package verification.
**Non-goals:** Further skill redesign during the run; failures become focused fix tasks.

#### Change

- [ ] **Step 1: Encode scenarios** with exact expected skill route/tool trace, including:

```json
{
  "id": "ResearchFanoutNoSuperpowers",
  "prompt": "Research three independent primary sources in parallel and synthesize them.",
  "mustUse": ["task"],
  "mustNotUse": ["using-superpowers", "todo"],
  "mustNotCreate": ["design.md", "plan.md", "progress.json"]
}
```

Include one scenario per active skill for trigger, non-trigger, premature-completion resistance, and next handoff.

- [ ] **Step 2: Run all deterministic package tests**

Run: `node --test tests/pi/*.mjs tests/omp/*.mjs`

Expected: exit 0.

- [ ] **Step 3: Run pressure scenarios against patched OMP**

Run: `node tests/omp/run-pressure-tests.mjs --omp /Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/cli.ts`

Expected: every case records `pass`, exact invoked skills, task calls, hub messages, artifact paths, and terminal result.

- [ ] **Step 4: Run existing package checks**

Run: `bash tests/shell-lint/test-lint-shell.sh`

Expected: exit 0.

Run: `cd tests/brainstorm-server && npm test`

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add tests/omp docs/testing.md
git commit -m "test(omp): cover research and development workflows"
```

#### Acceptance

- [ ] General research fans out without Superpowers development ceremony.
- [ ] Development and explicit skill requests enter correct procedures.
- [ ] Every active skill has trigger, non-trigger, pressure, and handoff evidence.
- [ ] Complete design-to-final-review workflow passes.
- Artifact: pressure runner output with one terminal result per scenario.
- Escalate when: OMP lacks deterministic trace output; add test-only observation at runtime boundary, never production workflow state.
