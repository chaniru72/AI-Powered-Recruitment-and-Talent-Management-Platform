import httpClient from "./httpClient";

export type UserRole =
  | "Candidate"
  | "Recruiter"
  | "HiringManager"
  | "Administrator";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUserData {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  accessToken: string;
  tokenType: string;
  expiresAt: string;
}

export interface LoginApiResponse {
  message: string;
  data: LoginUserData;
}

export async function login(
  loginRequest: LoginRequest,
): Promise<LoginApiResponse> {
  const response = await httpClient.post<LoginApiResponse>(
    "/api/Auth/login",
    loginRequest,
  );

  return response.data;
}
