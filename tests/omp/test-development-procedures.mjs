import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');

async function readSkill(name) {
  return readFile(resolve(repoRoot, 'skills', name, 'SKILL.md'), 'utf8');
}

async function readRef(skill, file) {
  return readFile(resolve(repoRoot, 'skills', skill, file), 'utf8');
}

/** True when needle appears as an affirmative instruction, not only under a ban/do-not line. */
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
      /\b(never|do not|don't|must not|forbid|no longer|without|not a |not an |≠|no\b)/i.test(line)
    ) {
      return false;
    }
    if (/\b(never|do not|don't|must not|forbid)\b/i.test(line)) {
      const after = line.replace(/^.*?\b(never|do not|don't|must not|forbid)\b/i, '');
      if (re.test(after)) return false;
    }
    return true;
  });
}

test('bug/failure establishes root cause before fix', async () => {
  const text = await readSkill('systematic-debugging');

  assert.match(text, /root cause/i);
  assert.ok(
    hasAffirmative(text, /before (attempting )?fix|before (proposing|any) fix|no fixes without root cause/i),
    'must require root cause before fix',
  );
  assert.ok(!hasAffirmative(text, /progress\.json|workflow.?artifact|report.?gate|owns\b/i), 'no runtime workflow dialect');
});

test('TDD requires observed RED, minimum GREEN, behavior-focused lasting test', async () => {
  const text = await readSkill('test-driven-development');

  assert.match(text, /\bRED\b/);
  assert.match(text, /\bGREEN\b/);
  assert.ok(
    hasAffirmative(text, /fail(s|ing|ed)? for (the )?expected|watch(ed)? (it |the test )?fail|observed RED/i),
    'must require observed RED for expected reason',
  );
  assert.ok(
    hasAffirmative(text, /minimal|minimum (code|GREEN)|simplest code/i),
    'must require minimum GREEN',
  );
  assert.ok(
    hasAffirmative(text, /behavior|real (code|behavior)|not mocks/i),
    'must require behavior-focused tests',
  );
  assert.match(text, /proofMode|proof mode|tdd/i);
});

test('verification is fresh focused command/scenario without fake RED', async () => {
  const text = await readSkill('verification-before-completion');

  assert.ok(
    hasAffirmative(text, /fresh|focused (command|scenario|proof)|run the (verification |FULL )?command/i),
    'must require fresh focused verification',
  );
  assert.ok(
    /verification/i.test(text) &&
      (hasAffirmative(text, /no (fake|fabricated) RED|without .+ RED|not .+ RED ceremon/i) ||
        !hasAffirmative(text, /write (a )?failing test first|RED.?GREEN for every/i)),
    'verification must not require fake RED ceremony',
  );
  assert.match(text, /experiment/i);
  assert.ok(
    hasAffirmative(text, /artifact|decision rule|executed result/i),
    'experiment path needs executed result/artifact + decision rule',
  );
});

test('completion evidence supports actor claim; parent acceptance stays separate', async () => {
  const text = await readSkill('verification-before-completion');

  assert.ok(
    hasAffirmative(text, /evidence|verification command|fresh verification/i),
    'completion needs evidence',
  );
  assert.ok(
    hasAffirmative(text, /parent (acceptance|judg|verif)|does not (substitute|replace|equal) parent|parent remains|not parent acceptance/i) ||
      /parent acceptance/i.test(text),
    'parent acceptance must remain separate from actor claim',
  );
  assert.ok(!hasAffirmative(text, /acceptance matrix|report.?gate|persisted verdict/i), 'no runtime acceptance gate');
});

test('review intake verifies feedback; accepted bugs go through debugging', async () => {
  const text = await readSkill('receiving-code-review');

  assert.ok(
    hasAffirmative(text, /verif(y|ies|ication)|check against codebase|technically/i),
    'must verify feedback technically',
  );
  assert.ok(
    hasAffirmative(text, /systematic-debugging|root cause|debugging/i),
    'accepted bugs return through debugging',
  );
});

test('review request uses task/final/ad_hoc and recorded range, never HEAD~1', async () => {
  const skill = await readSkill('requesting-code-review');
  const template = await readRef('requesting-code-review', 'code-reviewer.md');
  const combined = `${skill}\n${template}`;

  assert.match(skill, /\btask\b/i);
  assert.match(skill, /\bfinal\b/i);
  assert.match(skill, /ad[_-]?hoc/i);
  assert.ok(
    hasAffirmative(combined, /recorded (base|range)|base\/current|BASE_SHA|base.*current/i),
    'must use recorded base/current range',
  );
  assert.ok(
    !hasAffirmative(combined, /HEAD~1/) && /HEAD~1/.test(combined) === false ||
      /never HEAD~1|not HEAD~1|do not .*HEAD~1|never .*HEAD~1/i.test(combined),
    'must never recommend HEAD~1 as range inference',
  );
  // Stronger: no bare HEAD~1 instruction
  assert.doesNotMatch(combined, /git rev-parse HEAD~1|BASE_SHA=\$\(git rev-parse HEAD~1\)/);
});

test('review vocabulary and critical/important re-review; notes may remain', async () => {
  const skill = await readSkill('requesting-code-review');
  const template = await readRef('requesting-code-review', 'code-reviewer.md');
  const combined = `${skill}\n${template}`;

  for (const term of ['approved', 'approved_with_notes', 'changes_required']) {
    assert.match(combined, new RegExp(term));
  }
  for (const sev of ['critical', 'important', 'note']) {
    assert.match(combined, new RegExp(`\\b${sev}\\b`, 'i'));
  }
  assert.ok(
    hasAffirmative(combined, /re-?review/i),
    'critical/important fixes need re-review',
  );
  assert.ok(
    /notes? may remain|note(s)? (findings? )?may|minor|note.*remain/i.test(combined),
    'notes may remain without blocking',
  );
  assert.doesNotMatch(combined, /\bReady to merge\b/);
  assert.doesNotMatch(combined, /#### Minor \(Nice to Have\)/);
});

test('branch finishing only after parent verification and required final approval', async () => {
  const text = await readSkill('finishing-a-development-branch');

  assert.match(text, /merge/i);
  assert.match(text, /PR|pull request/i);
  assert.match(text, /keep|discard|cleanup/i);
  assert.ok(
    hasAffirmative(text, /parent verification|parent (integration )?verif/i),
    'requires parent verification before options',
  );
  assert.ok(
    hasAffirmative(text, /final (review|approval)|required final/i),
    'requires final review/approval before branch choice',
  );
  assert.ok(
    !hasAffirmative(text, /using-git-worktrees/) || /do not|don't|not use/i.test(text),
    'no worktree controller as primary flow',
  );
});
