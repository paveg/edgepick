# Edgepick — TODO

## Phase 1: カタログ DB + 比較（SEO 基盤）

### 1.1 データパイプライン

- [x] DB スキーマ設計（7 テーブル: brands, categories, models, ski_specs, snowboard_specs, model_sizes, model_images）
- [x] シードインフラ構築（types.ts, generate-sql.ts, seed.ts）
- [x] Nordica シードデータ（Enforcer 89/94/99/104）
- [x] Salomon シードデータ（QST 92/94/98/100/106）
- [x] snowboard_specs 対応（SeedBrand 型 + generate-sql）
- [ ] スキーブランド追加（Atomic, Völkl, HEAD, Blizzard, K2 — 残り 5 社）
- [ ] スノーボードブランド追加（Burton, Jones, Lib Tech — 最低 3 社）
- [ ] `/seed-brand` コマンドでの半自動化の検証・改善

### 1.2 API

- [x] `GET /brands?sport=` — ブランド一覧
- [x] `GET /categories?sport=` — カテゴリ一覧
- [x] `GET /models?sport=` — モデル一覧（brands/categories JOIN、sizes 含む）
- [x] `GET /models/:brandSlug/:modelSlug` — モデル詳細（specs + sizes）
- [x] レスポンス形式: list → `{ data: [] }`, detail → object 直接
- [x] snowboard_specs / ski_specs の sport 分岐
- [ ] カーソルベースページネーション（AIP-158 準拠）
- [ ] フィルタリング（category, level, season）
- [ ] `GET /models/:brandSlug/:modelSlug` に season クエリ対応（シーズン別）
- [ ] エラーハンドリングミドルウェア（統一的な 400/500 処理）

### 1.3 フロントエンド

- [x] スキーカタログ一覧ページ（`/ski`）— API 連携
- [x] スノーボードカタログ一覧ページ（`/snowboard`）— API 連携
- [x] スキーモデル詳細ページ（`/ski/:brandSlug/:modelSlug`）— サイズチャート表示
- [x] スノーボードモデル詳細ページ（`/snowboard/:brandSlug/:modelSlug`）
- [ ] カテゴリ・ブランドフィルターの実装（現在は pills 表示のみ、非機能）
- [ ] 2〜3 モデルのスペック並列比較ページ
- [ ] モデルページの SEO 最適化（meta, structured data）
- [ ] トップページのブランド一覧を API から取得（現在はハードコード）
- [ ] レスポンシブ対応の確認・改善

### 1.4 インフラ・CI

- [x] vitest + `@cloudflare/vitest-pool-workers` テスト環境
- [x] `pnpm -w run ready` でのフルチェック（fmt, lint, test, build）
- [ ] GitHub Actions CI 設定
- [ ] Cloudflare へのデプロイパイプライン（API + Web）
- [ ] 本番用 D1 データベースのセットアップ
- [ ] `seed:remote` での本番シード実行

## Phase 2: ユーザーレビュー（CGM）

- [ ] 認証（Cloudflare Access or OAuth）
- [ ] レビュー投稿 API（POST /reviews）
- [ ] レビュアープロフィール（レベル、体重、ホームゲレンデ）
- [ ] レビュー表示 UI（モデル詳細ページに統合）
- [ ] 「自分と似た条件の人」フィルタリング
- [ ] レビュアー実績バッジ

## Phase 3: マネタイズ強化

- [ ] アフィリエイトリンク（楽天・Amazon）をモデルページに配置
- [ ] ショップ向け広告枠

## タイムライン

| 時期             | マイルストーン                    |
| ---------------- | --------------------------------- |
| 2026 春〜夏      | Phase 1 MVP（カタログ DB + 比較） |
| 2026 秋（10 月） | ローンチ                          |
| 2026〜27 冬      | Phase 2（CGM）開発                |
| 2027 秋          | Phase 2 ローンチ + Phase 3 着手   |
