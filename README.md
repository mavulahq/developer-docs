# MAVULA Developer Docs

Public integration guides and versioned API contracts for MAVULA financial infrastructure.

The repository publishes approved Identity Access, Ledger Core and Workbench
interfaces. Internal callbacks, health checks and observability endpoints are
excluded from the public reference.

The Astro and Starlight portal covers identity, tenant isolation, account and
financial controls, payment jobs, configuration, projections and legacy batch
operations. Scalar renders the three public OpenAPI contracts locally.

## Contracts

- `identity-access.public.v1.yaml`
- `ledger-core.public.v1.yaml`
- `workbench.public.v1.yaml`

`sources.lock.json` binds each published copy to its owner repository and
SHA-256 digest. `pnpm contracts:check` rejects drift and internal routes.

## Validation

```bash
pnpm guardian:check
pnpm contracts:check
pnpm test
pnpm build
pnpm test:e2e
```

Run `pnpm dev` for local authoring. The production site is published from
GitHub Actions to `https://mavulahq.github.io/developer-docs/`.

## License

AGPL-3.0-only. MAVULA names and marks remain reserved.
