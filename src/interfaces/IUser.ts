/**
 * Texto que el usuario debe escribir para confirmar el borrado de cuenta (contrato UI).
 * Debe coincidir con las validaciones del formulario de eliminación.
 */
export const USER_ACCOUNT_DELETE_CONFIRMATION_PHRASE = "eliminar" as const;

export interface IUser {
  id?: string;
  email: string;
  username: string;
  fullname: string;
  enable_church_contributions: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Campos opcionales para PUT /api/users/profile (solo se envían los definidos). */
export interface IUpdateUserPayload {
  fullname?: string;
  email?: string;
  username?: string;
  password?: string;
  confirm_password?: string;
  enable_church_contributions?: boolean;
}
