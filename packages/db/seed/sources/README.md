# スクレイピング元 URL 一覧

調査日: 2026-03-24

---

## スキー

### 1. Nordica

- **公式**: https://www.nordica.com/usa/en
  - 一覧: `https://www.nordica.com/usa/en/products-list/men/skis`（女性: `.../women/skis`）
  - 個別: `/usa/en/collection/{gender}/skis/{collection}/{product-name}` パターン
    - 例: `/usa/en/collection/men/skis/enforcer/enforcer-94`
  - スペック表: あり（サイズ、ウエスト幅、サイドカット、ターン半径、重量、ファクトリーエッジ角度）
  - 製品数: 約28モデル（男性）
- **evo.com**: https://www.evo.com/shop/ski/skis/nordica
- **推奨元**: 公式（スペック表が非常に充実。サイズ別重量も記載）
- **備考**: WebFetch でアクセス可能。スクレイピング向き

### 2. Salomon

- **公式**: https://www.salomon.com/en-us
  - 一覧: `https://www.salomon.com/en-us/c/sports/alpine-skiing/skis`
  - 個別: `/en-us/product/{model-name}-{color}-{sku}` パターン
    - 例: `/en-us/product/qst-94-black-li8314`
  - スペック表: 公式サイトはスペック情報あり（サイズ、ディメンション、サイドカット半径、重量）
  - ただし WebFetch で 403 エラー（Cloudflare 等で保護）
- **evo.com**: https://www.evo.com/shop/ski/skis/salomon
- **推奨元**: evo.com（公式は WAF で保護されスクレイピング困難）
- **備考**: 公式サイトは 403 を返す。evo.com も 403。Blister 等のレビューサイトにスペック詳細あり

### 3. Atomic

- **公式**: https://www.atomic.com/en-us
  - 一覧: `https://www.atomic.com/en-us/shop/skis` （カテゴリ: `/en-us/collection-maverick-maven` 等）
  - 個別: `/en-us/shop/product/{model-name}-{sku}.html` パターン
    - 例: `/en-us/shop/product/maverick-96-cti-aa6983.html`
  - スペック表: あり（サイズ、ディメンション、サイドカット半径、重量）
  - ただし WebFetch で 403 エラー
- **evo.com**: https://www.evo.com/shop/ski/skis/atomic
- **推奨元**: evo.com（公式は 403 でスクレイピング困難）
- **備考**: 公式 PDF カタログあり（`atomic.com/sites/default/files/...pdf`）。PDF からのデータ抽出も選択肢

### 4. Volkl (Volkl)

- **公式**: https://volkl.com/en-us
  - 一覧: `https://volkl.com/en-us/c/skis/`（コレクション別: `/en-us/c/skis/mantra/` 等）
  - 個別: `/en-us/p/{model-name}-skis-{year}` パターン
    - 例: `/en-us/p/mantra-88-skis-2026`
  - スペック表: あり（公式サイト上にスペック情報が存在するが、WebFetch では CSS のみ取得。JS レンダリング必要）
- **evo.com**: https://www.evo.com/shop/ski/skis/vlkl （注意: slug が `vlkl`）
- **推奨元**: evo.com（公式は SPA で JS レンダリング必須、スクレイピング困難）
- **備考**: 公式サイトは JS レンダリング後にスペック表が表示される構造

### 5. HEAD

- **公式**: https://www.head.com/en_US
  - 一覧: `https://www.head.com/en_US/ski/skis.html`（カテゴリ: `.../skis/allmountain.html` 等）
  - 個別: `/en_US/product/{model-name}-{sku}-set` または `/{model-name}-{sku}-set.html` パターン
    - 例: `/en_US/product/kore-93-ti-w-315485-set`
  - スペック表: あり（サイズ、ディメンション、サイドカット半径、重量）
  - ただし WebFetch では CSS/JS のみ取得（JS レンダリング必要）
  - カタログブラウザ: https://catalog.head.com/
- **evo.com**: https://www.evo.com/shop/ski/skis/head
- **推奨元**: evo.com（公式は JS レンダリング必須でスクレイピング困難）
- **備考**: HEAD カタログブラウザ (catalog.head.com) も代替ソースとして検討可能

### 6. Blizzard

