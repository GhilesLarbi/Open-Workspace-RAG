import * as z from "zod";

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  url: z.string().url("Enter a valid URL"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, and hyphens only"),
});

export type UpdateWorkspaceValues = z.infer<typeof updateWorkspaceSchema>;