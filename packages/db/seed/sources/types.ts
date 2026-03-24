export type Sport = "ski" | "snowboard";

export type BrandSource = {
  brand: {
    name: string;
    slug: string;
    country: string;
    websiteUrl: string;
    description: string;
  };
  sport: Sport;
  season: string;
  /** Primary source: official website product URLs */
  productUrls: string[];
  /** Fallback: evo.com product URLs (used when official site lacks spec tables) */
  evoUrls?: string[];
  /** Which source to prefer: "official" tries productUrls first, "evo" tries evoUrls first */
  prefer: "official" | "evo";
};
