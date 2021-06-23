export interface Token {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
export type Role = "admin" | "user";
export interface User {
  id: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
}
export interface Auth {
  user: User;
  token: Token;
}
