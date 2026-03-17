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
      documentIds: searchParams.get("ids")?.split(",").filter(Boolean),
      jobIds: searchParams.get("job_ids")?.split(",").filter(Boolean),
      lang: searchParams.get("lang") as LanguageEnum | undefined,
      actions: searchParams.get("actions")?.split(",") as JobDocumentAction[] | undefined,
      isApproved: isApprovedRaw === "true" ? true : isApprovedRaw === "false" ? false : undefined,
    };
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Record<string, string | string[] | boolean | null | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            newParams.set(key, value.join(","));
          } else {
            newParams.delete(key);
          }
        } else {
          newParams.set(key, String(value));
        }
      });

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const clearFilters = () => router.push(pathname);

  return { ...params, setParams, clearFilters };
}