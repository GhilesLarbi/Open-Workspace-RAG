import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { SignupRequest, SignupResponse } from "../_types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useSignup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupRequest) => 
      apiFetch<SignupResponse>("/organizations/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res) => {
      Cookies.set("access_token", res.access_token, { expires: 7 });
      queryClient.setQueryData(["org-me"], res.organization);
      router.push("/");
    },
  });
}