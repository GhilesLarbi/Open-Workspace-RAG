from pydantic import BaseModel, Field
from typing import List, Optional, Union, Literal
from app.schemas.enums import LanguageEnum

#######################################################################
#######################################################################
class URLFilterRule(BaseModel):
    type: Literal["url"] = "url"
    patterns: List[str]
    reverse: bool = False

class DomainFilterRule(BaseModel):
    type: Literal["domain"] = "domain"
    allowed: List[str] = Field(default_factory=list)
    blocked: List[str] = Field(default_factory=list)

class SEOFilterRule(BaseModel):
    type: Literal["seo"] = "seo"
    keywords: List[str]
    threshold: float = 0.5

class RelevanceFilterRule(BaseModel):
    type: Literal["relevance"] = "relevance"
    query: str
    threshold: float = 0.7

FilterRule = Union[URLFilterRule, DomainFilterRule, SEOFilterRule, RelevanceFilterRule]

class CrawlingConfig(BaseModel):
    max_depth: int = Field(default=1, ge=1)
    max_pages: int = Field(default=10, ge=1)
    filters: List[FilterRule] = Field(default_factory=list)
    
class FilteringConfig(BaseModel):
    word_count_threshold: int = Field(default=0, ge=0)
    languages: Optional[List[LanguageEnum]] = Field(default=None)

class FormatingConfig(BaseModel):
    user_query: Optional[str] = Field(default=None)
    min_word_threshold: int = Field(default=5)
    threshold_type: Literal["fixed", "dynamic"] = Field(default="fixed")
    threshold: float = Field(default=0.2, ge=0.0, le=1.0)
    ignore_links: bool = True
    ignore_images: bool = True
    skip_internal_links: bool = True

class JobConfig(BaseModel):
    url: str
    crawling: Optional[CrawlingConfig] = None
    filtering: FilteringConfig = Field(default_factory=FilteringConfig)
    formating: FormatingConfig = Field(default_factory=FormatingConfig)

#######################################################################
#######################################################################
class JobPageResult(BaseModel):
    url: str
    title: Optional[str] = None
    reason: Optional[str] = None
    error: Optional[str] = None

class JobSummary(BaseModel):
    total: int = 0
    succeeded: int = 0
    failed: int = 0
    skipped: int = 0

class JobResult(BaseModel):
    failed: List[JobPageResult] = Field(default_factory=list)
    skipped: List[JobPageResult] = Field(default_factory=list)
    summary: JobSummary = Field(default_factory=JobSummary)