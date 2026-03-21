"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel, FieldDescription } from "@/components/ui/field";
import { createWorkspaceSchema, CreateWorkspaceValues } from "../_types";
import { useCreateWorkspace } from "../_hooks/use-create-workspace";
import { Loader2 } from "lucide-react";

export function CreateWorkspaceForm() {
  const { mutate, isPending, error: apiError } = useCreateWorkspace();

  const form = useForm<CreateWorkspaceValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "", url: "", slug: "" },
  });

  const nameValue = form.watch("name");
  useEffect(() => {
    if (form.formState.dirtyFields.name && !form.formState.dirtyFields.slug) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, form]);

  return (
    <form onSubmit={form.handleSubmit((data) => mutate(data))} className="flex flex-col gap-6">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Workspace Name</FieldLabel>
            <Input {...field} id={field.name} placeholder="My Awesome Project" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="url"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Website URL</FieldLabel>
            <Input {...field} id={field.name} type="url" placeholder="https://example.com" />
            <FieldDescription>The production URL of your project.</FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="slug"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Workspace Slug</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">/</span>
              <Input {...field} id={field.name} className="pl-6" placeholder="my-awesome-project" />
            </div>
            <FieldDescription>This is your workspace's unique ID in the URL.</FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {apiError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive font-medium border border-destructive/20">
          {apiError.message}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Workspace"
          )}
        </Button>
      </div>
    </form>
  );
}