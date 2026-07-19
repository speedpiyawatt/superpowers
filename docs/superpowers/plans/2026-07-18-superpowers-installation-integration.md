# Superpowers Installation and Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install the approved runtime and skill cutovers, narrow global agent instructions to universal invariants, and prove native research fan-out remains independent from the development workflow.

**Architecture:** Global `AGENTS.md` becomes a small universal policy; development contracts live in Superpowers skills and configured agent definitions. Installation pins exact local fork revisions, then two smoke workflows prove research and development behavior end to end.

**Tech Stack:** OMP YAML/Markdown configuration, custom agent frontmatter, Bun package installation, native `task`/`hub`, OMP pressure runner from the Superpowers fork.

## Global Constraints

- Prerequisites: both `2026-07-18-omp-runtime-workflow-contracts.md` and `2026-07-18-superpowers-development-workflow.md` pass their acceptance gates.
- Preserve `/Users/speedzaza/.omp/agent/APPEND_SYSTEM.md`, `/Users/speedzaza/.omp/agent/rules/`, model overrides, memory settings, disabled-agent settings, and remote-shell preferences.
- Preserve the user-specific writing-style section from global `AGENTS.md`.
- Global policy must not contain proof modes, RED/GREEN, reviewer gates, full-suite rules, branch lifecycle, static agent catalog, or stale `job`/`irc` vocabulary.
- Choose agents from runtime Available Agents; disabled agents remain unavailable.
- Research uses native fan-out and source-backed synthesis without Superpowers development artifacts.
- Development uses approved native plan, task, report, review, and final-verification contracts.

---

### Task 1: Narrow global AGENTS.md to universal policy

**Executor:** `parent`
**Leaf class:** `parent`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `/Users/speedzaza/.omp/agent/AGENTS.md`
- Create: `tests/omp/test-global-agent-contract.mjs`

**Interfaces:**
- Produces: universal grounding, batching, decisions, coordination, agent choice, and writing-style policy.
- Consumes: native runtime Available Agents and `hub` behavior.

**Ownership:** Global AGENTS content and deterministic policy check.
**Non-goals:** `APPEND_SYSTEM.md`, remote-shell rules, runtime source, skill bodies, agent frontmatter.

#### Change

- [ ] **Step 1: Write RED policy test**

```js
assert.match(text, /## Grounding/);
assert.match(text, /## Task batching/);
assert.match(text, /## Peer coordination/);
assert.match(text, /# Writing style/);
for (const stale of ["`job`", "`irc`", "Leaf class", "RED then GREEN", "Critical\/Important", "HEAD~1"]) {
  assert.equal(text.includes(stale), false, stale);
}
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/omp/test-global-agent-contract.mjs`

Expected: current global file contains `job`, `irc`, leaf-class, proof, and reviewer ceremony; test fails.

- [ ] **Step 3: Replace orchestration body** with six sections:

```markdown
# Agent contract

## Grounding
Name load-bearing claims, inspect code/docs/executed proof, bind receipts, then act. Mark unresolved claims instead of guessing.

## Task batching
Batch genuinely independent work through native `task`. Maximize parallel read-only research and isolated work. Keep one writer per path or mutable resource. Children start blank; pass complete Goal/Constraints/Contract and Target/Change/Acceptance context. Use `local://` for large shared context.

## Decisions and acceptance
Parent owns product, API, architecture, security, scope, integration, and final claims. Child output is evidence input; synthesize and spot-check it. Never claim completion while required delegated work is incomplete or running.

## Peer coordination
Use `hub` only for dependency results, ownership conflicts, contract-changing discoveries, or parent decisions. No routine status or completion pings. Use current peer IDs; never inspect peer session files.

## Agent choice
Choose the narrowest capable role from runtime Available Agents. A `-blocking` name waits; a plain name runs asynchronously. Do not maintain a static catalog here.
```

Append the existing `# Writing style` section unchanged.

- [ ] **Step 4: Run GREEN**

Run: `node --test tests/omp/test-global-agent-contract.mjs`

Expected: universal sections present, development-only/stale vocabulary absent, writing style byte-for-byte preserved.

- [ ] **Step 5: Commit test with integration plan repository**

