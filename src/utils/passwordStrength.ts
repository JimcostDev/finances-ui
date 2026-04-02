/** Nivel de fortaleza de 0 (vacío/débil) a 4 (excelente). */
export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Heurística simple: longitud, mayúsculas/minúsculas, dígitos y símbolos.
 */
export function computePasswordStrength(password: string): PasswordStrengthLevel {
  let n = 0;
  if (password.length >= 8) n++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) n++;
  if (/[0-9]/.test(password)) n++;
  if (/[^a-zA-Z0-9]/.test(password)) n++;
  return Math.min(n, 4) as PasswordStrengthLevel;
}

const STRENGTH_COLORS = [
  "bg-gray-200",
  "bg-red-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
] as const;

export function passwordStrengthBarClass(level: number): string {
  const i = Math.min(Math.max(0, level), 4);
  return STRENGTH_COLORS[i];
}

const STRENGTH_LABELS = ["", "Débil", "Regular", "Buena", "Excelente"] as const;

export function passwordStrengthLabel(level: number): string {
  const i = Math.min(Math.max(0, level), 4);
  return STRENGTH_LABELS[i];
}
