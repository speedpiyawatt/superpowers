---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment
---

# Writing Skills

Write discoverable, checkable skills. One leading concept per skill. Test only what you change.

## Hierarchy

1. **SKILL.md** — overview, when to use, core procedure, completion criteria, stop/out-of-scope  
2. **References** — heavy detail only behind a precise context pointer (`Load this reference when: …`)  
3. **Tools/scripts** — executable helpers, not narrative dumps  

Progressive disclosure: agents load SKILL.md first; open a reference only when its load condition matches.

## Invocation class

| Class | Description field |
|-------|-------------------|
| **Model-invoked** | Third person, starts with "Use when…", triggers/symptoms only — **no workflow summary** |
| **User-invoked** | Same discovery hygiene; still precise triggers so explicit `/skill:name` stays meaningful |

Description = when to load, never a condensed process agents can follow instead of the body.

## Authoring steps

1. **Classify** the skill (discipline / technique / pattern / reference) and invocation class.  
2. **Name** with letters, numbers, hyphens; verb-first when possible.  
3. **Draft SKILL.md** with:  
   - Core principle (one leading concept)  
   - When / when not  
   - Ordered procedure  
   - **Checkable completion** criteria (observable done-state)  
   - Stop / out of scope  
4. **Split references** only when content is heavy or rarely needed; each file starts with or is linked via **Load this reference when:**  
5. **Prune** (required on every edit):  
   - No-op or duplicate other skills?  
   - Sediment (dead examples, stale tool names, obsolete paths)?  
   - Sprawl (second concept that should be its own skill)?  
   - Negative steering that fights a recipe (prefer positive contracts for shape problems)?  
6. **Pressure-test changed routes only** — baseline without the new guidance, then with it. No exhaustive per-skill pressure corpus.  
   - Changed description/routing → trigger vs non-trigger cases  
   - Changed handoff/completion → one scenario that fails if the criterion is missing  

## Completion criteria (this skill)

Done when:

- [ ] Description is invocation-accurate and trigger-only  
- [ ] Every branch of the procedure has a checkable completion signal  
- [ ] References (if any) have exact load conditions  
- [ ] Prune pass removed sediment/duplication  
- [ ] Pressure evidence exists for **changed** routing, handoff, hierarchy, or completion behavior  

## References

- Load `anthropic-best-practices.md` when: you need official-style discovery, concision, or degrees-of-freedom patterns beyond this SKILL.md.  
- Load `persuasion-principles.md` when: hardening a discipline skill against rationalization (authority, commitment, etc.).  
- Load `testing-skills-with-subagents.md` when: designing pressure scenarios or baseline/GREEN skill tests for a changed route.  
- Load `graphviz-conventions.dot` when: editing flowcharts in Graphviz.  
- Use `render-graphs.js` only when: you must render skill flowcharts to SVG for a human.

## Do not

- Require one pressure case per active skill or an exhaustive corpus  
- Summarize workflow inside `description`  
- Keep dead examples (e.g. obsolete CLAUDE.md testing campaigns)  
- Bundle unrelated controllers into a skill  

## Out of scope

- Rewriting unrelated skills in the same edit without need  
- Runtime enforcement of skill compliance  
