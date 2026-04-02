import type { IUser } from "./IUser";

export interface IRegisterRequest {
  email: string;
  username: string;
  fullname: string;
  password: string;
  confirm_password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

/** Respuesta de POST /api/auth/login (sesión por cookie, sin token en JSON). */
export interface ILoginResponse {
  message: string;
}

/** Usuario autenticado (/api/auth/me, perfil). */
export type IAuthUser = IUser;