- **公式**: https://www.blizzard-tecnica.com/us/en
  - 一覧: `https://www.blizzard-tecnica.com/us/en/products-list/men/skis/all-mountain`（カテゴリ別）
  - 個別: `/us/en/collection/{gender}/skis/{collection}/{product-name}` パターン
    - 例: `/us/en/collection/men/skis/stormbird/stormbird-80-ti-tp11light-demo`
  - スペック表: あり（サイズ、ディメンション、サイドカット半径、重量）
  - WebFetch で一覧ページはアクセス可能（個別ページは 404 の場合あり、URL パターン要確認）
  - Issuu カタログ: https://issuu.com/blizzardtecnica/docs/blizzard_catalogue_fw_2025_241209_high_en
- **evo.com**: https://www.evo.com/shop/ski/skis/blizzard
- **推奨元**: 公式（一覧ページはスクレイピング可能。個別ページの URL パターン要検証）
- **備考**: Issuu 上の公式 PDF カタログもデータソースとして有用

### 7. K2

- **公式**: https://k2snow.com/en-us
  - 一覧: `https://k2snow.com/en-us/c/skis/`（コレクション別: `/en-us/c/skis/mindbender-skis/` 等）
  - 個別: `/en-us/p/{model-name}-{gender}-skis-{year}` パターン
    - 例: `/en-us/p/mindbender-85-mens-skis-2026`
  - スペック表: あり（公式サイト上にスペック情報が存在するが、WebFetch では CSS のみ取得。JS レンダリング必要）
- **evo.com**: https://www.evo.com/shop/ski/skis/k2
- **推奨元**: evo.com（公式は JS レンダリング必須）
- **備考**: K2 は skis と snowboards を同一ドメイン (k2snow.com) で提供

### 8. BLASTRACK

- **公式**: https://www.blastrack.jp/
  - 一覧: 製品ページは個別モデルごとにトップレベル URL
  - 個別: `/{model-name}/` パターン
    - 例: `/blazer/`, `/stylus/`, `/farther/`, `/versant/`, `/roc118/`, `/tour/`
  - スペック表: あり（サイズ、ディメンション（トップ-ウエスト-テール）、サイドカット半径、重量、価格）
    - 例: BLAZER: 130-97-117mm, 170cm/176cm/185cm, R=15.1m/16.5m/18.7m
    - 例: VERSANT: 133-103-120mm, 1,700g/半ペア (178cm)
  - WebFetch でアクセス可能
- **evo.com**: 取扱なし（日本国内ブランド）
- **推奨元**: 公式（唯一のソース。日本語ページ）
- **備考**: OGASAKA ファクトリーの日本製フリースキーブランド。evo.com 等の海外ショップでは取扱なし。公式サイトは比較的シンプルな HTML 構造でスクレイピングしやすい

---

## スノーボード

### 9. Burton

- **公式**: https://www.burton.com/us/en
  - 一覧: `https://www.burton.com/us/en/c/snowboarding-snowboards`（男性: `/c/explore-mens-snowboards` 等）
  - 個別: `/us/en/p/{product-name-slug}/{product-id}.html` パターン
    - 例: `/us/en/p/mens-burton-custom-x-camber-snowboard/W26-106891.html`
  - スペック表: あり（サイズ、有効エッジ、ウエスト幅、サイドカット半径、ノーズ/テール幅、重量レンジ、フレックス、コア素材）
  - WebFetch でアクセス可能。スペック非常に充実
- **evo.com**: https://www.evo.com/shop/snowboard/snowboards/burton
- **推奨元**: 公式（スペック表が最も充実。サイズ別の詳細データあり）
- **備考**: 全ブランド中最も詳細なスペック表を提供

### 10. Jones

- **公式**: https://www.jonessnowboards.com/
  - 一覧: `https://www.jonessnowboards.com/collections/mens-snowboards`（女性: `/collections/womens-snowboards`）
  - 個別: `/products/{product-slug}` パターン（Shopify ベース）
    - 例: `/products/men-flagship-snowboard-2025`, `/products/men-howler-snowboard-2026`
  - スペック表: 公式サイト上にスペック情報が存在するが、WebFetch では JS レンダリング後のデータ取得困難
  - ダウンロードページ: https://www.jonessnowboards.com/pages/downloads（カタログ PDF あり）
- **evo.com**: https://www.evo.com/shop/snowboard/snowboards/jones
- **推奨元**: evo.com（公式は JS レンダリング必須でスクレイピング困難）
- **備考**: 公式の Shopify ストアは JS 依存。PDF カタログも代替ソース

### 11. Lib Tech

