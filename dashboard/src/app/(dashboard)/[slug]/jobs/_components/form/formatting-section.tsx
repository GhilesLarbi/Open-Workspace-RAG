"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { JobConfigValues } from "../../_types/schemas";

const TOGGLE_OPTIONS = [
  {
    key: "ignore_links" as const,
    label: "Ignore Links",
    description: "Strip all hyperlinks from extracted content.",
  },
  {
    key: "ignore_images" as const,
    label: "Ignore Images",
    description: "Exclude image elements from output.",
  },
  {
    key: "skip_internal_links" as const,
    label: "Skip Internal Links",
    description: "Don't follow links that point to the same domain.",
  },
];

export function FormattingSection() {
  const { control } = useFormContext<JobConfigValues>();

  return (
    <div className="space-y-8">
      {/* LLM Query */}
      <Controller
        name="formating.user_query"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              LLM Extraction Query{" "}
              <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Textarea
              placeholder="e.g. Extract all pricing tiers, features, and contact information from this page…"
              className="resize-none min-h-[80px]"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
            <FieldDescription>
              When provided, an LLM will use this instruction to intelligently extract relevant content.
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Threshold controls */}
      <div className="grid grid-cols-3 gap-4">
        <Controller
          name="formating.threshold_type"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Threshold Type</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="dynamic">Dynamic</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>How relevance cutoff is calculated.</FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="formating.threshold"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Relevance Threshold</FieldLabel>
              <Input
                type="number"
                step="0.05"
                min={0}
                max={1}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
              <FieldDescription>0–1. Content below this is dropped.</FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="formating.min_word_threshold"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Min Block Words</FieldLabel>
              <Input
                type="number"
                min={0}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              <FieldDescription>Discard content blocks shorter than this.</FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      {/* Boolean toggles */}
      <div className="space-y-1 rounded-lg border border-border overflow-hidden">
        {TOGGLE_OPTIONS.map(({ key, label, description }, i) => (
          <Controller
            key={key}
            name={`formating.${key}`}
            control={control}
            render={({ field }) => (
              <div
                className={`flex items-center justify-between px-4 py-3 ${
                  i < TOGGLE_OPTIONS.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                  id={key}
                />
              </div>
            )}
          />
        ))}
      </div>
    </div>
  );
}