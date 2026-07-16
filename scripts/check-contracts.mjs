import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const lock = JSON.parse(readFileSync('sources.lock.json', 'utf8'));
const expectedContracts = new Map([
  ['identity-access.public.v1.yaml', {
    owner: 'mavulahq/identity-access',
    source: 'contracts/openapi/identity-access.public.v1.yaml',
  }],
  ['ledger-core.public.v1.yaml', {
    owner: 'mavulahq/ledger-core',
    source: 'contracts/openapi/ledger-core.public.v1.yaml',
  }],
  ['workbench.public.v1.yaml', {
    owner: 'mavulahq/workbench',
    source: 'contracts/openapi/workbench.public.v1.yaml',
  }],
]);
if (lock.version !== 1 || !Array.isArray(lock.contracts) || lock.contracts.length !== 3) {
  throw new Error('sources.lock.json must declare the three v1 owner contracts');
}
for (const contract of lock.contracts) {
  const expected = expectedContracts.get(contract.file);
  if (!expected || contract.owner !== expected.owner || contract.source !== expected.source) {
    throw new Error(`${contract.file} has invalid owner contract provenance`);
  }
  const source = readFileSync(`openapi/${contract.file}`, 'utf8');
  const document = parse(source);
  const digest = createHash('sha256').update(source).digest('hex');
  if (digest !== contract.sha256) throw new Error(`${contract.file} does not match its owner digest`);
  if (document.openapi !== '3.1.0') throw new Error(`${contract.file} must use OpenAPI 3.1.0`);
  for (const [route, pathItem] of Object.entries(document.paths ?? {})) {
    if (/\/internal\/|\/interaction|\/health$|\/metrics$|\/auth\/login/.test(route)) {
      throw new Error(`${contract.file} exposes non-public route ${route}`);
    }
    for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
      const operation = pathItem?.[method];
      if (!operation) continue;
      if (!operation.operationId || !operation.summary) {
        throw new Error(`${contract.file} ${method.toUpperCase()} ${route} must declare operationId and summary`);
      }
      if (contract.file !== 'identity-access.public.v1.yaml') {
        const permissions = operation['x-mavula-permissions'];
        if (!Array.isArray(permissions) || permissions.length === 0) {
          throw new Error(`${contract.file} ${method.toUpperCase()} ${route} must declare permissions`);
        }
      }
    }
  }
}

const guideFiles = [
  'src/content/docs/v1/getting-started/quickstart.mdx',
  'src/content/docs/v1/getting-started/authentication.mdx',
  'src/content/docs/v1/guides/account-lifecycle.mdx',
  'src/content/docs/v1/guides/financial-adjustments.mdx',
  'src/content/docs/v1/guides/payment-jobs.mdx',
  'src/content/docs/v1/guides/legacy-batches.mdx',
];
for (const file of guideFiles) readFileSync(file, 'utf8');
console.log('developer-docs owner digests, public boundaries and use-case coverage are valid');
