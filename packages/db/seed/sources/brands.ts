import type { BrandSource } from "./types.ts";

/**
 * All brand scraping configurations.
 *
 * Each entry defines:
 * - Official product page URLs (primary source)
 * - evo.com URLs (fallback when official is JS-rendered / WAF-blocked)
 * - Which source to prefer
 *
 * To add a new brand:
 * 1. Add an entry here with product URLs
 * 2. Run: pnpm --filter db scrape --brand <slug>
 * 3. Run: /seed-brand <BrandName> (Claude Code command to parse markdown → JSON)
 * 4. Run: pnpm --filter db seed --brand <slug>
 */
export const brands: Record<string, BrandSource> = {
  // ── Ski ──────────────────────────────────────────

  nordica: {
    brand: {
      name: "Nordica",
      slug: "nordica",
      country: "IT",
      websiteUrl: "https://www.nordica.com",
      description: "イタリアの老舗スキーブランド。Enforcerシリーズはオールマウンテンの定番。",
    },
    sport: "ski",
    season: "2025-2026",
    prefer: "official",
    productUrls: [
      "https://www.nordica.com/usa/en/collection/men/skis/enforcer/enforcer-89",
      "https://www.nordica.com/usa/en/collection/men/skis/enforcer/enforcer-94",
      "https://www.nordica.com/usa/en/collection/men/skis/enforcer/enforcer-99",
      "https://www.nordica.com/usa/en/collection/men/skis/enforcer/enforcer-104",
    ],
    evoUrls: [
      "https://www.evo.com/skis/nordica-enforcer-89",
      "https://www.evo.com/skis/nordica-enforcer-94",
      "https://www.evo.com/skis/nordica-enforcer-99",
      "https://www.evo.com/skis/nordica-enforcer-104-free",
    ],
  },

  salomon: {
    brand: {
      name: "Salomon",
      slug: "salomon",
      country: "FR",
      websiteUrl: "https://www.salomon.com",
      description: "フランス発の総合ウィンタースポーツブランド。QSTシリーズが人気。",
    },
    sport: "ski",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [],
    evoUrls: [
      "https://www.evo.com/skis/salomon-qst-92",
      "https://www.evo.com/skis/salomon-qst-98",
      "https://www.evo.com/skis/salomon-qst-106",
      "https://www.evo.com/skis/salomon-stance-96",
      "https://www.evo.com/skis/salomon-stance-102",
    ],
  },

  atomic: {
    brand: {
      name: "Atomic",
      slug: "atomic",
      country: "AT",
      websiteUrl: "https://www.atomic.com",
      description: "オーストリアのスキーブランド。Maverickシリーズがオールマウンテンの主力。",
    },
    sport: "ski",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [
      "https://www.atomic.com/en-us/shop/product/maverick-96-cti-aa7355.html",
      "https://www.atomic.com/en-us/shop/product/maverick-105-cti-aa7353.html",
      "https://www.atomic.com/en-us/shop/product/bent-chetler-120-aa7364.html",
    ],
    evoUrls: [
      "https://www.evo.com/skis/atomic-maverick-86-c",
      "https://www.evo.com/skis/atomic-maverick-96-cti",
      "https://www.evo.com/skis/atomic-maverick-100-ti",
      "https://www.evo.com/skis/atomic-bent-100",
      "https://www.evo.com/skis/atomic-bent-110",
    ],
  },

  volkl: {
    brand: {
      name: "Völkl",
      slug: "volkl",
      country: "DE",
      websiteUrl: "https://volkl.com",
      description: "ドイツの老舗スキーブランド。MantraとKenjaシリーズが定番。",
    },
    sport: "ski",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [
      "https://volkl.com/en-us/p/mantra-88-skis-2026",
      "https://volkl.com/en-us/p/mantra-108-skis-2026",
      "https://volkl.com/en-us/p/blaze-104-purple-skis-2026",
    ],
    evoUrls: [
      "https://www.evo.com/skis/volkl-mantra-88",
      "https://www.evo.com/skis/volkl-m7-mantra",
      "https://www.evo.com/skis/volkl-blaze-104",
    ],
  },

  head: {
    brand: {
      name: "HEAD",
      slug: "head",
      country: "AT",
      websiteUrl: "https://www.head.com",
      description: "オーストリアのスポーツブランド。KoreシリーズとOblivionシリーズが主力。",
    },
    sport: "ski",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [
      "https://www.head.com/en_US/product/kore-94-ti-315445-set",
      "https://www.head.com/en_US/product/kore-106-ti-315425-set",
      "https://www.head.com/en_US/product/oblivion-94-315514-set",
      "https://www.head.com/en_US/product/oblivion-102-315585-set",
    ],
    evoUrls: [
      "https://www.evo.com/skis/head-kore-93",
      "https://www.evo.com/skis/head-kore-99",
      "https://www.evo.com/skis/head-kore-105",
    ],
  },

  blizzard: {
    brand: {
      name: "Blizzard",
      slug: "blizzard",
      country: "AT",
      websiteUrl: "https://www.blizzard-tecnica.com",
      description: "オーストリアのスキーブランド。Rustler、Bonafide等が人気。",
    },
    sport: "ski",
    season: "2025-2026",
    prefer: "official",
    productUrls: [
      "https://www.blizzard-tecnica.com/us/en/collection/men/skis/rustler/rustler-9-flat-2",
      "https://www.blizzard-tecnica.com/us/en/collection/men/skis/rustler/rustler-11-flat",
      "https://www.blizzard-tecnica.com/us/en/collection/men/skis/anomaly/anomaly-86-flat-2",
      "https://www.blizzard-tecnica.com/us/en/collection/men/skis/anomaly/anomaly-98-flat",
    ],
    evoUrls: [
      "https://www.evo.com/skis/blizzard-rustler-9",
      "https://www.evo.com/skis/blizzard-rustler-11",
      "https://www.evo.com/skis/blizzard-anomaly-94",
    ],
  },

  k2: {
    brand: {
      name: "K2",
      slug: "k2",
      country: "US",
      websiteUrl: "https://k2snow.com",
      description: "アメリカのスキー・スノーボードブランド。Mindbenderシリーズが主力。",
    },
    sport: "ski",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [
      "https://k2snow.com/en-us/p/mindbender-89ti-mens-skis-2026",
      "https://k2snow.com/en-us/p/mindbender-96c-mens-skis-2026",
      "https://k2snow.com/en-us/p/mindbender-106c-mens-skis-2026",
      "https://k2snow.com/en-us/p/reckoner-102-mens-skis-2026",
    ],
    evoUrls: [
      "https://www.evo.com/skis/k2-mindbender-89ti",
      "https://www.evo.com/skis/k2-mindbender-96c",
      "https://www.evo.com/skis/k2-mindbender-106c",
      "https://www.evo.com/skis/k2-reckoner-102",
    ],
  },

  blastrack: {
    brand: {
      name: "BLASTRACK",
      slug: "blastrack",
      country: "JP",
      websiteUrl: "https://www.blastrack.jp",
      description: "OGASAKAファクトリー製の日本製フリースキーブランド。",
    },
    sport: "ski",
    season: "2025-2026",
    prefer: "official",
    productUrls: [
      "https://www.blastrack.jp/blazer/",
      "https://www.blastrack.jp/stylus/",
      "https://www.blastrack.jp/farther/",
      "https://www.blastrack.jp/versant/",
      "https://www.blastrack.jp/elixire/",
      "https://www.blastrack.jp/improve90/",
    ],
  },

  // ── Snowboard ───────────────────────────────────

  burton: {
    brand: {
      name: "Burton",
      slug: "burton",
      country: "US",
      websiteUrl: "https://www.burton.com",
      description: "スノーボードの創始者的ブランド。Channelマウントシステムを採用。",
    },
    sport: "snowboard",
    season: "2025-2026",
    prefer: "official",
    productUrls: [
      "https://www.burton.com/us/en/p/mens-burton-custom-camber-snowboard/W26-106881.html",
      "https://www.burton.com/us/en/p/burton-process-flying-v-snowboard/W25-107131.html",
      "https://www.burton.com/us/en/p/burton-deep-thinker-snowboard/W25-106961.html",
      "https://www.burton.com/us/en/p/burton-cartographer-snowboard/W25-107151.html",
    ],
    evoUrls: [
      "https://www.evo.com/snowboards/burton-custom",
      "https://www.evo.com/snowboards/burton-process",
    ],
  },

  jones: {
    brand: {
      name: "Jones",
      slug: "jones",
      country: "US",
      websiteUrl: "https://www.jonessnowboards.com",
      description: "バックカントリー志向のスノーボードブランド。Jeremy Jones が設立。",
    },
    sport: "snowboard",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [
      "https://www.jonessnowboards.com/products/men-flagship-snowboard-2025",
      "https://www.jonessnowboards.com/products/men-mountain-twin-snowboard-2025",
      "https://www.jonessnowboards.com/products/stratos-snowboard",
    ],
    evoUrls: [
      "https://www.evo.com/snowboards/jones-flagship",
      "https://www.evo.com/snowboards/jones-mountain-twin",
      "https://www.evo.com/snowboards/jones-frontier",
      "https://www.evo.com/snowboards/jones-stratos",
    ],
  },

  "lib-tech": {
    brand: {
      name: "Lib Tech",
      slug: "lib-tech",
      country: "US",
      websiteUrl: "https://www.lib-tech.com",
      description: "Mervin Manufacturing製。Magne-Tractionエッジ技術で知られる。",
    },
    sport: "snowboard",
    season: "2025-2026",
    prefer: "official",
    productUrls: [
      "https://www.lib-tech.com/cold-brew",
      "https://www.lib-tech.com/t-rice-pro",
      "https://www.lib-tech.com/dynamo",
      "https://www.lib-tech.com/orca",
      "https://www.lib-tech.com/skunk-ape",
    ],
    evoUrls: [
      "https://www.evo.com/snowboards/lib-tech-cold-brew",
      "https://www.evo.com/snowboards/lib-tech-t-rice-pro",
    ],
  },

  gnu: {
    brand: {
      name: "GNU",
      slug: "gnu",
      country: "US",
      websiteUrl: "https://www.gnu.com",
      description: "Mervin Manufacturing傘下。Magne-Tractionとエコフレンドリーな製造で知られる。",
    },
    sport: "snowboard",
    season: "2025-2026",
    prefer: "official",
    productUrls: [
      "https://www.gnu.com/riders-choice",
      "https://www.gnu.com/money",
      "https://www.gnu.com/facts",
      "https://www.gnu.com/banked-country",
    ],
    evoUrls: [
      "https://www.evo.com/snowboards/gnu-riders-choice-asym-c2x",
      "https://www.evo.com/snowboards/gnu-money-c2e",
    ],
  },

  capita: {
    brand: {
      name: "CAPiTA",
      slug: "capita",
      country: "AT",
      websiteUrl: "https://capitasnowboarding.com",
      description: "オーストリアのThe Mothership工場で製造。DOAシリーズが人気。",
    },
    sport: "snowboard",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [
      "https://capitasnowboarding.com/products/doa-2026",
      "https://capitasnowboarding.com/products/mercury-2026",
      "https://capitasnowboarding.com/products/mega-mercury-2026",
    ],
    evoUrls: [
      "https://www.evo.com/snowboards/capita-defenders-of-awesome",
      "https://www.evo.com/snowboards/capita-mercury",
      "https://www.evo.com/snowboards/capita-super-doa",
      "https://www.evo.com/snowboards/capita-outerspace-living",
    ],
  },

  ride: {
    brand: {
      name: "Ride",
      slug: "ride",
      country: "US",
      websiteUrl: "https://ridesnowboards.com",
      description: "K2と同グループのスノーボードブランド。Warpigが代表作。",
    },
    sport: "snowboard",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [
      "https://ridesnowboards.com/en-us/p/warpig-snowboard-2526",
      "https://ridesnowboards.com/en-us/p/algorythm-snowboard-2526",
      "https://ridesnowboards.com/en-us/p/berzerker-snowboard-2526",
    ],
    evoUrls: [
      "https://www.evo.com/snowboards/ride-warpig",
      "https://www.evo.com/snowboards/ride-algorythm",
      "https://www.evo.com/snowboards/ride-berzerker",
      "https://www.evo.com/snowboards/ride-shadowban",
      "https://www.evo.com/snowboards/ride-superpig",
    ],
  },

  yes: {
    brand: {
      name: "YES.",
      slug: "yes",
      country: "AT",
      websiteUrl: "https://yessnowboards.com",
      description: "オーストリアのスノーボードブランド。UnderBiteエッジ技術が特徴。",
    },
    sport: "snowboard",
    season: "2025-2026",
    prefer: "evo",
    productUrls: [
      "https://yessnowboards.com/products/standard-2025",
      "https://yessnowboards.com/products/greats",
      "https://yessnowboards.com/products/basic",
    ],
    evoUrls: [
      "https://www.evo.com/snowboards/yes-standard",
      "https://www.evo.com/snowboards/yes-greats",
      "https://www.evo.com/snowboards/yes-typo",
      "https://www.evo.com/snowboards/yes-optimistic",
    ],
  },

  nitro: {
    brand: {
      name: "Nitro",
      slug: "nitro",
      country: "US",
      websiteUrl: "https://www.nitrosnowboards.com",
      description: "1990年設立のスノーボード専業ブランド。Teamシリーズが定番。",
    },
    sport: "snowboard",
    season: "2025-2026",
    prefer: "official",
    productUrls: [
      "https://www.nitrosnowboards.com/products/team-snowboard",
      "https://www.nitrosnowboards.com/products/team-pro-snowboard",
      "https://www.nitrosnowboards.com/products/squash-snowboard",
      "https://www.nitrosnowboards.com/products/alternator-snowboard",
    ],
    evoUrls: [
      "https://www.evo.com/snowboards/nitro-team",
      "https://www.evo.com/snowboards/nitro-team-pro",
    ],
  },
};
