# Edgepick — リリース TODO

## P0: リリースブロッカー

- [ ] GitHub リポジトリ作成 (`paveg/edgepick`) + 初回 push
- [ ] `.gitignore` 更新（`.claude/`, `.firecrawl/`, `.wrangler/`, `tools/scrape-test/.venv/`）
- [ ] CI: GitHub Actions で PR ごとに `pnpm -w run ready` (fmt/lint/test/build)
- [ ] スノーボード データ追加（現状 3 ブランド → 最低 8 ブランドへ）
  - [ ] GNU — スクレイピング + シード化
  - [ ] Capita — スクレイピング + シード化
  - [ ] Ride — スクレイピング + シード化
  - [ ] YES. — スクレイピング + シード化
  - [ ] Nitro — スクレイピング + シード化
  - [ ] `setbackMm` フィールドの埋め込み（既存 Burton/Jones/Lib Tech 含む）

## P1: 本番環境構築

- [ ] Cloudflare D1 本番 DB 作成 (`wrangler d1 create edgepick-db`)
- [ ] `apps/api/wrangler.jsonc` に本番 `database_id` 設定
- [ ] 本番 DB マイグレーション (`pnpm --filter db migrate --remote`)
- [ ] 本番 DB シード投入 (`pnpm --filter db seed --remote`)
- [ ] CD: GitHub Actions で main マージ時に `wrangler deploy`
  - [ ] API (Workers)
  - [ ] Web (Workers + Static Assets)
- [ ] GitHub Secrets 登録: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- [ ] Web ビルド時の `API_URL` を本番 Workers URL に設定
- [ ] CORS を本番ドメインに制限（現状 `cors()` で全オリジン許可）

## P2: 収益化・機能強化

- [ ] アフィリエイト Phase 1: 検索 URL 生成方式
  - [ ] `packages/shared/src/affiliate.ts` に ASP 設定 + URL 生成関数
  - [ ] Workers Secrets にアフィリエイト ID 登録 (`AMAZON_ASSOCIATE_TAG` 等)
  - [ ] `handleModelDetail` レスポンスに `affiliateLinks` 追加
  - [ ] 詳細ページ・比較ページに購入リンク UI 追加
  - [ ] 対応 ASP: Amazon JP, 楽天市場, Yahoo ショッピング
- [ ] seed `--brand <slug>` フィルター（特定ブランドだけ投入）
- [ ] seed `--dry-run` フラグ（SQL 出力のみ）
- [ ] カスタムドメイン設定

## P3: 将来

- [ ] アフィリエイト Phase 2: Amazon PA-API / 楽天 API 連携（売上実績後）
  - [ ] `affiliate_links` テーブル追加（実商品 URL キャッシュ）
  - [ ] Cron Triggers でバッチ取得
  - [ ] 検索 URL をフォールバックに
- [ ] ダークモード対応（CSS 変数上書きのみで切替可能）
- [ ] スキーデータ追加ブランド（Armada, Faction, Line, Elan 等）
- [ ] 画像対応（`model_images` テーブルは定義済み）
- [ ] OGP / SEO メタタグ強化
