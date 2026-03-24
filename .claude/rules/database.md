---
paths: ["packages/db/**", "apps/api/src/**"]
---

# Database Rules

## Schema

- Drizzle ORM with SQLite (Cloudflare D1)
- Schema definitions in `packages/db/src/schema/`
- Migrations generated via `drizzle-kit generate`, applied via `wrangler d1 migrations apply`

## Primary Keys

- All tables use ULID (`ulidx`) as primary key — string type, 26 chars, sortable by creation time
- Generate IDs client-side before insertion; do not rely on DB auto-increment

## Sport-specific Specs

- `ski_specs` and `snowboard_specs` are separate tables (1:1 with `models`)
- Determined by `models.sport` field — query the correct specs table based on sport value
- Do not create a generic polymorphic specs table

## Categories

- Categories are shared across brands via UNIQUE constraint `(sport, slug)`
- When creating seed data for a new brand, reuse existing category IDs if the same `(sport, slug)` pair exists in another brand's JSON
- Different sports can have the same slug (e.g., `all-mountain` exists for both `ski` and `snowboard`) — they are separate records with different IDs

## Seed Data

- Seed files: `packages/db/seed/data/<brand>/<season>.json` (ブランドごとにディレクトリ、シーズンごとにファイル)
- Format: `SeedBrand` type defined in `packages/db/seed/types.ts`
- SQL generation: `INSERT OR REPLACE` for idempotency — safe to run multiple times
- `categorySlug` in JSON resolves to `categoryId` at SQL generation time
- Seed execution: `pnpm --filter db seed:local` (processes all JSON files in `data/`)

## Scraping Sources

データソースの優先順位（高い順）:

1. **ブランド公式サイト** — 永続性が高く、データが正確。`sourceUrl` にはこちらを優先して記録する
2. **evo.com** — サイズチャートが構造化されていて scrape しやすい。公式が取得不可の場合のフォールバック
3. **ski-db.com / the-good-ride.com** — 補完的な参照

### ブランド別スクレイピング可否

| ブランド | 公式サイト           | 構造                                                                    | 備考              |
| -------- | -------------------- | ----------------------------------------------------------------------- | ----------------- |
| Burton   | burton.com           | JSON 埋め込み（`window.__bootstrap`）。サイズチャート完全取得可         | 公式優先          |
| Nordica  | nordica.com          | サイズチャート取得可。ただしサイズ別ノーズ/テールが代表値のみの場合あり | 公式 + evo で補完 |
| Salomon  | salomon.com          | **403 Forbidden** — bot ブロック                                        | evo.com を使用    |
| Jones    | jonessnowboards.com  | JS レンダリング。WebFetch 不可、firecrawl `--wait-for 3000` で取得可    | firecrawl 必須    |
| Lib Tech | lib-tech.com         | サイズチャート完全取得可（幅は cm 単位、mm 変換必要）                   | 公式優先          |
| Atomic   | atomic.com           | **403 Forbidden** — bot ブロック                                        | evo.com を使用    |
| HEAD     | head.com             | JS レンダリング、スペック取得不可                                       | evo.com を使用    |
| Blizzard | blizzard-tecnica.com | URL 構造未確認（404）。要再調査                                         | evo.com を使用    |
| K2       | k2snow.com           | URL 構造未確認（404）。要再調査                                         | evo.com を使用    |

新しいブランドを追加する際は、まず `WebFetch` で公式サイトの構造を確認し、この表を更新すること。

### `sourceUrl` の運用

- `sourceUrl` はデータ投入時点の参照元 URL。時間経過でリンク切れになる可能性がある
- 公式サイトの URL を優先（リダイレクトされても消えにくい）
- evo.com の URL は商品入れ替え時に別シーズンの商品に差し替わることがある

## Performance

- シンプルなクエリを優先する。1 つのクエリで 3 テーブル以上の JOIN が必要になる場合、クエリを分割して JS 側で結合する
- 関連データの取得は `inArray` で一括 fetch → `Map` でグループ化するパターンを使う（N+1 回避）
- サブクエリ、HAVING、ウィンドウ関数は避ける。同等の処理を複数の単純クエリ + JS で実現できないか先に検討する
- D1 は SQLite ベースでコネクションプールがない。クエリ数を減らすより、各クエリの単純さを優先する
- インデックスは UNIQUE 制約と外部キーで自然に作られるものを活用する。追加インデックスは実測でボトルネックを確認してから作成する
- `SELECT *` はリスト系エンドポイントで使わない。必要なカラムだけを明示的に select する

## Naming Conventions

- DB columns: `snake_case` (e.g., `waist_width_mm`)
- Drizzle schema: `camelCase` (e.g., `waistWidthMm`)
- JSON/API responses: `camelCase` (matches Drizzle aliases)

## Seasons

- `models.season` uses `"YYYY-YYYY"` format (e.g., `"2025-2026"`)
- Same model across seasons = separate records with UNIQUE `(brand_id, slug, season)`
- Size lineup can differ between seasons for the same model
