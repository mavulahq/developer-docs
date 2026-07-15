import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('all published operations use unique operationId values', () => {
  const operationIds = [];
  for (const file of ['identity-access', 'ledger-core', 'workbench']) {
    const source = readFileSync(`openapi/${file}.public.v1.yaml`, 'utf8');
    operationIds.push(...[...source.matchAll(/^\s+operationId: (\S+)$/gm)].map((match) => match[1]));
  }
  assert.equal(new Set(operationIds).size, operationIds.length);
  assert.ok(operationIds.length > 20);
});

test('legacy batch guide links to the public owner contract', () => {
  const guide = readFileSync('guides/legacy-batches.html', 'utf8');
  const workbench = readFileSync('openapi/workbench.public.v1.yaml', 'utf8');
  assert.match(guide, /imports are staged and validated only/i);
  assert.match(guide, /\.\.\/workbench\.html/);
  for (const route of ['/api/regulatory-exports', '/api/legacy-imports', '/api/legacy-batches/{batchId}/artifact']) {
    assert.ok(workbench.includes(route), `missing documented route ${route}`);
  }
});
