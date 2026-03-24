---
paths: ["apps/api/**", "apps/web/src/pages/**"]
---

# API Design Rules

## Architecture

- API (Hono on Cloudflare Workers) is the single data access layer for D1
- Frontend (Astro SSR) fetches from the API during server-side rendering; browser never calls the API directly
- Keep API stateless — all state lives in D1

## Endpoints

- Use `GET` for all read operations
- URL structure: `/<resource>` for top-level collections (e.g., `/brands`, `/models`)
- URL structure: `/<resource>/:param1/:param2` for detail (e.g., `/models/:brandSlug/:modelSlug`)
- Use query parameters for filtering, not path segments (e.g., `/models?sport=ski`, not `/ski/models`)
- Return JSON with `c.json()`; always return an array for list endpoints, even when empty
- Detail endpoints return the resource directly (not wrapped in `data`); return 404 with `{ error: { message } }` if not found

## Pagination (cursor-based, per Google AIP-158)

- **Request parameters**: `pageSize` (optional int), `pageToken` (optional opaque string)
- **Response fields**: result array + `nextPageToken` (empty string or omitted when no more pages)
- `pageSize` unspecified or 0 → server default (20); document the default and max in each endpoint
- `pageSize` exceeding max → silently coerce to max, do not error
- `pageToken` is opaque, URL-safe, not user-parseable — encode cursor data (e.g., base64-encoded ULID or offset)
- Do not use numeric offset pagination; ULIDs are naturally sortable and make good cursor keys
- Changing `pageSize` between pages is allowed; honor the new value
- `totalSize` is optional; include only when the query is cheap (e.g., pre-computed count). If estimated, document it

## Filtering & Ordering (per Google AIP-132)

- Add filter/order parameters only when there is an established need; both are easy to add later but breaking to remove
- Filter: use named query parameters for known dimensions (e.g., `sport`, `brandSlug`, `season`), not a generic `filter` string
- Ordering: use `orderBy` query parameter with comma-separated field names; append ` desc` for descending. Omitted → server default order

## Response Shape

- List endpoints: return `{ data: T[], nextPageToken?: string }`
- Single resource endpoints: return the resource object directly (not wrapped)
- Use camelCase for all JSON field names (matching Drizzle column aliases)
- Null DB values → `null` in JSON (not omitted)
- Timestamps: ISO 8601 strings (UTC)

## Error Handling

- Return appropriate HTTP status codes: 400 for bad input, 404 for missing resources, 500 for unexpected errors
- Error response shape: `{ error: { message: string } }`
- Validate query parameters at the handler level; do not pass unsanitized values to Drizzle queries

## Database Access

- Create `db` instance per request: `const db = createDb(c.env.DB)`
- Avoid N+1 queries — batch-fetch related data with `inArray` and group in JS
- Select only the columns needed; do not `SELECT *` for list endpoints
- Use Drizzle's `.where(condition || undefined)` pattern for optional filters

## SSR Integration

- Astro pages fetch from `API_URL` (env var, defaults to `http://localhost:8787` in dev)
- All API calls happen in Astro frontmatter (`---` block), never in client-side React components
- Wrap fetch calls in `try/catch`; set a `fetchError` flag and render a user-friendly fallback on failure
- Use `Promise.all` for independent API calls to parallelize SSR data fetching
