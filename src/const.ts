import dotenv from "dotenv-safe";
dotenv.config();

export const PORT = process.env.PORT ?? 5000;
export const DATABASE_URI = process.env.DATABASE_URI ?? "";
export const ORIGIN = process.env.ORIGIN ?? "";
export const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID ?? "";
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET ?? "";
export const FACEBOOK_APP_REDIRECT_URI = process.env.FACEBOOK_APP_REDIRECT_URI ?? "";
