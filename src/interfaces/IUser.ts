export interface IUser {
  id?: string;
  email: string;
  username: string;
  fullname: string;
  enable_church_contributions: boolean;
  created_at?: string;
  updated_at?: string;
}

export type IUpdateUserPayload = Record<string, unknown>;
