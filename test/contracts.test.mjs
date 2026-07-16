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
  assert.equal(operationIds.length, 57);
});

test('legacy batch guide preserves validation-only and durable recovery boundaries', () => {
  const guide = readFileSync('src/content/docs/v1/guides/legacy-batches.mdx', 'utf8');
  const workbench = readFileSync('openapi/workbench.public.v1.yaml', 'utf8');
  assert.match(guide, /imports are staged and validated only/i);
  assert.match(guide, /durable batch receipt/i);
  assert.match(guide, /do not mutate financial state/i);
  for (const route of ['/api/regulatory-exports', '/api/legacy-imports', '/api/legacy-batches/{batchId}/artifact']) {
    assert.ok(workbench.includes(route), `missing documented route ${route}`);
  }
});

test('portal covers identity, financial controls, payments and reliability', () => {
  const files = [
    'src/content/docs/v1/getting-started/authentication.mdx',
    'src/content/docs/v1/guides/account-lifecycle.mdx',
    'src/content/docs/v1/guides/financial-adjustments.mdx',
    'src/content/docs/v1/guides/payment-jobs.mdx',
    'src/content/docs/v1/concepts/idempotency.mdx',
  ];
  const content = files.map((file) => readFileSync(file, 'utf8')).join('\n');
  for (const expectation of ['internal.worker', 'operations_maker', 'REVERSAL', 'PAYMENT_CAPTURE', 'idempotency key']) {
    assert.match(content, new RegExp(expectation, 'i'));
  }
});

test('published examples use canonical hosts and contract payload names', () => {
  const files = [
    'src/content/docs/v1/getting-started/quickstart.mdx',
    'src/content/docs/v1/getting-started/roles-permissions.mdx',
    'src/content/docs/v1/guides/payment-jobs.mdx',
    'src/content/docs/v1/guides/legacy-batches.mdx',
    'examples/postman/MAVULA-API-v1.postman_collection.json',
  ];
  const content = files.map((file) => readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(content, /https:\/\/(?:identity|ledger|workbench)\.mavula\.io/);
  for (const expectation of ['mavula.dev', 'compliance.manage', 'valueMinor', 'period_from', 'authority_reference']) {
    assert.match(content, new RegExp(expectation, 'i'));
  }
});
