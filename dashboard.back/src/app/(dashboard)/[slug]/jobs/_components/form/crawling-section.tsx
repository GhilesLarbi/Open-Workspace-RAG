"use client";

import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Globe, Shield, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { JobConfigValues } from "../../_types/schemas";

const FILTER_ICONS = {
  url: Globe,
  domain: Shield,
  seo: Search,
  relevance: Sparkles,
};

const FILTER_LABELS = {
  url: "URL Pattern",
  domain: "Domain",
  seo: "SEO Keywords",
  relevance: "Relevance",
};

const FILTER_DESCRIPTIONS = {
  url: "Filter pages by URL patterns (supports wildcards)",
  domain: "Allow or block specific domains",
  seo: "Filter by keyword relevance scoring",
  relevance: "Filter by semantic similarity to a query",
};

function URLFilterFields({ index }: { index: number }) {
  const { control, watch, setValue } = useFormContext<JobConfigValues>();
  const patterns = (watch(`crawling.filters.${index}.patterns`) as string[] | undefined) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-8">
        {patterns.map((p, i) => (
          <Badge key={i} variant="secondary" className="gap-1.5 pr-1">
            {p}
            <button
              type="button"
              onClick={() => {
                const updated = [...patterns];
                updated.splice(i, 1);
                setValue(`crawling.filters.${index}.patterns`, updated);
              }}
              className="hover:text-destructive transition-colors ml-0.5 cursor-pointer"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="e.g. /blog/*, /docs/** — press Enter to add"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) {
                setValue(`crawling.filters.${index}.patterns`, [...patterns, val]);
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
          className="text-sm"
        />
        <Controller
          name={`crawling.filters.${index}.reverse`}
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2 shrink-0">
              <Switch checked={!!field.value} onCheckedChange={field.onChange} id={`reverse-${index}`} />
              <label htmlFor={`reverse-${index}`} className="text-sm text-muted-foreground whitespace-nowrap cursor-pointer">
                Reverse
              </label>
            </div>
          )}
        />
      </div>
      <FieldDescription>Press Enter to add a pattern.</FieldDescription>
    </div>
  );
}

