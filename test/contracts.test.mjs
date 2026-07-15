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
