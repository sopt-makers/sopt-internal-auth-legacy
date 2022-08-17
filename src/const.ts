import dotenv from "dotenv";
dotenv.config();

function required(key: string) {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`환경변수 ${key} 가 세팅되지 않았습니다.`);
  }
  return value;
}

export const PORT = process.env.PORT ?? 5000;
export const DATABASE_URI = required("DATABASE_URI");
export const ORIGIN = required("ORIGIN");
export const JWT_SECRET = required("JWT_SECRET");
