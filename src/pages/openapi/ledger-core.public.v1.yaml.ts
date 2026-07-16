import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../../openapi/ledger-core.public.v1.yaml', import.meta.url), 'utf8');

export function GET() {
  return new Response(source, { headers: { 'content-type': 'application/yaml; charset=utf-8' } });
}
