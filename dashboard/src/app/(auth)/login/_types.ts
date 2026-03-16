import { OrganizationTokenResponse } from "@/types/organization"; 

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = OrganizationTokenResponse;