```bash
cd /Users/speedzaza/Work/superpowers-agent-hardening
git add tests/omp/test-global-agent-contract.mjs
git commit -m "test(omp): guard universal global agent policy"
```

Global file is user configuration and remains outside the repository commit.

#### Acceptance

- [ ] Research sessions receive grounding and fan-out rules without development ceremony.
- [ ] Writing style and external user preferences remain unchanged.
- [ ] Static disabled-agent names and stale tools are absent.
- RED: old global policy fails deterministic test.
- GREEN: rewritten policy passes.
- Escalate when: another global file injects the removed development ceremony; identify its exact source before editing.

---

### Task 2: Align configured agent definitions with native contracts

**Executor:** `worker`
**Leaf class:** `integration`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `/Users/speedzaza/.omp/agent/agents/scout.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/scout-blocking.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/planner.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/planner-blocking.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/reviewer.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/reviewer-blocking.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/dumb-worker.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/dumb-worker-blocking.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/worker.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/worker-blocking.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/researcher.md`
- Modify: `/Users/speedzaza/.omp/agent/agents/researcher-blocking.md`
- Create: `tests/omp/test-configured-agent-contracts.mjs`

**Interfaces:**
- Consumes: runtime-valid tool names and canonical report/review schemas.
- Produces: enabled agents compatible with Available Agents discovery and native `hub` coordination.

**Ownership:** Enabled custom agent definitions and deterministic contract test.
**Non-goals:** Disabled agent files, `config.yml` model overrides/disabled list, global policy, skill bodies.

#### Change

- [ ] **Step 1: Write RED frontmatter/schema checks**

```js
assert.equal(agent.tools.includes("intercom"), false);
assert.equal(agent.tools.includes("hub"), true);
assert.deepEqual(worker.statusEnum, ["done", "done_with_concerns", "blocked", "needs_context"]);
assert.deepEqual(reviewer.statusEnum, ["approved", "approved_with_notes", "changes_required"]);
```

Planner contract must emit executor capability only:

```js
assert.equal(planner.body.includes("Leaf class"), false);
assert.match(planner.body, /Executor.*parent.*mechanical.*integration/s);
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/omp/test-configured-agent-contracts.mjs`

Expected: enabled files still expose `intercom`, planner emits dual taxonomy, or reviewer references `progress.md`; test fails.

- [ ] **Step 3: Rewrite enabled definitions**

Use runtime-valid `hub` coordination, remove `intercom`/`contact_supervisor` dialects, remove planner Leaf class, point reviewer context to `progress.json`, and preserve structured worker/reviewer output keys exactly. Keep read-only roles read-only and writer ownership unchanged.

- [ ] **Step 4: Verify runtime discovery**

Run: `node --test tests/omp/test-configured-agent-contracts.mjs`

Expected: all static contract checks pass.

Run one native batch containing `scout`, `researcher`, `dumb-worker`, `worker`, and `reviewer` read-only identity tasks.

Expected: runtime accepts every enabled definition, each returns its structured terminal result, and no unknown-tool diagnostic appears.

- [ ] **Step 5: Commit test**

```bash
cd /Users/speedzaza/Work/superpowers-agent-hardening
git add tests/omp/test-configured-agent-contracts.mjs
git commit -m "test(omp): validate configured agent contracts"
```

Agent files remain user configuration outside the repository commit.

#### Acceptance

- [ ] Every enabled agent loads with current tools and schemas.
- [ ] Planner emits one executor taxonomy.
- [ ] Reviewer reads canonical progress and returns canonical verdict.
- [ ] Disabled agent configuration remains unchanged.
- GREEN: deterministic test and native batch both pass.
- Escalate when: agent sandbox exposes a coordination tool name different from parent `hub`; bind to runtime schema rather than adding aliases.

---

### Task 3: Pin and install approved runtime and plugin revisions

**Executor:** `parent`
**Leaf class:** `parent`
**Proof mode:** `verification`

#### Target

**Files:**
- Modify: `/Users/speedzaza/.omp/plugins/package.json`
- Modify: `/Users/speedzaza/.omp/plugins/bun.lock`
- Verify: `/Users/speedzaza/.omp/plugins/node_modules/superpowers/package.json`
- Verify: installed OMP binary/runtime points at `/Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev` build.

