# ブランド/プロダクト シードデータ作成

ブランドのスキー・スノーボード製品データを収集し、シードデータ（JSON）として投入するワークフロー。

引数: `$ARGUMENTS`（ブランド名、例: "Salomon", "Atomic"）

## ワークフロー

### Step 1: 既存データの確認

新規ブランドか追加かを判別する。

```bash
# 既存シードデータの確認
ls packages/db/seed/data/
```

- 同一ブランドの JSON が既にある → 追加・更新フロー
- 新規ブランド → 新規作成フロー

カテゴリの重複に注意: 他ブランドの JSON で既に定義済みのカテゴリ（例: `all-mountain`）がある場合、**同じ ID を使い回す**。異なる ID で同じ slug を INSERT すると UNIQUE 制約違反になる。

```bash
# 既存カテゴリ ID の確認（他ブランドの JSON から）
grep -r '"slug"' packages/db/seed/data/*.json | grep -A1 '"categories"'
```

### Step 2: 情報ソースのスクレイピング

firecrawl を使って製品ページから markdown を取得する。

**優先ソース（スキー・スノーボード共通）:**

1. **ブランド公式サイト** — 永続性が高くデータが正確。`sourceUrl` にはこちらを優先記録
2. **evo.com** — サイズチャートが構造化されていて scrape しやすい。公式が取得不可の場合のフォールバック
3. **ski-db.com / the-good-ride.com** — 補完的な参照

**重要: 新ブランド追加時は、必ず先に WebFetch で公式サイトの構造を確認する。**
公式が bot ブロック等で取得不可の場合は `.claude/rules/database.md` のスクレイピング可否表に追記すること。

**公式 scrape 不可の確認済みブランド:**

- **Salomon** (salomon.com) — 403 Forbidden。evo.com をプライマリソースとして使用

```
# ブランドのモデル一覧ページ
/firecrawl-scrape https://www.evo.com/skis/<brand-slug>

# 各モデルの詳細ページ
/firecrawl-scrape https://www.evo.com/skis/<brand-slug>-<model-slug>
```

保存先: `.firecrawl/` ディレクトリ（gitignore 済み）

**注意:**

- evo.com で在庫切れ（Outlet）のページはスペックテーブルが空の場合がある → 公式サイトにフォールバック
- 2025-2026 シーズンのモデルを対象にする。旧シーズンは明示的に区別する
- scrape 結果は必ず目視確認し、サイズテーブルが取得できていることを確かめる

### Step 3: データの正規化（markdown → JSON）

scrape した markdown を読み、`SeedBrand` 型に準拠する JSON を手動で作成する。

**型定義** (`packages/db/seed/types.ts`):

```typescript
type SeedBrand = {
  brand: { id; name; slug; country; websiteUrl; description? };
  categories: [{ id; sport; name; slug; displayOrder }];
  models: [
    {
      id;
      categorySlug;
      name;
      slug;
      sport;
      level;
      season;
      msrpJpy?;
      description?;
      specs: { id; rockerType?; tailType?; coreMaterial?; baseMaterial?; sidewall? };
      sizes: [
        {
          id;
          lengthCm;
          waistWidthMm?;
          noseWidthMm?;
          tailWidthMm?;
          sidecutRadiusM?;
          weightG?;
          displayOrder;
        },
      ];
    },
  ];
};
```

**ID 生成:**

```bash
node --input-type=module -e "import { ulid } from 'ulidx'; for(let i=0;i<10;i++) console.log(ulid())"
```

必要な ID 数: brand(1) + categories(N) + models ごとに model(1) + specs(1) + sizes(M)

**フィールドルール:**

| フィールド       | ルール                                                                         |
| ---------------- | ------------------------------------------------------------------------------ |
| `slug`           | ケバブケース、モデル名から生成（例: "QST 98" → `qst-98`）                      |
| `country`        | ISO 3166-1 alpha-2（例: FR, AT, US, JP）                                       |
| `sport`          | `"ski"` または `"snowboard"`                                                   |
| `level`          | `"beginner"`, `"intermediate"`, `"advanced"`, `"expert"`                       |
| `season`         | `"YYYY-YYYY"` 形式（例: `"2025-2026"`）                                        |
| `categorySlug`   | `categories` 配列内の `slug` と一致させる                                      |
| `msrpJpy`        | 日本円。不明なら省略（null）                                                   |
| `weightG`        | **片足あたり（per ski）** のグラム数。公式サイトが per pair の場合は半分にする |
| `sidecutRadiusM` | メートル単位。複数値（例: "17/15/17"）の場合はセンター値を使用                 |
| `displayOrder`   | sizes 内は短い順に 1 から連番                                                  |