- **公式**: https://www.lib-tech.com/
  - 一覧: `https://www.lib-tech.com/snowboard/mens-snowboards`（女性: `/snowboard/womens-snowboards`）
  - 個別: `/{model-name}` パターン（トップレベル）
    - 例: `/cold-brew`, `/t-rice-pro`, `/dynamo`, `/apex-orca`
  - スペック表: あり（サイズ、コンタクトレングス、サイドカット半径、ノーズ/テール幅、ウエスト幅、フレックス、重量レンジ）
  - WebFetch でアクセス可能。スペック充実
- **evo.com**: https://www.evo.com/shop/snowboard/snowboards/lib-tech
- **推奨元**: 公式（スペック表が充実。WebFetch で取得可能）
- **備考**: Mervin Manufacturing（GNU と同じ親会社）。Magne-Traction 等の独自技術情報も取得可能

### 12. GNU

- **公式**: https://www.gnu.com/
  - 一覧: `https://www.gnu.com/snowboards`
  - 個別: `/{model-name}` パターン（トップレベル）
    - 例: `/facts`, `/money`, `/riders-choice`, `/banked-country`
  - スペック表: あり（サイズ、コンタクトレングス、サイドカット半径、ノーズ/テール幅、ウエスト幅、フレックス、重量レンジ）
  - WebFetch でアクセス可能。スペック充実
- **evo.com**: https://www.evo.com/shop/snowboard/snowboards/gnu
- **推奨元**: 公式（スペック表が充実。Lib Tech と同様の構造）
- **備考**: Lib Tech と同じ Mervin Manufacturing。サイト構造も非常に似ている

### 13. CAPiTA

- **公式**: https://capitasnowboarding.com/
  - 一覧: `https://capitasnowboarding.com/pages/catalog`（男性: `/collections/mens-boards` 等）
  - 個別: `/products/{model-name}-{year}` パターン（Shopify ベース）
    - 例: `/products/doa-2026`, `/products/mercury-2026`, `/products/aeronaut-2026`
  - スペック表: 限定的（サイズ一覧あり。有効エッジ、ウエスト幅、サイドカット半径、重量はページ上で確認できず）
  - WebFetch では JS レンダリング後のスペック取得困難
- **evo.com**: https://www.evo.com/shop/snowboard/snowboards/capita
- **推奨元**: evo.com（公式のスペック表が不十分。evo.com の方が詳細スペックを掲載している可能性）
- **備考**: Shopify ベースで JS 依存。The MotherShip（オーストリア工場）で製造

### 14. Ride

- **公式**: https://ridesnowboards.com/en-us
  - 一覧: `https://ridesnowboards.com/en-us/c/snowboards/`
  - 個別: `/en-us/p/{model-name}-snowboard-{year}` パターン
    - 例: `/en-us/p/warpig-snowboard-2526`, `/en-us/p/lowride-snowboard-2026`
  - スペック表: あり（公式サイト上にスペック情報が存在するが、WebFetch では CSS のみ取得。JS レンダリング必要）
- **evo.com**: https://www.evo.com/shop/snowboard/snowboards/ride
- **推奨元**: evo.com（公式は JS レンダリング必須でスクレイピング困難）
- **備考**: K2 と同じ親会社。サイト構造も k2snow.com と類似（JS レンダリング依存）

### 15. YES.

- **公式**: https://yessnowboards.com/
  - 一覧: `https://yessnowboards.com/collections/mens-snowboards`（25/26コレクション: `/collections/2026-new-collection`）
  - 個別: `/products/{model-name}` パターン（Shopify ベース）
    - 例: `/products/standard-2025`, `/products/greats`, `/products/basic`, `/products/all-in`
  - スペック表: あり（公式サイト上にスペック情報あり。サイズ、エッジ長、ウエスト幅等）
  - WebFetch でのアクセスに一部制限あり
- **evo.com**: https://www.evo.com/shop/snowboard/snowboards/yes
- **推奨元**: 公式 + evo.com 併用（公式は Shopify で比較的スクレイピングしやすいが、一部ページでアクセス制限）
- **備考**: Shopify ベースのストア

### 16. Nitro

- **公式**: https://www.nitrosnowboards.com/
  - 一覧: `https://www.nitrosnowboards.com/collections/snowboards`（男性: `/collections/mens-snowboards` 等）
  - 個別: `/products/{model-name}-snowboard` パターン
    - 例: `/products/team-snowboard`, `/products/phase-snowboard`, `/products/alternator-snowboard`
  - スペック表: あり（サイズ、ノーズ/テール幅、ウエスト幅、ランニングレングス、フレックス、シェイプ、キャンバー）
  - WebFetch でアクセス可能
