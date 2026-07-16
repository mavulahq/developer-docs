import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const lock = JSON.parse(readFileSync('sources.lock.json', 'utf8'));
if (lock.version !== 1 || !Array.isArray(lock.contracts) || lock.contracts.length !== 3) {
  throw new Error('sources.lock.json must declare the three v1 owner contracts');
}
for (const contract of lock.contracts) {
  const source = readFileSync(`openapi/${contract.file}`, 'utf8');
  const digest = createHash('sha256').update(source).digest('hex');
  if (digest !== contract.sha256) throw new Error(`${contract.file} does not match its owner digest`);
  if (!source.startsWith('openapi: 3.1.0')) throw new Error(`${contract.file} must use OpenAPI 3.1.0`);
  const paths = [...source.matchAll(/^  (\/[^:]+):$/gm)].map((match) => match[1]);
  for (const route of paths) {
    if (/\/internal\/|\/interaction|\/health$|\/metrics$|\/auth\/login/.test(route)) {
      throw new Error(`${contract.file} exposes non-public route ${route}`);
    }
  }
  const operationIds = [...source.matchAll(/\boperationId:\s*([A-Za-z][A-Za-z0-9]*)/g)].map((match) => match[1]);
  const summaries = [...source.matchAll(/\bsummary:\s*[^\n,}]+/g)];
  if (operationIds.length === 0 || summaries.length < operationIds.length) {
    throw new Error(`${contract.file} must describe every public operation`);
  }
  if (contract.file !== 'identity-access.public.v1.yaml') {
    const permissionDeclarations = [...source.matchAll(/x-mavula-permissions:/g)].length;
    if (permissionDeclarations < operationIds.length) {
      throw new Error(`${contract.file} must declare permissions for every public operation`);
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
