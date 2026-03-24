---
paths: ["**/*.test.ts", "**/vitest.config.ts", "**/test/**"]
---

# Testing Rules

## Framework

- Use `vitest` + `@cloudflare/vitest-pool-workers` for API tests
- Config: `cloudflareTest()` plugin in `vitest.config.ts` with `wrangler.jsonc` reference
- Import bindings from `cloudflare:workers`, not `cloudflare:test` (v4 API)
- Type declarations go in `test/env.d.ts` with `ProvidedEnv` interface

## Test Structure

- Tests live in `src/__tests__/` within each app
- One test file per app/package; split only when file exceeds ~300 lines
- Use `beforeAll` for shared migrate + seed, not per-describe `beforeEach`
- Test data uses fixed IDs (`brand-01`, `model-01`) — not generated ULIDs

## Test Data Setup

- Inline DDL in `migrate()` function using `CREATE TABLE IF NOT EXISTS` — do not read migration files from disk (Workers runtime has no host filesystem access)
- Seed function inserts minimal fixture data with `INSERT OR REPLACE`
- When adding test data for a new sport/category, update existing tests that assert on empty results (e.g., `expect(data).toHaveLength(0)` → positive assertion)

## TDD Cycle

- Red: write test expecting new behavior → confirm failure with correct reason
- Green: implement minimal code to pass
- Refactor: clean up while keeping tests green
- Run `pnpm test` in the target app, then `pnpm -w run ready` for full verification

## What to Test

- Response shape (`{ data: [] }` for list, object for detail, `{ error: { message } }` for errors)
- HTTP status codes (200, 404)
- Query parameter filtering (sport, etc.)
- Joined/nested data (brand names, sizes within models, specs by sport type)
- Do not test Drizzle ORM internals or SQL generation