**Interfaces:**
- Consumes: exact passing commits from prerequisite plans.
- Produces: installed patched OMP runtime and Superpowers package.

**Ownership:** Local installation pins and lockfile.
**Non-goals:** New source changes, global agent prose, pressure scenario design.

#### Change

- [ ] **Step 1: Record exact revisions**

Run: `git rev-parse HEAD` in each prerequisite worktree.

Expected: one 40-character runtime revision and one 40-character Superpowers revision whose focused suites passed.

- [ ] **Step 2: Update plugin pin** to the exact Superpowers revision using the existing GitHub dependency form; do not use a branch or abbreviated hash.

- [ ] **Step 3: Install**

Run: `bun install --cwd /Users/speedzaza/.omp/plugins`

Expected: exit 0; lockfile records exact full revision.

- [ ] **Step 4: Verify installed boundary**

Run: `node --test /Users/speedzaza/Work/superpowers-agent-hardening/tests/pi/test-pi-extension.mjs`

Expected: installed package has `pi.skills`, no `pi.extensions`, and no `.pi/extensions/superpowers.ts`.

Restart OMP once so skill metadata and custom agent definitions reload.

- [ ] **Step 5: Record installation evidence** in the workflow report with runtime revision, plugin revision, install exit status, and boundary-test output.

#### Acceptance

- [ ] Installed package matches exact approved commit.
- [ ] Lockfile contains full immutable revision.
- [ ] OMP reloads skills with no unconditional bootstrap injection.
- GREEN: install and installed-boundary test exit 0.
- Escalate when: package manager resolves a different revision or stale cache; stop before smoke tests.

---

### Task 4: Prove research fan-out and development workflow coexist

**Executor:** `parent`
**Leaf class:** `parent`
**Proof mode:** `experiment`

#### Target

**Files:**
- Use: `tests/omp/pressure-cases.json`
- Use: `tests/omp/run-pressure-tests.mjs`
- Produce: `local://superpowers-integration/research-result.json`
- Produce: `local://superpowers-integration/development-result.json`

**Interfaces:**
- Consumes: installed runtime, plugin, global policy, and agent definitions from Tasks 1-3.
- Produces: terminal evidence for both operating modes.

**Ownership:** Final live smoke workflows and evidence artifacts.
**Non-goals:** Fixing failures inline; each failure becomes one scoped task under its owning prerequisite plan.

#### Change

- [ ] **Step 1: Run research fan-out smoke**

Prompt: `Research three independent primary sources about one current technical question. Dispatch all three in one native task batch, let peers share consequential discoveries through hub, and synthesize source-backed findings.`

Expected:
- one `task` batch with three read-only research slices;
- no `using-superpowers`, brainstorming, development plan, proof mode, review gate, or workflow artifact tree;
- source links and parent spot-check in final synthesis;
- routine progress produces no `hub` message.

- [ ] **Step 2: Run development smoke**

Prompt: `Add one observable behavior to a disposable fixture project, using the installed development workflow.`

Expected:
- `using-superpowers` routes to brainstorming;
- implementation blocked until design approval;
- native `local://<slug>/plan.md` and `progress.json` created;
- one runtime-valid task contract executes;
- selected proof evidence, task review, parent verification, and final review recorded;
- branch choice appears only after final approval.

- [ ] **Step 3: Run full pressure corpus**

Run: `node tests/omp/run-pressure-tests.mjs --omp /Users/speedzaza/Work/oh-my-pi/.worktrees/omp-dev/packages/coding-agent/src/cli.ts`

Expected: every research and development case passes with one terminal trace.

- [ ] **Step 4: Store results** at the two named `local://` paths, including prompt, invoked skills, task calls, hub messages, artifact paths, review status, commands, and final result.

#### Acceptance

- [ ] Research retains unrestricted native multi-agent fan-out without development ceremony.
- [ ] Development follows the approved design-to-final-branch workflow.
- [ ] Consequential peer coordination works in both modes without status spam.
- [ ] No required task remains running or unverified.
- Artifact: both named result JSON files and passing pressure-runner output.
- Escalate when: any mode leaks the other mode's instructions; identify injection source before changing prompts.
