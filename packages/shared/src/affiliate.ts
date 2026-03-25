export type AffiliateLink = {
  provider: string;
  label: string;
  url: string;
};

export type AffiliateConfig = {
  amazonTag?: string;
  rakutenAffiliateId?: string;
  rakutenMeasurementId?: string;
  yahooPid?: string;
  yahooSid?: string;
};

type ModelInfo = {
  brandName: string;
  name: string;
  season: string;
  sport: string;
};

function buildQuery(model: ModelInfo): string {
  const sportLabel = model.sport === "snowboard" ? "スノーボード" : "スキー板";
  return `${model.brandName} ${model.name} ${model.season} ${sportLabel}`;
}

export function generateAffiliateLinks(config: AffiliateConfig, model: ModelInfo): AffiliateLink[] {
  const query = buildQuery(model);
  const encoded = encodeURIComponent(query);
  const links: AffiliateLink[] = [];

  if (config.amazonTag) {
    links.push({
      provider: "amazon_jp",
      label: "Amazon",
      url: `https://www.amazon.co.jp/s?k=${encoded}&tag=${encodeURIComponent(config.amazonTag)}`,
    });
  }

  if (config.rakutenAffiliateId) {
    const measurementPath = config.rakutenMeasurementId ? `/${config.rakutenMeasurementId}` : "";
    const searchUrl = `https://search.rakuten.co.jp/search/mall/${encoded}/`;
    links.push({
      provider: "rakuten",
      label: "楽天市場",
      url: `https://hb.afl.rakuten.co.jp/ichiba/${config.rakutenAffiliateId}${measurementPath}?pc=${encodeURIComponent(searchUrl)}&link_type=hybrid_url`,
    });
  }

  if (config.yahooSid && config.yahooPid) {
    const searchUrl = `https://shopping.yahoo.co.jp/search?p=${encoded}`;
    links.push({
      provider: "yahoo",
      label: "Yahoo!",
      url: `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${encodeURIComponent(config.yahooSid)}&pid=${encodeURIComponent(config.yahooPid)}&vc_url=${encodeURIComponent(searchUrl)}`,
    });
  }

  return links;
}
