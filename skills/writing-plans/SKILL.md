---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** If working in an isolated worktree, it should have been created via the `superpowers:using-git-worktrees` skill at execution time.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- (User preferences for plan location override this default)

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Task Right-Sizing

A task owns one cohesive outcome and one acceptance cycle. Split when
independent interfaces, proof cycles, or ownership boundaries exist, or when a
reviewer could approve one part while rejecting another. Do not split tightly
coupled edits merely to reduce file count.

Every task declares:

- **Executor:** `parent | dumb-worker | worker`
- **Leaf class:** `parent | mechanical | integration`
- **Proof mode:** `tdd | verification | experiment`

Use `parent` for unresolved product/API/architecture decisions and shared
foundations. Use `dumb-worker` only when decisions and code shape are locked,
the task touches at most two production files, and one named RED/GREEN cycle
proves the result. Use `worker` for coupled or judgment-heavy implementation
after decisions are locked. Parallel writers never overlap paths.

## Bite-Sized Task Granularity

Within a task, each checkbox is one concrete action: write RED, observe the
expected failure, implement minimum Change, run GREEN, then commit. Setup,
configuration, and documentation stay with the behavior that needs them.

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

## Global Constraints

[The spec's project-wide requirements — version floors, dependency limits,
naming and copy rules, platform requirements — one line each, with exact
values copied verbatim from the spec. Every task's requirements implicitly
include this section.]

---
```

## Task Structure

````markdown
### Task N: [Cohesive outcome]

**Executor:** `parent | dumb-worker | worker`
**Leaf class:** `parent | mechanical | integration`
**Proof mode:** `tdd | verification | experiment`

#### Target

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Interfaces:**
- Consumes: [exact signatures from earlier tasks]
- Produces: [exact signatures later tasks consume]

**Ownership:** [paths/symbols this writer owns]
**Non-goals:** [explicit exclusions]

#### Change

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run RED**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with `function not defined`, proving the named behavior is absent.

- [ ] **Step 3: Write minimum implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run GREEN**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS with the named assertions.

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```

#### Acceptance

- [ ] [Observable behavior and exact proof]
- RED: [command and expected failing assertion/error for `tdd`]
- GREEN: [command and expected assertions for `tdd`/`verification`]
- Artifact: [path/result contract for `experiment`]
- Escalate when: [missing decision, ownership conflict, or environment blocker]
````

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — the engineer may be reading tasks out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Remember
- Exact file paths always
- Complete code in every step — if a step changes code, show the code
- Exact commands with expected output
- DRY, YAGNI, TDD, frequent commits

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it. This is a checklist you run yourself — not a subagent dispatch.

**1. Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.

**2. Placeholder scan:** Search your plan for red flags — any of the patterns from the "No Placeholders" section above. Fix them.

**3. Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.

**4. Change-to-Acceptance mapping:** Every Change item has observable evidence in Acceptance.

**5. Leaf honesty:** Mechanical tasks require no inference, include complete code shape, and have one focused RED/GREEN cycle.

**6. Task cohesion:** Split independent interfaces, proof cycles, or ownership boundaries; keep tightly coupled edits together.

**7. Writer isolation:** Parallel tasks do not own overlapping files, and shared contracts precede dependent leaves.

If you find issues, fix them inline. No need to re-review — just fix and move on. If you find a spec requirement with no task, add the task.

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/superpowers/plans/<filename>.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?"**

**If Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Fresh subagent per task + two-stage review

**If Inline Execution chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:executing-plans
- Batch execution with checkpoints for review
