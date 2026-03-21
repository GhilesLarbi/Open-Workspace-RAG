// src/app/(dashboard)/[slug]/jobs/_hooks/use-job-query-params.ts
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { JobStatus } from "../_types";

export function useJobQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL search params with sensible defaults
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const statuses = searchParams.getAll("status") as JobStatus[];

  // Generic setter that updates the URL without losing other params
  const setParams = useCallback(
    (updates: Record<string, string | string[] | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },[pathname, router, searchParams]
  );

  return useMemo(
    () => ({
      page,
      pageSize,
      statuses,
      setParams,
    }),
    [page, pageSize, statuses, setParams]
  );
}