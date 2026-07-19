---
name: dispatching-parallel-agents
description: Use when two or more tasks can run independently without shared files, mutable resources, or upstream results
---

# Dispatching Parallel Agents

## Overview

Use **fan-out**: prove slices independent, dispatch them in one native `task`
batch, then integrate their evidence. Parallelism is valid only while ownership
and dependencies remain disjoint.

## Process

### 1. Prove independence

Name each slice's inputs, outputs, owned paths, mutable resources, and required
upstream results. Group related work into one slice.

**Complete when:** every pair of slices has disjoint write ownership and mutable
resources, and no slice needs another slice's result. Read-only slices may share
inputs.

### 2. Choose one agent per slice

| Slice | Agent |
|---|---|
| Read-only investigation | `scout` |
| Locked local transformation with exact proof | `dumb-worker` |
| Integration, debugging, concurrency, or judgment | `worker` |

Choose these roles from native `task`'s Available Agents list, using names not
marked `BLOCKING` for fan-out. Parent owns shared contracts and final verification.

**Complete when:** every slice has the narrowest capable agent and one writer
owns each path.

### 3. Build one native batch

Shared context has exactly:

```text
# Goal
# Constraints
# Contract
```

Each task has exactly:

```text
# Target
Exact cwd/worktree, files, symbols, ownership, and non-goals.

# Change
One cohesive outcome with ordered behavior or interface changes.

# Acceptance
Proof mode: tdd | verification | experiment.
Observable checks, required evidence, and escalation conditions.
```

Dispatch all slices in one `task` call:

```json
{
  "context": "# Goal\n...\n# Constraints\n...\n# Contract\n...",
  "tasks": [
    {
      "name": "AuthFailure",
      "agent": "worker",
      "task": "# Target\n...\n# Change\n...\n# Acceptance\n..."
    },
    {
      "name": "CacheFailure",
      "agent": "worker",
      "task": "# Target\n...\n# Change\n...\n# Acceptance\n..."
    }
  ]
}
```

**Complete when:** one valid batch contains every independent slice once.

### 4. Continue and coordinate

Native `task` starts non-blocking agents as background jobs. Continue independent
parent work. Use `hub` for ownership or contract decisions; wait only when no
independent parent work remains.

New overlap or dependency collapses affected slices back into sequential work.

**Complete when:** every child has yielded a terminal structured result.

### 5. Integrate evidence

For each slice:

1. Map every Acceptance item to observed evidence.
2. Confirm edits stayed inside owned paths.
3. Resolve failed, `not_run`, blocked, and cannot-verify items.
4. Run the smallest combined check proving slices coexist.

Run formatter, type checks, and project-wide suites once after writer fan-in.

**Complete when:** all Acceptance items pass, no ownership conflict remains,
combined behavior is verified, and no required child is still running.

