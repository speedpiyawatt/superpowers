import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const writingSkillsDir = resolve(repoRoot, 'skills/writing-skills');

async function readWritingSkill() {
  return readFile(resolve(writingSkillsDir, 'SKILL.md'), 'utf8');
}

function hasAffirmative(text, pattern) {
  const re = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
  const lines = text.split('\n');
  let bannedSection = false;
  return lines.some((line) => {
    if (/^#{1,6}\s+/.test(line)) {
      bannedSection = /out of scope|do not|don'?t|never|forbidden|stop\b/i.test(line);
    }
    if (!re.test(line)) return false;
    if (bannedSection) return false;
    if (
      /^\s*[-*]\s*/.test(line) &&
      /\b(never|do not|don't|must not|forbid|no longer|without|no exhaustive|not a |not an |≠|no\b)/i.test(line)
    ) {
      return false;
    }
    if (/\b(never|do not|don't|must not|forbid|no exhaustive)\b/i.test(line)) {
      const after = line.replace(/^.*?\b(never|do not|don't|must not|forbid|no exhaustive)\b/i, '');
      if (re.test(after) && !re.test(line.slice(0, 20))) return false;
    }
    // Explicit negation of the matched idea on the same line
    if (/\bno exhaustive\b|\bnot\b.{0,40}exhaustive|without exhaustive/i.test(line) && /exhaustive/i.test(re.source)) {
      return false;
    }
    return true;
  });
}

test('skill authoring covers invocation class, context pointer, completion, pruning, pressure', async () => {
  const text = await readWritingSkill();

  assert.ok(
    hasAffirmative(text, /model-invoked|user-invoked|invocation class|description.*trigger/i) ||
      (/description/i.test(text) && /Use when/i.test(text)),
    'invocation class / description triggers required',
  );
  assert.ok(
    hasAffirmative(text, /heavy reference|separate files|link to file|supporting files only/i),
    'references split from SKILL.md with load conditions',
  );
  assert.ok(
    hasAffirmative(text, /completion (criteria|criterion)|checkable completion|done when|success criteria/i),
    'checkable completion criteria',
  );
  assert.ok(
    hasAffirmative(text, /eliminate redundancy|prun(e|ing)|no-op|duplicat|sediment|sprawl|delete .*dead|remove .*obsolete/i),
    'pruning rules required',
  );
  assert.ok(
    hasAffirmative(text, /pressure (test|scenario)|changed.?route|routing.*test|baseline.*fail/i),
    'changed-route / pressure test required',
  );
});

test('authoring self-applies hierarchy without exhaustive per-skill pressure corpus', async () => {
  const text = await readWritingSkill();

  assert.ok(
    hasAffirmative(text, /main reference|directory structure|SKILL\.md Structure|heavy reference/i),
    'hierarchy / progressive disclosure',
  );
  assert.ok(
    !hasAffirmative(text, /one pressure case per (active )?skill|every skill must have \d+ pressure|exhaustive pressure/i),
    'no exhaustive pressure corpus mandate',
  );
  assert.ok(
    hasAffirmative(text, /micro-?test|no-guidance control|fresh-context|5\+ reps/i),
    'wording micro-tested before full pressure scenarios',
  );
});

test('obsolete CLAUDE_MD_TESTING example is deleted', async () => {
  assert.equal(
    existsSync(resolve(writingSkillsDir, 'examples/CLAUDE_MD_TESTING.md')),
    false,
  );
});

test('retained writing-skills references declare load conditions or are dropped', async () => {
  const text = await readWritingSkill();
  const entries = await readdir(writingSkillsDir, { withFileTypes: true });
  const refs = entries
    .filter((e) => e.isFile() && e.name !== 'SKILL.md' && !e.name.startsWith('.'))
    .map((e) => e.name);

  // Primary skill must not dump full external corpus inline as controller ceremony
  assert.ok(text.length < 30_000, 'SKILL.md stays bounded');

  for (const ref of refs) {
    if (['render-graphs.js', 'graphviz-conventions.dot'].includes(ref)) {
      // tooling helpers — only OK if primary skill points with a load/use condition
      if (text.includes(ref)) {
        assert.match(
          text,
          new RegExp(`${ref.replace('.', '\\.')}[\\s\\S]{0,120}(when|only|if|for|to)|Load .+ when[\\s\\S]{0,80}${ref.replace('.', '\\.')}|\\b(see|use)\\b[\\s\\S]{0,80}${ref.replace('.', '\\.')}`, 'i'),
          `${ref} needs an exact load/use condition`,
        );
      }
      continue;
    }
    if (text.includes(ref) || text.includes(ref.replace(/\.md$/, ''))) {
      const loadOk =
        new RegExp(`Load this reference when|load .+${ref.replace('.', '\\.')}|${ref.replace('.', '\\.')}.{0,80}(when|for|to)|\\b(see|use)\\b\\s+${ref.replace('.', '\\.')}`, 'i').test(text) ||
        new RegExp(`\\]\\(${ref}\\)|\\]\\(\\.?/?${ref}\\)`, 'i').test(text);
      assert.ok(loadOk, `reference ${ref} must be linked with a load condition`);
    }
  }

  // Dead example sediment gone
  assert.doesNotMatch(text, /CLAUDE_MD_TESTING/);
  assert.ok(!existsSync(resolve(writingSkillsDir, 'examples/CLAUDE_MD_TESTING.md')));
});
