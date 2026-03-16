import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Organization } from "@/types/organization";
import Cookies from "js-cookie";

export function useOrganization() {
  return useQuery({
    queryKey: ["org-me"],
    queryFn: () => apiFetch<Organization>("/organizations/me"),
    enabled: !!Cookies.get("access_token"),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}