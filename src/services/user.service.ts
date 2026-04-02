import type { IUpdateUserPayload, IUser } from "../interfaces";
import { apiJson, apiVoid } from "./http";

export async function fetchUserProfile(): Promise<IUser> {
  return apiJson<IUser>("/api/users/profile", { method: "GET" });
}

export async function updateUserProfile(userData: IUpdateUserPayload): Promise<unknown> {
  return apiJson<unknown>("/api/users/profile", {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export async function deleteUserProfile(): Promise<void> {
  await apiVoid("/api/users/profile", { method: "DELETE" });
}
