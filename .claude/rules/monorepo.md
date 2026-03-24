---
paths:
  [
    "package.json",
    "pnpm-workspace.yaml",
    "pnpm-lock.yaml",
    "tsconfig.json",
    "vite.config.ts",
    "**/package.json",
  ]
---

# Monorepo Rules

## Workspace Structure

```
apps/api      — Hono API on Cloudflare Workers (D1 binding)
apps/web      — Astro SSR on Cloudflare Pages
packages/db   — Drizzle schema, migrations, seed scripts
packages/shared — Shared utilities
```

## Development

- `vp run dev` / `pnpm dev` starts both API (port 8787) and Web (port 4321)
- `pnpm -w run ready` runs fmt → lint → test → build across all packages
- Always run `ready` before considering work complete

## Dependencies

- Use `catalog:` for all shared dependencies — versions are centralized in `pnpm-workspace.yaml`
- When a package imports from another workspace package (e.g., `apps/api` uses `db`), declare it in `dependencies` as `"db": "workspace:*"`
- Transitive dependencies must be declared explicitly (pnpm strict mode) — e.g., `apps/api` imports from `drizzle-orm` directly, so it must list `drizzle-orm` in its own `package.json`

## Package Scripts

- `test` — each package runs its own tests; root `ready` script invokes all via `vp run -r test`
- `build` — API uses `wrangler deploy --dry-run`, Web uses `astro build`, DB uses `tsc --noEmit`
- Seed scripts (`seed:local`, `seed:remote`) live in `packages/db` and run via `tsx`

## Adding New Packages

- Register in `pnpm-workspace.yaml` under `packages`
- Add new dependencies to the `catalog` section
- Ensure `pnpm -w run ready` passes before committing
