---
name: dispatching-parallel-agents
description: Use when two or more tasks can run independently without shared files, mutable resources, or upstream results
---

# Dispatching Parallel Agents

Fan out only when slices are truly independent. One native `task` batch per independent wave; integrate evidence after.

## Process

### 1. Prove independence

Name each slice's inputs, outputs, writable paths, mutable resources, and upstream needs.

**Complete when:** every pair has disjoint write ownership and mutable resources, and no slice needs another's result. Read-only slices may share inputs.

### 2. One agent per slice

Pick the narrowest capable agent from native `task`'s Available Agents. Parent keeps shared contracts and final verification.

### 3. One batch per wave

Shared context:

```text
# Goal
# Constraints
# Contract
```

Each task:

```text
# Target
# Change
# Acceptance
```

Dispatch every independent slice in **one** `task` call. Do not drip-feed the same wave.

### 4. Sequence when needed

Overlap, shared mutable state, or a real dependency collapses those slices to sequential work. Never parallelize writers on the same path.

### 5. Coordinate sparsely

Native `task` already returns terminal results. Use `hub` only for consequential coordination — ownership conflict, contract change, dependency result that changes active work, or a parent decision. No status spam.

### 6. Integrate

For each slice, map Acceptance to observed evidence, confirm path ownership, resolve failed/blocked/needs_context items, then run the smallest combined check. Package-wide format/type/tests run once after writer fan-in.
