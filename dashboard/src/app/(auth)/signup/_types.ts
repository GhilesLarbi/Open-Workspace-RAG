import { OrganizationTokenResponse } from "@/types/organization";

export type SignupRequest = {
  email: string;
  name: string;
  password: string;
};

export type SignupResponse = OrganizationTokenResponse;