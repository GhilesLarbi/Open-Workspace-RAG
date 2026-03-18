"use client";

import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Globe, Settings2, Filter, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import * as z from "zod";
import { jobConfigSchema, JobConfigValues } from "../../_types/schemas";
import { CrawlingSection } from "./crawling-section";
import { FilteringSection } from "./filtering-section";
import { FormattingSection } from "./formatting-section";

type JobConfigInput = z.input<typeof jobConfigSchema>;

interface JobConfigFormProps {
  initialData?: Partial<JobConfigValues>;
  onSubmit: (data: JobConfigValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const TABS = [
  {
    value: "core",
    label: "Core",
    icon: Globe,
    fields: ["url"] as const,
  },
  {
    value: "crawling",
    label: "Crawling",
    icon: Settings2,
    fields: ["crawling"] as const,
  },
  {
    value: "filtering",
    label: "Filtering",
    icon: Filter,
    fields: ["filtering"] as const,
  },
  {
    value: "formatting",
    label: "Formatting",
    icon: Sparkles,
    fields: ["formating"] as const,
  },
];

export function JobConfigForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Configuration",
}: JobConfigFormProps) {
  const [activeTab, setActiveTab] = useState<string>("core");

  const form = useForm<JobConfigInput, unknown, JobConfigValues>({
    resolver: zodResolver(jobConfigSchema) as never,
    mode: "onChange",
    defaultValues: {
      url: initialData?.url ?? "",
      crawling: initialData?.crawling ?? null,
      filtering: initialData?.filtering ?? { word_count_threshold: 30, languages: null },
      formating: initialData?.formating ?? {
        user_query: null,
        min_word_threshold: 20,
        threshold_type: "dynamic",
        threshold: 0.6,
        ignore_links: false,
        ignore_images: true,
        skip_internal_links: false,
        excluded_tags: [
          "nav", "footer", "aside", "header", 
          "#footer", ".footer", "#header", ".header", 
          ".copyright", ".cookie-banner", "#cookie-banner",
          ".sidebar", "#sidebar", ".menu", "#menu"
        ],
      },
    },
  });

  const { formState: { errors } } = form;

  const hasError = (fields: readonly string[]) => {
    return fields.some((f) => {
      const topLevelKey = f.split(".")[0];
      return !!errors[topLevelKey as keyof typeof errors];
    });
  };

  const onError = (formErrors: any) => {
    const errorFields = Object.keys(formErrors);
    for (const tab of TABS) {
      if (tab.fields.some((f) => errorFields.includes(f))) {
        setActiveTab(tab.value);
        break;
      }
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit, onError);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-6"
      >

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-start justify-between">

            <TabsList className="mb-4 flex flex-wrap h-auto">
              {TABS.map((tab) => {
                const tabHasError = hasError(tab.fields);

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "gap-2 cursor-pointer py-2",
                      tabHasError && "text-destructive data-[state=active]:text-destructive"
                    )}
                  >
                    {tab.label}
                    {tabHasError && <AlertCircle className="h-3.5 w-3.5" />}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <Button
              type="button"
              className="cursor-pointer shadow-sm"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>

          <div className="min-h-[320px]">
            <TabsContent value="core" className="mt-0 space-y-4">
              <Controller
                name="url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="max-w-xl">
                    <FieldLabel>URL</FieldLabel>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                    />
                    <FieldDescription>
                      The primary entry point.
                    </FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </TabsContent>

            <TabsContent value="crawling" className="mt-0">
              <CrawlingSection />
            </TabsContent>

            <TabsContent value="filtering" className="mt-0">
              <FilteringSection />
            </TabsContent>

            <TabsContent value="formatting" className="mt-0">
              <FormattingSection />
            </TabsContent>
          </div>
        </Tabs>
      </form>
    </FormProvider>
  );
}