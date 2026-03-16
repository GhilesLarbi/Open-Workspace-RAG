// src/app/(dashboard)/[slug]/settings/_components/workspace-settings-form.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  url: z.string().url("Please enter a valid URL"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
});

type FormValues = z.infer<typeof schema>;

export function WorkspaceSettingsForm({ workspace }: { workspace: any }) {
  const { updateWorkspace, switchToWorkspace } = useWorkspaces();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: workspace.name,
      url: workspace.url,
      slug: workspace.slug,
    },
  });

  const onSubmit = async (data: FormValues) => {
    await updateWorkspace.mutateAsync({ slug: workspace.slug, data });
    if (data.slug !== workspace.slug) switchToWorkspace(data.slug);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">General</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Basic information about your workspace.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {/* Name */}
          <div className="px-5 py-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid grid-cols-[200px_1fr] items-start gap-8">
                  <div className="pt-1.5">
                    <FieldLabel className="text-sm font-medium">Workspace Name</FieldLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Display name for this workspace.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Input {...field} className="max-w-sm" />
                    <FieldError errors={[fieldState.error]} />
                  </div>
                </Field>
              )}
            />
          </div>

          {/* URL */}
          <div className="px-5 py-4">
            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid grid-cols-[200px_1fr] items-start gap-8">
                  <div className="pt-1.5">
                    <FieldLabel className="text-sm font-medium">Production URL</FieldLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      The primary URL for this workspace.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Input {...field} placeholder="https://example.com" className="max-w-sm" />
                    <FieldError errors={[fieldState.error]} />
                  </div>
                </Field>
              )}
            />
          </div>

          {/* Slug */}
          <div className="px-5 py-4">
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid grid-cols-[200px_1fr] items-start gap-8">
                  <div className="pt-1.5">
                    <FieldLabel className="text-sm font-medium">Slug</FieldLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Used in URLs. Changing this will redirect you.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="relative flex items-center max-w-sm">
                      <span className="absolute left-3 text-muted-foreground font-mono text-sm select-none">/</span>
                      <Input {...field} className="pl-6 font-mono text-sm" />
                    </div>
                    <FieldError errors={[fieldState.error]} />
                  </div>
                </Field>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!form.formState.isDirty || updateWorkspace.isPending}
            className="cursor-pointer"
          >
            {updateWorkspace.isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}