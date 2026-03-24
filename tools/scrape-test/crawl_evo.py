"""
crawl4ai でスキースペックページをスクレイピングするテスト。
evo.com の Nordica Enforcer 100 ページからスペック表を抽出する。
"""

import asyncio
import json
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy

TARGET_URL = "https://www.evo.com/skis/nordica-enforcer-100"

# evo.com のスペック表を CSS セレクタで抽出するスキーマ
spec_schema = {
    "name": "Ski Specs",
    "baseSelector": "div.pdp-spec-item, div.tech-spec-row, tr",
    "fields": [
        {"name": "label", "selector": "td:first-child, span:first-child, dt", "type": "text"},
        {"name": "value", "selector": "td:last-child, span:last-child, dd", "type": "text"},
    ],
}


async def main():
    browser_config = BrowserConfig(headless=True)

    # まず Markdown でスペック周辺を確認
    run_config = CrawlerRunConfig(
        word_count_threshold=10,
        css_selector="[class*='spec'], [class*='tech'], [class*='detail'], [class*='size']",
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=TARGET_URL, config=run_config)

        if not result.success:
            print(f"Failed: {result.error_message}")
            return

        print("=== Filtered Markdown (specs/tech sections) ===")
        print(result.markdown[:5000])
        print(f"\n=== Total length: {len(result.markdown)} chars ===")

        # 構造化抽出も試す
        run_config_json = CrawlerRunConfig(
            extraction_strategy=JsonCssExtractionStrategy(spec_schema),
        )
        result2 = await crawler.arun(url=TARGET_URL, config=run_config_json)

        if result2.extracted_content:
            data = json.loads(result2.extracted_content)
            print("\n=== Structured extraction ===")
            for item in data[:20]:
                if item.get("label") and item.get("value"):
                    print(f"  {item['label']}: {item['value']}")


if __name__ == "__main__":
    asyncio.run(main())
