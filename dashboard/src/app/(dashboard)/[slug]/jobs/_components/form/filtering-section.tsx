// src/app/(dashboard)/[slug]/jobs/_components/form/filtering-section.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { LanguageEnum, LANGUAGE_LABELS } from "../../_types/index";
import { JobConfigValues } from "../../_types/schemas";

export function FilteringSection() {
  const { control, watch, setValue } = useFormContext<JobConfigValues>();
  const languages = watch("filtering.languages") as LanguageEnum[] | null;

  const toggleLanguage = (lang: LanguageEnum, checked: boolean) => {
    const current = languages ?? [];
    const updated = checked
      ? [...current, lang]
      : current.filter((l) => l !== lang);
    setValue("filtering.languages", updated.length > 0 ? updated : null);
  };

  return (
    <div className="space-y-6">
      <Controller
        name="filtering.word_count_threshold"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="max-w-xs">
            <FieldLabel>Minimum Word Count</FieldLabel>
            <Input
              type="number"
              min={0}
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
              onBlur={field.onBlur}
            />
            <FieldDescription>
              Pages with fewer words will be discarded. Set to 0 to keep all pages.
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Allowed Languages</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select which languages to accept. Leave all unchecked to accept any language.
          </p>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          {Object.values(LanguageEnum).map((lang, i) => (
            <label
              key={lang}
              htmlFor={`lang-${lang}`}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                i < Object.values(LanguageEnum).length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium">{LANGUAGE_LABELS[lang]}</p>
                <p className="text-xs text-muted-foreground font-mono">{lang}</p>
              </div>
              <Checkbox
                id={`lang-${lang}`}
                checked={(languages ?? []).includes(lang)}
                onCheckedChange={(checked) => toggleLanguage(lang, !!checked)}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}