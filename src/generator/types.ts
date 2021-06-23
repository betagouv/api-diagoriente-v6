export interface LocationInput {
  address: string;
  lat: number;
  lng: number;
  postCode: string;
}
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
export type ThemeDomain = "personal" | "professional";
export interface Theme {
  id: string;
  title: string;
  domain: ThemeDomain;
  code: string;
  tag: Tag;
}
export interface ThemeList {
  count: number;
  page: number;
  data: Theme[];
  perPage: number;
  totalPages: number;
}
export interface Tag {
  id: string;
  title: string;
  code: string;
  sector: Sector;
}
export interface TagList {
  count: number;
  page: number;
  data: Tag[];
  perPage: number;
  totalPages: number;
}
export interface Sector {
  id: string;
  title: string;
  code: string;
}
export interface SectorList {
  count: number;
  page: number;
  data: Sector[];
  perPage: number;
  totalPages: number;
}
export interface Location {
  coordinates: number[];
  city: string;
  cityCode: string;
  context: string;
  label: string;
  name: string;
  postcode: string;
}
export interface LocationUser {
  address: string;
  lat: number;
  lng: number;
  postCode: string;
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
  location: LocationUser;
  lastLogin: Date;
  codeGroupe: string;
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
