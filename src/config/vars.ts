import { config } from 'dotenv';

config();

export const env = process.env.NODE_ENV;
export const port = process.env.PORT;
export const mongoUri = process.env.MONGO_URI as string;
export const clientUrl = process.env.CLIENT_URL;
export const serverUrl = process.env.SERVER;
export const accessSecret = process.env.ACCESS_SECRET as string;
export const expirationInterval = Number(process.env.JWT_EXPIRATION_MINUTES);
export const GRANT_TYPE = process.env.GRANT_TYPE;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const SCOPES = process.env.SCOPES;