- **evo.com**: https://www.evo.com/shop/snowboard/snowboards/nitro
- **推奨元**: 公式（スペック表あり。WebFetch で取得可能）
- **備考**: 一部スペック（有効エッジ長、サイドカット半径）はトランケートされている可能性。evo.com との併用推奨

---

## まとめ: スクレイピング難易度・推奨元一覧

| # | ブランド | 推奨元 | スクレイピング難易度 | スペック充実度 | 備考 |
|---|---------|--------|-------------------|-------------|------|
| 1 | Nordica | 公式 | 低（WebFetch 可） | ★★★★★ | サイズ別重量まで記載 |
| 2 | Salomon | evo.com | 高（403） | ★★★★☆ | 公式は WAF 保護 |
| 3 | Atomic | evo.com | 高（403） | ★★★★☆ | PDF カタログも選択肢 |
| 4 | Volkl | evo.com | 中（JS 必須） | ★★★★☆ | SPA 構造 |
| 5 | HEAD | evo.com | 中（JS 必須） | ★★★★☆ | catalog.head.com も検討 |
| 6 | Blizzard | 公式 | 低〜中 | ★★★★☆ | Issuu カタログも有用 |
| 7 | K2 | evo.com | 中（JS 必須） | ★★★★☆ | SPA 構造 |
| 8 | BLASTRACK | 公式 | 低（WebFetch 可） | ★★★☆☆ | 日本語のみ。evo 取扱なし |
| 9 | Burton | 公式 | 低（WebFetch 可） | ★★★★★ | 最も詳細なスペック表 |
| 10 | Jones | evo.com | 中（JS 必須） | ★★★★☆ | PDF カタログも選択肢 |
| 11 | Lib Tech | 公式 | 低（WebFetch 可） | ★★★★★ | スペック表充実 |
| 12 | GNU | 公式 | 低（WebFetch 可） | ★★★★★ | Lib Tech と同構造 |
| 13 | CAPiTA | evo.com | 中（JS 必須） | ★★★☆☆ | スペック表が限定的 |
| 14 | Ride | evo.com | 中（JS 必須） | ★★★★☆ | K2 と同系列 |
| 15 | YES. | 公式 + evo | 中 | ★★★★☆ | Shopify ベース |
| 16 | Nitro | 公式 | 低（WebFetch 可） | ★★★★☆ | 一部スペック欠落の可能性 |

## evo.com の URL パターン（フォールバック用）

- **スキー**: `https://www.evo.com/shop/ski/skis/{brand-slug}`
- **スノーボード**: `https://www.evo.com/shop/snowboard/snowboards/{brand-slug}`
- **個別商品**: `https://www.evo.com/skis/{brand}-{model}` または `https://www.evo.com/snowboards/{brand}-{model}-snowboard`

### evo.com ブランド slug 一覧

| ブランド | slug |
|---------|------|
| Nordica | `nordica` |
| Salomon | `salomon` |
| Atomic | `atomic` |
| Volkl | `vlkl` |
| HEAD | `head` |
| Blizzard | `blizzard` |
| K2 | `k2` |
| Burton | `burton` |
| Jones | `jones` |
| Lib Tech | `lib-tech` |
| GNU | `gnu` |
| CAPiTA | `capita` |
| Ride | `ride` |
| YES. | `yes` |
| Nitro | `nitro` |
| BLASTRACK | 取扱なし |

## 注意事項

1. **evo.com はスクレイピング制限あり**: WebFetch で 403 を返すケースがある。ヘッドレスブラウザ（Playwright 等）の使用が必要になる可能性
2. **JS レンダリング必須のサイト**: Salomon, Atomic, Volkl, HEAD, K2, Jones, CAPiTA, Ride は SPA / JS レンダリング後にスペックデータが表示される構造。Playwright 等のヘッドレスブラウザが必要
3. **WebFetch で直接スクレイピング可能**: Nordica, Blizzard（一覧）, BLASTRACK, Burton, Lib Tech, GNU, Nitro
4. **BLASTRACK は日本語のみ**: i18n 対応が必要。他のブランドは英語（en-US）で統一可能
5. **年度によって URL が変わる**: 多くのブランドで URL に年度（2026, 2526 等）が含まれるため、シーズンごとの更新が必要
