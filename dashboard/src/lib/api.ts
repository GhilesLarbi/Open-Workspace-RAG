import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api/v1";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = Cookies.get("access_token");
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.body instanceof URLSearchParams || options.body instanceof FormData) {
    headers.delete("Content-Type");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    Cookies.remove("access_token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "An unknown error occurred" }));
    
    if (Array.isArray(errorData.detail)) {
      const firstError = errorData.detail[0];
      throw new Error(firstError.msg || "Invalid input");
    }
    
    throw new Error(errorData.detail || response.statusText);
  }

  return response.json();
}