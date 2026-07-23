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

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: Extract<UserRole, "Candidate" | "Recruiter">;
}

export interface RegisterUserData {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface RegisterApiResponse {
  message: string;
  user: RegisterUserData;
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

export async function register(
  registerRequest: RegisterRequest,
): Promise<RegisterApiResponse> {
  const response = await httpClient.post<RegisterApiResponse>(
    "/api/Auth/register",
    registerRequest,
  );

  return response.data;
}
