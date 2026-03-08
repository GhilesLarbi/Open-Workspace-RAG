from typing import List, Optional
import trafilatura

from crawl4ai import (
    AsyncWebCrawler, CrawlerRunConfig, DefaultMarkdownGenerator, 
    PruningContentFilter, BFSDeepCrawlStrategy, CacheMode, 
    LXMLWebScrapingStrategy, CrawlResult, BrowserConfig
)

################################################################################
################################################################################
def get_browser_config() -> BrowserConfig:
    return BrowserConfig(
        browser_type="chromium",
        cdp_url="ws://browser:3000", 
        verbose=False
    )

################################################################################
################################################################################
def get_run_config(deep_crawl: bool = False, depth: int = 1, max_pages: int = 1) -> CrawlerRunConfig:
    strategy = None
    if deep_crawl:
        strategy = BFSDeepCrawlStrategy(
            max_depth=depth, 
            include_external=False, 
            max_pages=max_pages
        )

    return CrawlerRunConfig(
        deep_crawl_strategy=strategy,
        markdown_generator=DefaultMarkdownGenerator(
            content_filter=PruningContentFilter(
                threshold=0.2, 
                threshold_type="static", 
                min_word_threshold=5
            ),
            options={
                "ignore_links": True, 
                "ignore_images": True, 
                "skip_internal_links": True
            }
        ),
        scraping_strategy=LXMLWebScrapingStrategy(),
        cache_mode=CacheMode.BYPASS,
        verbose=True
    )

################################################################################
################################################################################
async def scrape_single_page(url: str) -> CrawlResult:
    async with AsyncWebCrawler(config=get_browser_config()) as crawler:
        return await crawler.arun(
            url=url, 
            config=get_run_config(deep_crawl=False)
        )

################################################################################
################################################################################
async def scrape_deep_crawl(url: str, depth: int, max_pages: int) -> List[CrawlResult]:
    async with AsyncWebCrawler(config=get_browser_config()) as crawler:
        result = await crawler.arun(
            url=url, 
            config=get_run_config(deep_crawl=True, depth=depth, max_pages=max_pages)
        )
        return result if isinstance(result, list) else [result]

################################################################################
################################################################################
def extract_markdown(html: str) -> Optional[str]:
    return trafilatura.extract(
        html, 
        output_format='markdown',
        include_links=False,
        include_images=False,
        include_tables=True,
        no_fallback=False
    )