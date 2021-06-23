export interface Token {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
export interface Auth {
  user: User;
  token: Token;
}
export interface location {
  address: string;
  lat: number;
  lng: number;
}
export type Role = "admin" | "user";
export interface User {
  id: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  structure: string;
  isReferentiel: boolean;
  tutorialStep: number;
  location: location;
}
export interface Group {
  id: string;
  title: string;
  code: string;
  advisor: User;
}
export interface GroupList {
  count: number;
  page: number;
  data: Group[];
  perPage: number;
  totalPages: number;
}
