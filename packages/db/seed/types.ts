export type SeedBrand = {
  brand: {
    id: string;
    name: string;
    slug: string;
    country: string;
    websiteUrl: string;
    description?: string;
  };
  categories: Array<{
    id: string;
    sport: "ski" | "snowboard";
    name: string;
    slug: string;
    displayOrder: number;
  }>;
  models: Array<{
    id: string;
    categorySlug: string;
    name: string;
    slug: string;
    sport: "ski" | "snowboard";
    level: string;
    season: string;
    msrpJpy?: number;
    sourceUrl?: string;
    description?: string;
    specs: {
      id: string;
      // ski
      rockerType?: string;
      tailType?: string;
      coreMaterial?: string;
      baseMaterial?: string;
      sidewall?: string;
      // snowboard
      shape?: string;
      bendProfile?: string;
      flexRating?: number;
      mounting?: string;
      setbackMm?: number;
    };
    sizes: Array<{
      id: string;
      lengthCm: number;
      waistWidthMm?: number;
      noseWidthMm?: number;
      tailWidthMm?: number;
      sidecutRadiusM?: number;
      weightG?: number;
      displayOrder: number;
    }>;
  }>;
};
