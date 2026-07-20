import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const agentRoot = '/Users/speedzaza/.omp/agent';
const pluginRoot = '/Users/speedzaza/.omp/plugins';
const passingSuperpowersCommit = '3115b9a51b17e3351c61e874beebdf1b94aa37af';

const preservedFiles = {
  'APPEND_SYSTEM.md': '2df5299bc8dd454bd639ef6ce3accf1f84f4c87fbbbe18dc422db9b74387b022',
  'rules/no-cross-agent-local-url.md': '5da0c2516380d204af7a31c19fd739fc23507908d785751b8ce653715b3d7c3f',
  'rules/no-unbounded-filesystem-search.md': 'ffba425c7b3bfb61a71223964edbe8f1f5bbd8a4f7d3d6e0cfda838986df46e6',
  'rules/no-head-without-dash.md': 'a24d5aac9b8950f4b44c03c479c7055cd0e8deb8b1d55557511233cd5106230f',
  'rules/no-mixed-path-world.md': '04b425bd9c35cf9324467fa2747d97918a7772613975f62ca318e9a935f31562',
  'rules/no-ssh-quote-tower.md': 'e360bbd23e178a0016dd2c7cc6da4681b186e512bbfe975768d225d6ea87f38a',
  'rules/no-windows-percent-env-over-ssh.md': 'ea4c958bca8a6a59680080006f9805c76ebd1662de8d74b984c763d57bbc8040',
  'agents/delegate.md': '166a61cc5083665ebe0e9c002d3f8ac60cdcdb8c89ae809303ad644909b38934',
  'agents/delegate-blocking.md': 'f2e6682b300b6b6809c3af0036321d465cf0f3b76ed79266aba1c178e5fc0534',
  'agents/oracle.md': '16be00c11d6d5c522c676beda7d443d06776e89a52d85de553ae2370964b94d6',
  'agents/oracle-blocking.md': 'bea1940ab0493faf575c8be5272861af3182a5996f6c6ab73be6633742cc9389',
  'agents/context-builder.md': 'd58b1e296a243eb88b97f92a7d2da7a4d6a974296c265edd6e6c3f4f35485b89',
  'agents/context-builder-blocking.md': '74073874f59d59b9c3fa3401b234698e50f425ef7125e8a06c23f1de5e132e07',
};

const enabledAgents = [
  'scout',
  'scout-blocking',
  'planner',
  'planner-blocking',
  'reviewer',
  'reviewer-blocking',
  'dumb-worker',
  'dumb-worker-blocking',
  'worker',
  'worker-blocking',
  'researcher',
  'researcher-blocking',
];

const expectedTools = {
  scout: ['read', 'grep', 'glob', 'task', 'hub'],
  'scout-blocking': ['read', 'grep', 'glob', 'task', 'hub'],
  planner: ['read', 'grep', 'glob', 'write', 'task', 'hub'],
  'planner-blocking': ['read', 'grep', 'glob', 'write', 'task', 'hub'],
  reviewer: ['read', 'grep', 'glob', 'bash', 'task', 'hub'],
  'reviewer-blocking': ['read', 'grep', 'glob', 'bash', 'task', 'hub'],
  'dumb-worker': ['read', 'grep', 'glob', 'bash', 'edit', 'write', 'task', 'hub'],
  'dumb-worker-blocking': ['read', 'grep', 'glob', 'bash', 'edit', 'write', 'task', 'hub'],
  worker: ['read', 'grep', 'glob', 'bash', 'edit', 'write', 'task', 'hub'],
  'worker-blocking': ['read', 'grep', 'glob', 'bash', 'edit', 'write', 'task', 'hub'],
  researcher: ['read', 'web_search', 'task', 'hub'],
  'researcher-blocking': ['read', 'web_search', 'task', 'hub'],
};

const workerAgents = new Set(['dumb-worker', 'dumb-worker-blocking', 'worker', 'worker-blocking']);
const readOnlyAgents = new Set([
  'scout',
  'scout-blocking',
  'researcher',
  'researcher-blocking',
  'reviewer',
  'reviewer-blocking',
]);

async function readText(path) {
  return readFile(path, 'utf8');
}

function frontmatter(text, path) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, `frontmatter missing: ${path}`);
  return match[1];
}

function parseTools(frontmatterText, path) {
  const match = frontmatterText.match(/^tools:\s*(.+)$/m);
  assert.ok(match, `tools missing: ${path}`);
  return match[1]
    .trim()
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
}

async function sha256(path) {
  return createHash('sha256').update(await readText(path)).digest('hex');
}

