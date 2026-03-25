import { generateAffiliateLinks, type AffiliateConfig, type AffiliateLink } from "shared";
import { env } from "cloudflare:workers";

type ModelInfo = {
  brandName: string;
  name: string;
  season: string;
  sport: string;
};

function getConfig(): AffiliateConfig {
  const e = env as Record<string, string | undefined>;
  return {
    amazonTag: e.AMAZON_ASSOCIATE_TAG || import.meta.env.AMAZON_ASSOCIATE_TAG || undefined,
    rakutenAffiliateId: e.RAKUTEN_AFFILIATE_ID || import.meta.env.RAKUTEN_AFFILIATE_ID || undefined,
    yahooSid: e.YAHOO_VC_SID || import.meta.env.YAHOO_VC_SID || undefined,
    yahooPid: e.YAHOO_VC_PID || import.meta.env.YAHOO_VC_PID || undefined,
  };
}

export function getAffiliateLinks(model: ModelInfo): AffiliateLink[] {
  return generateAffiliateLinks(getConfig(), model);
}
