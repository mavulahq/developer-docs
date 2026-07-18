#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { enforceLocalAgentPolicy } from './check-agent-policy.mjs';

const failures = [];
failures.push(...enforceLocalAgentPolicy());
const required = [
  '.github/CODEOWNERS',
  '.github/PULL_REQUEST_TEMPLATE.md', '.github/workflows/guardian.yml',
  '.github/workflows/required-ci.yml', '.github/workflows/pages.yml',
  'LICENSE', 'README.md', 'package.json', 'sources.lock.json', 'redocly.yaml',
  'astro.config.mjs', 'src/content.config.ts', 'src/styles/custom.css',
  'src/content/docs/index.mdx', 'src/content/docs/v1/guides/legacy-batches.mdx',
  'src/pages/v1/api/[api].astro', 'examples/postman/MAVULA-API-v1.postman_collection.json',
  'openapi/identity-access.public.v1.yaml', 'openapi/ledger-core.public.v1.yaml',
  'openapi/workbench.public.v1.yaml',
];
for (const file of required) if (!existsSync(file)) failures.push(`${file} is required`);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (pkg.name !== '@mavula/developer-docs') failures.push('package name must be @mavula/developer-docs');
if (pkg.license !== 'AGPL-3.0-only') failures.push('developer-docs must remain AGPL-3.0-only');
const tracked = spawnSync('git', ['ls-files'], { encoding: 'utf8' });
for (const file of tracked.stdout.split('\n').filter(Boolean)) {
  if (/(^|\/)\.env($|\.(?!example$))/.test(file)) failures.push(`${file} must not be tracked`);
  if (/\.(png|jpg|jpeg|webp|gif|ico|pdf)$/i.test(file) || file === 'scripts/guardian.mjs') continue;
  const content = readFileSync(file, 'utf8');
  if (/getfluxo-io|@getfluxo|packages\/(fengine|fwk|fpay|finfra)/.test(content)) failures.push(`${file} contains legacy identifiers`);
}
if (failures.length) {
  console.error('MAVULA developer-docs guardian failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('MAVULA developer-docs guardian passed.');
