// src/app/(dashboard)/[slug]/documents/_hooks/use-document-query-params.ts
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { LanguageEnum, JobDocumentAction } from "../_types";

export function useDocumentQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const isApprovedRaw = searchParams.get("is_approved");
    return {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      q: searchParams.get("q") || "",
      documentIds: searchParams.get("ids")?.split(",").filter(Boolean) || [],
      jobIds: searchParams.get("job_ids")?.split(",").filter(Boolean) || [],
      langs: searchParams.get("langs")?.split(",").filter(Boolean) as LanguageEnum[] || [],
      actions: searchParams.get("actions")?.split(",").filter(Boolean) as JobDocumentAction[] || [],
      isApproved: isApprovedRaw === "true" ? true : isApprovedRaw === "false" ? false : undefined,
    };
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Record<string, any>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.set(key, value.join(","));
        } else {
          newParams.set(key, String(value));
        }
      });

      // Reset to page 1 if filters change (but not if just changing page)
      if (!updates.page && (updates.q !== undefined || updates.langs || updates.is_approved !== undefined)) {
        newParams.set("page", "1");
      }

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const clearFilters = () => router.push(pathname);

  return { ...params, setParams, clearFilters };
}