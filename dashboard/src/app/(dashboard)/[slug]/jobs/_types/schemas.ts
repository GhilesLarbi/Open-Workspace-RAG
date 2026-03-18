// src/app/(dashboard)/[slug]/jobs/_types/schemas.ts
import * as z from "zod";
import { LanguageEnum } from "./index";

// --- Filters ---
export const urlFilterRuleSchema = z.object({
  type: z.literal("url"),
  patterns: z.array(z.string()).min(1, "At least one pattern is required"),
  reverse: z.boolean().default(false),
});

export const domainFilterRuleSchema = z.object({
  type: z.literal("domain"),
  allowed: z.array(z.string()).default([]),
  blocked: z.array(z.string()).default([]),
});

export const seoFilterRuleSchema = z.object({
  type: z.literal("seo"),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  threshold: z.number().min(0).max(1).default(0.5),
});

export const relevanceFilterRuleSchema = z.object({
  type: z.literal("relevance"),
  query: z.string().min(1, "Query is required"),
  threshold: z.number().min(0).max(1).default(0.7),
});

export const filterRuleSchema = z.discriminatedUnion("type", [
  urlFilterRuleSchema,
  domainFilterRuleSchema,
  seoFilterRuleSchema,
  relevanceFilterRuleSchema,
]);

// --- Configurations ---
export const crawlingConfigSchema = z.object({
  max_depth: z.number().int().min(1).default(1),
  max_pages: z.number().int().min(1).default(10),
  filters: z.array(filterRuleSchema).default([]),
});

export const filteringConfigSchema = z.object({
  word_count_threshold: z.number().int().min(0).default(0),
  languages: z.array(z.nativeEnum(LanguageEnum)).nullable().default(null),
});



const DEFAULT_EXCLUDED_TAGS = [
  "nav", "footer", "aside", "header", 
  "#footer", ".footer", "#header", ".header", 
  ".copyright", ".cookie-banner", "#cookie-banner",
  ".sidebar", "#sidebar", ".menu", "#menu"
];


export const formatingConfigSchema = z.object({
  user_query: z.string().nullable().default(null),
  min_word_threshold: z.number().int().default(5),
  threshold_type: z.enum(["fixed", "dynamic"]).default("fixed"),
  threshold: z.number().min(0.0).max(1.0).default(0.2),
  ignore_links: z.boolean().default(true),
  ignore_images: z.boolean().default(true),
  skip_internal_links: z.boolean().default(true),
  excluded_tags: z.array(z.string()).default(DEFAULT_EXCLUDED_TAGS),
});

// --- Main Job Config ---
export const jobConfigSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  crawling: crawlingConfigSchema.nullable().default(null),
  filtering: filteringConfigSchema.default({ word_count_threshold: 0, languages: null }),
  formating: formatingConfigSchema.default({
    user_query: null,
    min_word_threshold: 5,
    threshold_type: "fixed",
    threshold: 0.2,
    ignore_links: true,
    ignore_images: true,
    skip_internal_links: true,
    excluded_tags: DEFAULT_EXCLUDED_TAGS,
  }),
});

export type JobConfigValues = z.infer<typeof jobConfigSchema>;