test('global policy is universal and preserves user writing style', async () => {
  const text = await readText(`${agentRoot}/AGENTS.md`);
  const writingStyle = text.slice(text.indexOf('# Writing style'));

  assert.match(text, /Grounding/);
  assert.match(text, /native `task`/);
  assert.match(text, /`hub`/);
  assert.match(text, /Available Agents/);
  assert.match(text, /local:\/\//);
  assert.match(text, /read-only/);
  assert.doesNotMatch(text, /proof mode|RED\/GREEN|reviewer gate|branch lifecycle|static agent table|job\/irc|intercom|contact_supervisor/i);
  assert.equal(createHash('sha256').update(writingStyle).digest('hex'), '4a8b5c4f70927a1633f4a87d4cae958df3ee07229c947d10c0ca64830d18b46a');
});

test('enabled agents use native tools and small result contracts', async () => {
  for (const name of enabledAgents) {
    const path = `${agentRoot}/agents/${name}.md`;
    const text = await readText(path);
    const metadata = frontmatter(text, path);
    assert.deepEqual(parseTools(metadata, path), expectedTools[name], `${name} tools`);
    assert.doesNotMatch(metadata, /intercom|contact_supervisor|defaultProgress|output:\s*\S+\.md/i, `${name} stale fields`);
    assert.doesNotMatch(metadata, /\bfind\b|\bls\b/, `${name} legacy tool name`);
    assert.match(metadata, /task/);
    assert.match(metadata, /hub/);

    if (readOnlyAgents.has(name)) {
      assert.ok(!expectedTools[name].includes('edit'), `${name} must not edit`);
      assert.ok(!expectedTools[name].includes('write'), `${name} must not write`);
    }

    if (workerAgents.has(name)) {
      assert.ok(expectedTools[name].includes('edit'), `${name} needs edit`);
      assert.ok(expectedTools[name].includes('write'), `${name} needs write`);
      assert.match(metadata, /status:/);
      assert.match(metadata, /done, blocked, needs_context/);
      assert.match(metadata, /summary:/);
      assert.match(metadata, /changed_files:/);
      assert.match(metadata, /optionalProperties:/);
      assert.doesNotMatch(metadata, /acceptance:|owns:|done_with_concerns|report-gate/i);
    }

    if (name.startsWith('reviewer')) {
      assert.match(metadata, /approved, approved_with_notes, changes_required/);
      assert.match(metadata, /critical:/);
      assert.match(metadata, /important:/);
      assert.match(metadata, /notes:/);
      assert.match(metadata, /cannot_verify:/);
      assert.doesNotMatch(metadata, /acceptance:|owns:|report-gate|Ready to merge|Minor/i);
      // prose must require cannot_verify; optional wording is a contract break
      assert.match(text, /`cannot_verify` array/);
      assert.doesNotMatch(text, /optional `cannot_verify`/);
    }
  }
});

test('disabled agents and preserved user settings are unchanged', async () => {
  for (const [relativePath, expected] of Object.entries(preservedFiles)) {
    const path = `${agentRoot}/${relativePath}`;
    assert.equal(await sha256(path), expected, `changed preserved file: ${relativePath}`);
  }

  // config.yml is user-mutable; check required sections exist without hashing secrets
  const config = await readText(`${agentRoot}/config.yml`);
  assert.match(config, /^modelRoles:\s*$/m, 'config missing modelRoles section');
  assert.match(config, /^memory:\s*$/m, 'config missing memory section');
  assert.match(config, /^\s+backend:\s*mnemopi\s*$/m, 'config missing mnemopi memory backend');
  assert.match(config, /^mnemopi:\s*$/m, 'config missing mnemopi section');
  assert.match(config, /^\s+disabledAgents:\s*$/m, 'config missing disabledAgents section');
  for (const agent of [
    'context-builder',
    'context-builder-blocking',
    'delegate',
    'delegate-blocking',
    'oracle',
    'oracle-blocking',
  ]) {
    assert.match(config, new RegExp(`^\\s+-\\s+${agent}\\s*$`, 'm'), `config missing disabled agent: ${agent}`);
  }
});

test('plugin source and installed package use exact skills-only revision', async () => {
  const packageJson = JSON.parse(await readText(`${pluginRoot}/package.json`));
  const dependency = packageJson.dependencies?.superpowers;
  assert.equal(dependency, `github:speedpiyawatt/superpowers#${passingSuperpowersCommit}`);

  const lock = await readText(`${pluginRoot}/bun.lock`);
  assert.ok(lock.includes(passingSuperpowersCommit), 'bun.lock lacks full Superpowers revision');

  const installedManifestPath = `${pluginRoot}/node_modules/superpowers/package.json`;
  assert.ok(existsSync(installedManifestPath), 'installed Superpowers manifest missing');
  const installedManifest = JSON.parse(await readText(installedManifestPath));
  assert.deepEqual(installedManifest.pi, { skills: ['./skills'] });
  assert.equal(installedManifest.pi?.extensions, undefined);
});
