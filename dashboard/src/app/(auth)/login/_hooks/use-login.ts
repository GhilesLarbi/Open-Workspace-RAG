import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { LoginRequest, LoginResponse } from "../_types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => {
      const formData = new URLSearchParams();
      formData.append('username', data.email); 
      formData.append('password', data.password);

      return apiFetch<LoginResponse>("/organizations/login", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (res) => {
      Cookies.set("access_token", res.access_token, { expires: 7 });
      queryClient.setQueryData(["organization-me"], res.organization); 
      router.push("/");
    },
  });
}