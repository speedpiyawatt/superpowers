# Skill authoring best practices

**Load this reference when:** you need discovery, concision, or degrees-of-freedom patterns beyond SKILL.md.

## Concise is key

Only add what the agent does not already know. Challenge each paragraph for token cost once SKILL.md is loaded.

## Degrees of freedom

- **High freedom** — heuristics when many approaches work  
- **Medium** — preferred pattern plus escape hatches  
- **Low freedom** — exact sequence for fragile/safety-critical work  

Match freedom to failure cost.

## Discovery

- Description: "Use when…" + triggers/symptoms; no process summary  
- Keywords agents would search (errors, symptoms, tool names)  
- Name by action or core insight  

## Structure

SKILL.md = overview + procedure + completion. Heavy API/syntax → separate reference with an exact load condition. One excellent example beats many mediocre ones.

## Progressive disclosure

Metadata always; SKILL.md on match; references only when their load condition hits.