function DomainFilterFields({ index }: { index: number }) {
  const { watch, setValue } = useFormContext<JobConfigValues>();
  const allowed = (watch(`crawling.filters.${index}.allowed`) as string[] | undefined) ?? [];
  const blocked = (watch(`crawling.filters.${index}.blocked`) as string[] | undefined) ?? [];

  const addToList = (list: "allowed" | "blocked", value: string) => {
    const current = list === "allowed" ? allowed : blocked;
    setValue(`crawling.filters.${index}.${list}`, [...current, value]);
  };

  const removeFromList = (list: "allowed" | "blocked", i: number) => {
    const current = list === "allowed" ? [...allowed] : [...blocked];
    current.splice(i, 1);
    setValue(`crawling.filters.${index}.${list}`, current);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {(["allowed", "blocked"] as const).map((listType) => {
        const items = listType === "allowed" ? allowed : blocked;
        return (
          <div key={listType} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{listType}</p>
            <div className="flex flex-wrap gap-1.5 min-h-7">
              {items.map((d, i) => (
                <Badge
                  key={i}
                  variant={listType === "allowed" ? "default" : "destructive"}
                  className="gap-1 pr-1 text-xs"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => removeFromList(listType, i)}
                    className="ml-0.5 opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder={`Add ${listType} domain…`}
              className="text-sm h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) {
                    addToList(listType, val);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function SEOFilterFields({ index }: { index: number }) {
  const { control, watch, setValue } = useFormContext<JobConfigValues>();
  const keywords = (watch(`crawling.filters.${index}.keywords`) as string[] | undefined) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 min-h-7">
        {keywords.map((k, i) => (
          <Badge key={i} variant="secondary" className="gap-1 pr-1 text-xs">
            {k}
            <button
              type="button"
              onClick={() => {
                const updated = [...keywords];
                updated.splice(i, 1);
                setValue(`crawling.filters.${index}.keywords`, updated);
              }}
              className="ml-0.5 opacity-70 hover:opacity-100 cursor-pointer"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
        <Input
          placeholder="Add keyword and press Enter…"
          className="text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) {
                setValue(`crawling.filters.${index}.keywords`, [...keywords, val]);
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
        />
        <Controller
          name={`crawling.filters.${index}.threshold`}
          control={control}
          render={({ field }) => (
            <div className="space-y-1 w-28">
              <p className="text-xs text-muted-foreground">Threshold</p>
              <Input
                type="number"
                step="0.1"
                min={0}
                max={1}
                className="text-sm"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                onBlur={field.onBlur}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}

function RelevanceFilterFields({ index }: { index: number }) {
  const { control } = useFormContext<JobConfigValues>();

  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
      <Controller
        name={`crawling.filters.${index}.query`}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs">Query</FieldLabel>
            <Input
              placeholder="Pages about pricing and enterprise plans…"
              className="text-sm"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name={`crawling.filters.${index}.threshold`}
        control={control}
        render={({ field }) => (
          <div className="space-y-1 w-28">
            <p className="text-xs text-muted-foreground">Threshold</p>
            <Input
              type="number"
              step="0.1"
              min={0}
              max={1}
              className="text-sm"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />
    </div>
  );
}

function FilterRuleCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { control, watch } = useFormContext<JobConfigValues>();
  const ruleType = watch(`crawling.filters.${index}.type`) as keyof typeof FILTER_ICONS;
  const Icon = FILTER_ICONS[ruleType] ?? Globe;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{FILTER_LABELS[ruleType] ?? "Filter"}</p>
            <p className="text-xs text-muted-foreground">{FILTER_DESCRIPTIONS[ruleType]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Controller
            name={`crawling.filters.${index}.type`}
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-7 text-xs w-32 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">URL Pattern</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Separator />

      {ruleType === "url" && <URLFilterFields index={index} />}
      {ruleType === "domain" && <DomainFilterFields index={index} />}
      {ruleType === "seo" && <SEOFilterFields index={index} />}
      {ruleType === "relevance" && <RelevanceFilterFields index={index} />}
    </div>
  );
}

export function CrawlingSection() {
  const { control, watch, setValue } = useFormContext<JobConfigValues>();
  const crawlingConfig = watch("crawling");
  const isEnabled = crawlingConfig !== null;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "crawling.filters" as never,
  });

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setValue("crawling", { max_depth: 1, max_pages: 10, filters: [] }, { shouldValidate: true });
    } else {
      setValue("crawling", null, { shouldValidate: true });
    }
  };

  const addFilter = (type: "url" | "domain" | "seo" | "relevance") => {
    const defaults = {
      url: { type: "url" as const, patterns: [], reverse: false },
      domain: { type: "domain" as const, allowed: [], blocked: [] },
      seo: { type: "seo" as const, keywords: [], threshold: 0.5 },
      relevance: { type: "relevance" as const, query: "", threshold: 0.7 },
    };
    append(defaults[type] as never);
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div>
          <p className="text-sm font-medium">Deep Crawling</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Follow links and crawl multiple pages from the entry URL.
          </p>
        </div>
        <Switch checked={isEnabled} onCheckedChange={handleToggle} className="cursor-pointer" />
      </div>

      {isEnabled && (
        <div className="space-y-6">
          {/* Depth & Pages */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="crawling.max_depth"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Max Depth</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    value={field.value ?? 1}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    onBlur={field.onBlur}
                  />
                  <FieldDescription>How many link levels deep to crawl.</FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="crawling.max_pages"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Max Pages</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    value={field.value ?? 10}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    onBlur={field.onBlur}
                  />
                  <FieldDescription>Hard cap on total pages processed.</FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          {/* Filter Rules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Filter Rules</p>
                <p className="text-xs text-muted-foreground">Control which pages are included during crawl.</p>
              </div>
              <div className="flex items-center gap-1.5">
                {(["url", "domain", "seo", "relevance"] as const).map((type) => {
                  const Icon = FILTER_ICONS[type];
                  return (
                    <Button
                      key={type}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs cursor-pointer"
                      onClick={() => addFilter(type)}
                    >
                      <Icon className="h-3 w-3" />
                      {FILTER_LABELS[type]}
                    </Button>
                  );
                })}
              </div>
            </div>

            {fields.length === 0 ? (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground">
                No filter rules.
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <FilterRuleCard key={field.id} index={index} onRemove={() => remove(index)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}