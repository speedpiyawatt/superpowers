import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const routerPath = resolve(repoRoot, 'skills/using-superpowers/SKILL.md');
const referencesDir = resolve(repoRoot, 'skills/using-superpowers/references');

async function readRouter() {
  return readFile(routerPath, 'utf8');
}

function frontmatterDescription(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, 'router frontmatter missing');
  const desc = match[1].match(/^description:\s*(.+)$/m);
  assert.ok(desc, 'router description missing');
  return desc[1].replace(/^["']|["']$/g, '');
}

test('using-superpowers is development-only router, not global bootstrap', async () => {
  const text = await readRouter();
  const description = frontmatterDescription(text).toLowerCase();

  assert.match(description, /development|code change|bug|review|completion|skill/);
  assert.doesNotMatch(description, /starting any conversation/);
  assert.doesNotMatch(text, /Platform Adaptation/i);
  assert.doesNotMatch(text, /references\/(pi|codex|antigravity)-tools/);
  assert.equal(existsSync(referencesDir), false);
});

test('router positive cases enter development skills', async () => {
  const text = await readRouter();

  const positive = [
    ['code change', /brainstorming/i],
    ['bug', /systematic-debugging/i],
    ['review feedback', /receiving-code-review/i],
    ['completion claim', /verification-before-completion/i],
    ['branch finish', /finishing-a-development-branch/i],
    ['skill edit', /writing-skills/i],
    ['explicit', /explicit/i],
  ];

  for (const [label, pattern] of positive) {
    assert.match(text, pattern, `missing positive route for ${label}`);
  }

  assert.match(text, /verification-before-completion/);
});

test('router negative cases stay outside development ceremony', async () => {
  const text = await readRouter();
  const lower = text.toLowerCase();

  for (const label of ['research', 'explanation', 'source gathering', 'read-only fan-out', 'fan-out']) {
    assert.ok(
      lower.includes(label) || lower.includes(label.replace('-', ' ')) || lower.includes('read-only'),
      `router should name non-trigger: ${label}`,
    );
  }

  assert.match(text, /do not|does not|outside|unless .+ explicit/i);
});
