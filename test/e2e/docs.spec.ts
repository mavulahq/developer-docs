import { expect, test } from '@playwright/test';

test('financial controls guide renders the complete maker-checker workflow', async ({ page }, testInfo) => {
  await page.goto('/developer-docs/v1/guides/account-lifecycle/');
  await expect(page.getByRole('heading', { level: 1, name: 'Control an account lifecycle' })).toBeVisible();
  await expect(page.getByText('operations_maker', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Java' })).toBeVisible();
  await expect(page.getByText('Self-approval is rejected')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: testInfo.outputPath('financial-controls.png'), fullPage: true });
});

test('local Scalar reference loads the owner OpenAPI contract', async ({ page }, testInfo) => {
  await page.goto('/developer-docs/v1/api/ledger-core/');
  await expect(page.getByRole('heading', { level: 1, name: 'Ledger Core API', exact: true })).toBeVisible();
  await expect.poll(async () => page.locator('#api-reference').innerText(), { timeout: 20_000 }).toContain('/api/accounts');
  await expect(page.getByRole('button', { name: 'Ask AI' })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('ledger-reference.png'), fullPage: false });
});

test('published OpenAPI remains directly downloadable', async ({ request }) => {
  const response = await request.get('/developer-docs/openapi/workbench.public.v1.yaml');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toMatch(/^(application|text)\/yaml/);
  expect(await response.text()).toContain('/api/regulatory-exports:');
});
