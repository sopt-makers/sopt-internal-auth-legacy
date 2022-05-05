import dotenv from "dotenv-safe";
dotenv.config();

export const PORT = process.env.PORT ?? 5000;
export const DATABASE_URI = process.env.DATABASE_URI ?? "";
export const ORIGIN = process.env.ORIGIN ?? "";
export const JWT_SECRET = process.env.JWT_SECRET ?? "";
