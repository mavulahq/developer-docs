import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const contracts = [
  ['identity-access.public.v1.yaml', 'identity-access.html'],
  ['ledger-core.public.v1.yaml', 'ledger-core.html'],
  ['workbench.public.v1.yaml', 'workbench.html'],
];
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
mkdirSync('dist/guides', { recursive: true });
for (const [source, output] of contracts) {
  run(['lint', `openapi/${source}`]);
  run(['build-docs', `openapi/${source}`, '--output', `dist/${output}`]);
}
copyFileSync('guides/legacy-batches.html', 'dist/guides/legacy-batches.html');
writeFileSync('dist/.nojekyll', '');
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim() || 'unknown';
writeFileSync('dist/build-info.json', `${JSON.stringify({ revision, generated_at: new Date().toISOString() }, null, 2)}\n`);
writeFileSync('dist/index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MAVULA API Reference</title><style>
body{margin:0;font-family:Arial,sans-serif;color:#151719;background:#f7f8fa}main{max-width:960px;margin:0 auto;padding:48px 24px}
h1{font-size:32px;letter-spacing:0;margin:0 0 12px}p{color:#4d555d;margin:0 0 32px}.apis{border-top:1px solid #ccd2d8}
a{display:grid;grid-template-columns:220px 1fr 24px;gap:20px;align-items:center;padding:22px 0;border-bottom:1px solid #ccd2d8;color:#151719;text-decoration:none}
a:hover strong{text-decoration:underline}small{color:#68717a}@media(max-width:620px){a{grid-template-columns:1fr 24px}a small{grid-column:1}}
</style></head><body><main><h1>MAVULA API Reference</h1><p>Versioned institutional finance interfaces.</p><section class="apis">
<a href="identity-access.html"><strong>Identity Access</strong><small>OAuth 2.0, OpenID Connect and effective operator identity</small><span>›</span></a>
<a href="ledger-core.html"><strong>Ledger Core</strong><small>Accounts, financial controls, configuration and projections</small><span>›</span></a>
<a href="workbench.html"><strong>Workbench</strong><small>Jobs and authenticated operational status</small><span>›</span></a>
<a href="guides/legacy-batches.html"><strong>Legacy batches</strong><small>Regulatory exports, validation-only imports and durable receipts</small><span>›</span></a>
</section></main></body></html>`);

function run(args) {
  const executable = process.platform === 'win32' ? 'redocly.cmd' : 'redocly';
  const result = spawnSync(executable, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) throw new Error(`redocly ${args.join(' ')} failed`);
}
