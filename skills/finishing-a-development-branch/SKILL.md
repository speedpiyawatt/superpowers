---
name: finishing-a-development-branch
description: Use when implementation is complete and you need to choose merge, PR, keep, discard, or cleanup — only after parent verification and required final approval
---

# Finishing a Development Branch

Present integration options only when the work is actually ready. No merge/PR/discard theater before gates pass.

## Gates (both required)

Before offering options:

1. **Parent verification** — parent has run integration verification and accepts the evidence (actor focused proof is not enough alone).
2. **Required final approval** — final review on the recorded full range is `approved` or `approved_with_notes` when final review was required. If final review still `changes_required`, stop and fix.

If either gate fails, do not present branch options.

## Options

After both gates:

1. **Merge** locally into the base branch  
2. **PR** — push and open a pull request  
3. **Keep** branch as-is  
4. **Discard** — requires typed confirmation `discard`  
5. **Cleanup** — remove worktree/branch only when this session owns that cleanup and the chosen option allows it  

Detached HEAD / externally managed workspaces: omit merge if unsafe; never delete a worktree you did not create.

## Execute choice

- Merge: merge to base, re-run a quick verification on the result, then cleanup only if owned  
- PR: push; keep worktree for feedback  
- Keep: report path/branch; no cleanup  
- Discard: confirm, then delete owned branch/worktree only  
- Cleanup: provenance check — only `.worktrees/` / `worktrees/` paths you created, from main repo root  

## Do not

- Offer options before parent verification and required final approval  
- Force-push unless explicitly requested  
- Remove harness-owned workspaces  
- Drive cleanup via a separate worktree controller skill  

## Out of scope

- Replacing parent integration judgment  
- Runtime workflow artifacts or persisted finish state  
- Inventing final-review ranges with `HEAD~1`
