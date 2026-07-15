# MAVULA Developer Documentation

Versioned public API contracts and developer documentation for MAVULA.

The repository publishes approved Identity Access, Ledger Core and Workbench
interfaces. Internal callbacks, health checks and observability endpoints are
excluded from the public reference.

The legacy batch guide documents regulatory export generation, validation-only
imports, durable receipts, delivery registration and operator recovery.

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
```

## License

AGPL-3.0-only. MAVULA names and marks remain reserved.
