import type { ICategory } from "../interfaces";
import { apiJson } from "./http";

export async function fetchCategories(): Promise<ICategory[]> {
  return apiJson<ICategory[]>("/api/categories", { method: "GET" });
}
