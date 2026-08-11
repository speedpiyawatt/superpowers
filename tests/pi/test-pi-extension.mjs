import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const extensionPath = resolve(repoRoot, '.pi/extensions/superpowers.ts');

async function readPackageJson() {
  return JSON.parse(await readFile(packageJsonPath, 'utf8'));
}

test('package.json declares skills-only pi integration', async () => {
  const pkg = await readPackageJson();

  assert.equal(pkg.name, 'superpowers');
  assert.ok(pkg.keywords.includes('pi-package'));
  assert.deepEqual(pkg.pi, { skills: ['./skills'] });
  assert.equal(Object.hasOwn(pkg.pi, 'extensions'), false);
  assert.equal(pkg.pi.extensions, undefined);
});

test('unconditional pi extension bootstrap is absent', () => {
  assert.equal(existsSync(extensionPath), false);
});
