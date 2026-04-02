/** Mensaje seguro desde `catch (unknown)` sin usar `any`. */
export function getErrorMessage(error: unknown, fallback = "Error"): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}
