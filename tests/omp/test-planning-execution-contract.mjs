import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');

async function readSkill(name) {
  return readFile(resolve(repoRoot, 'skills', name, 'SKILL.md'), 'utf8');
}

/** True when needle appears as an affirmative instruction, not only under a ban/do-not line. */
function hasAffirmative(text, pattern) {
  const re = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
  const lines = text.split('\n');
  return lines.some((line) => {
    if (!re.test(line)) return false;
    return !/\b(do not|don't|never|removed|no longer|without|not emit|not offer|ban|avoid|out of scope|no second|restore)\b/i.test(line);
  });
}

test('brainstorming keeps approval gate and written design without implementation control', async () => {
  const text = await readSkill('brainstorming');

  assert.match(text, /approv/i);
  assert.match(text, /local:\/\/.*design\.md|design\.md/);
  assert.match(text, /self-review/i);
  assert.match(text, /writing-plans/);
  assert.ok(!hasAffirmative(text, /git commit/), 'no affirmative commit instruction');
  assert.ok(!hasAffirmative(text, /using-git-worktrees/), 'no worktree controller');
  assert.ok(!hasAffirmative(text, /\bimplement\b.*\bcode\b|\bwrite code\b/), 'no implementation action');
  assert.equal(existsSync(resolve(repoRoot, 'skills/brainstorming/spec-document-reviewer-prompt.md')), false);
});

test('writing-plans emits Target Change Acceptance without Owns or executing-plans choice', async () => {
  const text = await readSkill('writing-plans');

  assert.match(text, /#### Target|\*\*Target\*\*|# Target/);
  assert.match(text, /#### Change|\*\*Change\*\*|# Change/);
  assert.match(text, /Acceptance/);
  assert.match(text, /Depends on|dependenc/i);
  assert.match(text, /Escalate when|escalat/i);
  assert.match(text, /local:\/\/.*plan\.md|plan\.md/);
  assert.ok(!hasAffirmative(text, /\bOwns\b/), 'no Owns metadata requirement');
  assert.ok(!hasAffirmative(text, /acceptance matrix/), 'no runtime acceptance matrix');
  assert.ok(!hasAffirmative(text, /executing-plans/), 'no executing-plans handoff');
  assert.equal(existsSync(resolve(repoRoot, 'skills/writing-plans/plan-document-reviewer-prompt.md')), false);
  assert.equal(existsSync(resolve(repoRoot, 'skills/executing-plans')), false);
});

test('writing-plans previews exact plan HTML before approval and stays non-blocking', async () => {
  const text = await readSkill('writing-plans');
  const handoffIdx = text.search(/^## Handoff\b/m);
  assert.ok(handoffIdx >= 0, 'Handoff section exists');
  const previewHeadingIdx = text.search(/^## Plan preview\b/m);
  assert.ok(previewHeadingIdx >= 0, 'Plan preview section exists');
  assert.ok(previewHeadingIdx < handoffIdx, 'Plan preview section before Handoff');
  const previewSection = text.slice(previewHeadingIdx, handoffIdx);

  assert.match(previewSection, /preview_export/);
  assert.match(previewSection, /format:\s*"html"|["']format["']:\s*["']html["']/);
  assert.match(previewSection, /source:\s*"markdown"|["']source["']:\s*["']markdown["']/);
  assert.match(previewSection, /open:\s*true|["']open["']:\s*true/);
  assert.match(previewSection, /re-?read|exact saved|exact .*plan/i);
  assert.ok(
    /"markdown"\s*:/.test(previewSection) || /exact saved plan content/i.test(previewSection),
    'passes exact saved Markdown content, not only a path',
  );
  assert.ok(
    !hasAffirmative(previewSection, /local:\/\/.*preview_export|preview_export.*local:\/\//),
    'does not send local:// path to preview_export',
  );


  assert.match(previewSection, /warn|warning/i);
  assert.match(previewSection, /unavailab|fail/i);
  assert.ok(
    /never block|do not block|non-blocking|continue to approval/i.test(previewSection),
    'preview failure must not block approval',
  );
});

test('writing-plans keeps planning in the root and submits through root proposal UI', async () => {
  const text = await readSkill('writing-plans');

  const workflowIdx = text.search(/^## Root planning workflow\b/m);
  assert.ok(workflowIdx >= 0, 'Root planning workflow section exists');

  const fileMapIdx = text.search(/^## File map first\b/m);
  assert.ok(fileMapIdx >= 0, 'File map first section exists');
  assert.ok(workflowIdx < fileMapIdx, 'root workflow precedes plan format');

  const workflowEnd = Math.min(
    ...[fileMapIdx, text.search(/^## Scope\b/m), text.search(/^## Task shape\b/m)].filter((idx) => idx > workflowIdx),
  );
  const workflow = text.slice(workflowIdx, workflowEnd);

  assert.match(workflow, /root (?:session )?(?:researches|writes|drafts)/i);
  assert.match(workflow, /self-review/i);
  assert.match(workflow, /local:\/\/<slug>\/plan\.md/);
  assert.ok(!hasAffirmative(workflow, /\bplanner\b|agent:\s*["']planner["']|native `task`|planner child/i), 'no planning child');
  assert.ok(
    !hasAffirmative(workflow, /(?:^|\s)\/plan(?:\s|$)|xd:\/\/plan|switch model|switch.*tools|restrict tools/i),
    'no plan-mode route',
  );
  assert.ok(!hasAffirmative(workflow, /implement code|implement before approval/i), 'no pre-approval implementation');

  const handoffIdx = text.search(/^## Handoff\b/m);
  assert.ok(handoffIdx >= 0, 'Handoff section exists');
  assert.ok(handoffIdx > workflowIdx, 'handoff follows root workflow');
  assert.match(text.slice(handoffIdx), /xd:\/\/propose/);
  assert.match(text.slice(handoffIdx), /same.*slug|same.*artifact/i);
});

test('writing-plans proposal handoff does not offer plan mode or auto-approval', async () => {
  const text = await readSkill('writing-plans');

  assert.ok(!hasAffirmative(text, /enter plan mode|xd:\/\/plan/), 'no plan-mode entry');
  assert.ok(!hasAffirmative(text, /auto-?approv|automatically approv|skip approval/), 'no auto-approval');
  assert.match(text, /preview_export/);
  assert.match(text, /xd:\/\/propose/);
});

test('SDD uses native task and local plan handoff only', async () => {
  const text = await readSkill('subagent-driven-development');

  assert.match(text, /native `task`|\btask\b/);
  assert.match(text, /local:\/\//);
  assert.match(text, /parent/i);
  assert.match(text, /review/i);
  assert.match(text, /integrat/i);
  assert.ok(!hasAffirmative(text, /task-brief/), 'no task-brief controller');
  assert.ok(!hasAffirmative(text, /sdd-workspace/), 'no sdd-workspace controller');
  assert.ok(!hasAffirmative(text, /review-package/), 'no review-package controller');
  assert.ok(!hasAffirmative(text, /implementer-prompt/), 'no implementer prompt template');
  assert.ok(!hasAffirmative(text, /task-reviewer-prompt/), 'no task-reviewer prompt template');
  assert.ok(!hasAffirmative(text, /\.superpowers\/sdd/), 'no .superpowers/sdd state store');
  assert.ok(!hasAffirmative(text, /executing-plans/), 'no executing-plans path');
  assert.ok(!hasAffirmative(text, /using-git-worktrees/), 'no worktree skill path');
  assert.equal(existsSync(resolve(repoRoot, 'skills/subagent-driven-development/implementer-prompt.md')), false);
  assert.equal(existsSync(resolve(repoRoot, 'skills/subagent-driven-development/task-reviewer-prompt.md')), false);
  assert.equal(existsSync(resolve(repoRoot, 'skills/subagent-driven-development/scripts')), false);
});

test('parallel dispatch is one independent wave with sequential overlap and sparse hub', async () => {
  const text = await readSkill('dispatching-parallel-agents');

  assert.match(text, /one .*batch|single batch|one batch/i);
  assert.match(text, /independent/i);
  assert.match(text, /overlap|dependenc|sequential/i);
  assert.match(text, /\bhub\b/i);
  assert.match(text, /consequential|decision|ownership|contract/i);
});

test('duplicate controllers and SDD scripts are removed from the package tree', async () => {
  assert.equal(existsSync(resolve(repoRoot, 'skills/executing-plans')), false);
  assert.equal(existsSync(resolve(repoRoot, 'skills/using-git-worktrees')), false);
  assert.equal(existsSync(resolve(repoRoot, 'skills/using-superpowers/references')), false);
  assert.equal(existsSync(resolve(repoRoot, '.pi/extensions/superpowers.ts')), false);

  const deletedClaudeTests = [
    'test-sdd-workspace.sh',
    'test-task-brief.sh',
    'test-worktree-native-preference.sh',
    'test-worktree-path-policy.sh',
    'test-subagent-driven-development.sh',
    'test-subagent-driven-development-integration.sh',
  ];
  for (const name of deletedClaudeTests) {
    assert.equal(existsSync(resolve(repoRoot, 'tests/claude-code', name)), false, name);
  }

  const skills = await readdir(resolve(repoRoot, 'skills'));
  assert.ok(!skills.includes('executing-plans'));
  assert.ok(!skills.includes('using-git-worktrees'));
});
