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
}
console.log('developer-docs owner contract digests and public boundaries are valid');