**カテゴリ slug 対応表（スキー）:**

| カテゴリ名              | slug                | displayOrder |
| ----------------------- | ------------------- | ------------ |
| オールマウンテン        | `all-mountain`      | 1            |
| オールマウンテン ワイド | `all-mountain-wide` | 2            |
| パウダー                | `powder`            | 3            |
| 基礎・カービング        | `frontside`         | 4            |
| パーク & パイプ         | `park-pipe`         | 5            |
| ツーリング              | `touring`           | 6            |
| レーシング              | `racing`            | 7            |

**カテゴリ slug 対応表（スノーボード）:**

| カテゴリ名       | slug           | displayOrder |
| ---------------- | -------------- | ------------ |
| オールマウンテン | `all-mountain` | 1            |
| フリースタイル   | `freestyle`    | 2            |
| フリーライド     | `freeride`     | 3            |
| パウダー         | `powder`       | 4            |
| パーク           | `park`         | 5            |
| カービング       | `carving`      | 6            |
| グラトリ         | `ground-trick` | 7            |

### Step 4: JSON バリデーション

```bash
# TypeScript 型チェック（tsx 経由で import して検証）
node --input-type=module -e "
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync('packages/db/seed/data/<brand>.json', 'utf-8'));
console.log('brand:', data.brand.name);
console.log('categories:', data.categories.length);
console.log('models:', data.models.length);
console.log('total sizes:', data.models.reduce((s, m) => s + m.sizes.length, 0));
// categorySlug の整合性チェック
const slugs = new Set(data.categories.map(c => c.slug));
for (const m of data.models) {
  if (!slugs.has(m.categorySlug)) {
    console.error('ERROR: unknown categorySlug', m.categorySlug, 'in model', m.name);
  }
}
console.log('✓ validation passed');
"
```

**チェックリスト:**

- [ ] 全 ID が ULID 形式（26文字、英数大文字）
- [ ] `categorySlug` が `categories` 配列内の `slug` と一致
- [ ] `sizes` が `lengthCm` の昇順で `displayOrder` が連番
- [ ] `weightG` が片足あたり（公式が per pair なら ÷2）
- [ ] 同一ブランド内で `model.slug` がユニーク
- [ ] 他ブランドと共通のカテゴリは同じ ID を使用

### Step 5: シード実行

```bash
# ローカル D1 に投入
pnpm --filter db seed:local

# 件数確認
cd apps/api && pnpm wrangler d1 execute edgepick-db --local \
  --command "SELECT b.name, count(m.id) as models FROM brands b LEFT JOIN models m ON m.brand_id = b.id GROUP BY b.id"

# サイズ数スポットチェック
cd apps/api && pnpm wrangler d1 execute edgepick-db --local \
  --command "SELECT m.name, count(ms.id) as sizes FROM models m JOIN model_sizes ms ON ms.model_id = m.id WHERE m.brand_id = (SELECT id FROM brands WHERE slug = '<brand-slug>') GROUP BY m.id"
```

### Step 6: 冪等性の確認

```bash
# 2回目の実行で重複が発生しないことを確認
pnpm --filter db seed:local

# 件数が変わっていないこと
cd apps/api && pnpm wrangler d1 execute edgepick-db --local \
  --command "SELECT count(*) FROM models"
```

### Step 7: 全体チェック

```bash
pnpm -w run ready
```

## データソースが不足している場合

スペックの一部が取得できない場合の優先度:

1. **必須**: `lengthCm`, `waistWidthMm` — これがないとカタログとして成立しない
2. **重要**: `sidecutRadiusM`, `noseWidthMm`, `tailWidthMm` — 比較に有用
3. **あれば良い**: `weightG`, `coreMaterial`, `baseMaterial` — 補完的情報

不足フィールドは `null`（JSON では省略）にして、後から補完可能にする。推測値を入れない。

## 参考: nordica.json の構造

```
nordica.json
├── brand: Nordica (IT)
├── categories: [オールマウンテン]
└── models: 4 モデル
    ├── Enforcer 89  (4 sizes, 167-185cm)
    ├── Enforcer 94  (4 sizes, 167-185cm)
    ├── Enforcer 99  (5 sizes, 167-191cm)
    └── Enforcer 104 (5 sizes, 167-191cm)
```
