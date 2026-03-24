# Edgepick — リリース TODO

## P0: リリースブロッカー

- [x] GitHub リポジトリ作成 (`paveg/edgepick`) + 初回 push
- [x] `.gitignore` 更新（`.firecrawl/`, `.wrangler/`, `tools/scrape-test/.venv/`）
- [x] CI: GitHub Actions で PR ごとに `pnpm -w run ready` (fmt/lint/test/build)
- [x] スノーボード データ追加（3 → 8 ブランド、28 → 56 モデル）
  - [x] GNU — 6 モデル
  - [x] Capita — 5 モデル
  - [x] Ride — 6 モデル
  - [x] YES. — 5 モデル
  - [x] Nitro — 6 モデル
  - [ ] `setbackMm` フィールドの埋め込み（既存含む全ブランド）

## P1: 本番環境構築

- [x] Cloudflare D1 本番 DB 作成
- [x] `apps/api/wrangler.jsonc` に本番 `database_id` 設定
- [x] 本番 DB マイグレーション
- [x] 本番 DB シード投入
- [x] API デプロイ (Workers) — https://edgepick-api.pavegy.workers.dev
- [x] Web デプロイ (Workers + Static Assets) — https://edgepick-web.pavegy.workers.dev
- [x] Service Binding で Worker 間通信（error 1042 回避）
- [x] CD: GitHub Actions で main push 時に自動デプロイ
- [x] GitHub Secrets 登録: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- [x] スクレイピング自動化パイプライン（firecrawl + brands.ts + scrape.ts）
- [x] seed `--brand <slug>` フィルター / `--dry-run` フラグ

## P2: 収益化・機能強化

- [ ] アフィリエイト Phase 1: 検索 URL 生成方式
  - [ ] `packages/shared/src/affiliate.ts` に ASP 設定 + URL 生成関数
  - [ ] Workers Secrets にアフィリエイト ID 登録 (`AMAZON_ASSOCIATE_TAG` 等)
  - [ ] `handleModelDetail` レスポンスに `affiliateLinks` 追加
  - [ ] 詳細ページ・比較ページに購入リンク UI 追加
  - [ ] 対応 ASP: Amazon JP, 楽天市場, Yahoo ショッピング
- [ ] カスタムドメイン設定
- [ ] データ品質改善（カテゴリ分類の修正、setbackMm 補完）

## P3: 将来

- [ ] アフィリエイト Phase 2: Amazon PA-API / 楽天 API 連携（売上実績後）
  - [ ] `affiliate_links` テーブル追加（実商品 URL キャッシュ）
  - [ ] Cron Triggers でバッチ取得
  - [ ] 検索 URL をフォールバックに
- [ ] ダークモード対応（CSS 変数上書きのみで切替可能）
- [ ] スキーデータ追加ブランド（Armada, Faction, Line, Elan 等）
- [ ] 画像対応（`model_images` テーブルは定義済み）
- [ ] OGP / SEO メタタグ強化
