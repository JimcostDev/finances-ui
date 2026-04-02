import type { IAuthUser, ILoginRequest, ILoginResponse, IRegisterRequest } from "../interfaces";
import { apiJson, apiVoid } from "./http";

export async function registerUser(body: IRegisterRequest): Promise<IAuthUser> {
  return apiJson<IAuthUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function loginUser(body: ILoginRequest): Promise<ILoginResponse> {
  return apiJson<ILoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function logoutUser(): Promise<void> {
  await apiVoid("/api/auth/logout", { method: "POST" });
}

export async function fetchAuthMe(): Promise<IAuthUser> {
  return apiJson<IAuthUser>("/api/auth/me", { method: "GET" });
}
