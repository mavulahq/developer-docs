import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const contracts = [
  'identity-access.public.v1.yaml',
  'ledger-core.public.v1.yaml',
  'workbench.public.v1.yaml',
];
for (const source of contracts) run('node_modules/@redocly/cli/bin/cli.js', ['lint', `openapi/${source}`]);
run('node_modules/astro/bin/astro.mjs', ['build']);

const revision = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim() || 'unknown';
writeFileSync('dist/build-info.json', `${JSON.stringify({ revision, generated_at: new Date().toISOString() }, null, 2)}\n`);

function run(module, args) {
  const result = spawnSync(process.execPath, [module, ...args], {
    stdio: 'inherit',
    env: { ...process.env, REDOCLY_SUPPRESS_UPDATE_NOTICE: 'true', ASTRO_TELEMETRY_DISABLED: '1' },
  });
  if (result.status !== 0) throw new Error(`${module} ${args.join(' ')} failed`);
}
