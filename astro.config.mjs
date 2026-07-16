import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const sidebar = [
  { label: 'Home', link: '/' },
  {
    label: 'Get started',
    items: [
      { label: 'Overview', link: '/v1/' },
      { label: 'Quickstart', link: '/v1/getting-started/quickstart/' },
      { label: 'Authentication', link: '/v1/getting-started/authentication/' },
      { label: 'Roles and permissions', link: '/v1/getting-started/roles-permissions/' },
      { label: 'Request reliability', link: '/v1/getting-started/request-reliability/' },
      { label: 'Postman collection', link: '/v1/resources/code-examples/#postman' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { label: 'Account setup', link: '/v1/guides/account-setup/' },
      { label: 'Financial controls', link: '/v1/guides/account-lifecycle/' },
      { label: 'Adjustments', link: '/v1/guides/financial-adjustments/' },
      { label: 'Configuration', link: '/v1/guides/configuration/' },
      { label: 'Payment jobs', link: '/v1/guides/payment-jobs/' },
      { label: 'Legacy batches', link: '/v1/guides/legacy-batches/' },
    ],
  },
  {
    label: 'Concepts',
    items: [
      { label: 'Tenant isolation', link: '/v1/concepts/tenant-isolation/' },
      { label: 'Idempotency and retries', link: '/v1/concepts/idempotency/' },
      { label: 'Errors', link: '/v1/concepts/errors/' },
      { label: 'Projections', link: '/v1/concepts/projections/' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { label: 'Identity Access API', link: '/v1/api/identity-access/' },
      { label: 'Ledger Core API', link: '/v1/api/ledger-core/' },
      { label: 'Workbench API', link: '/v1/api/workbench/' },
      { label: 'Current limitations', link: '/v1/resources/limitations/' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Code examples', link: '/v1/resources/code-examples/' },
      { label: 'GitHub', link: 'https://github.com/mavulahq' },
      { label: 'Support', link: 'https://github.com/orgs/mavulahq/discussions' },
    ],
  },
];

export default defineConfig({
  site: 'https://mavulahq.github.io',
  base: '/developer-docs',
  integrations: [
    starlight({
      title: 'MAVULA Developer Docs',
      description: 'Integration guides and public API reference for MAVULA financial infrastructure.',
      customCss: ['./src/styles/custom.css'],
      favicon: '/favicon.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/mavulahq/developer-docs' },
      ],
      sidebar,
      pagination: true,
      lastUpdated: true,
      editLink: {
        baseUrl: 'https://github.com/mavulahq/developer-docs/edit/main/',
      },
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#071a45' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'MAVULA Developer Docs' } },
      ],
    }),
  ],
});
