import dotenv from "dotenv";
dotenv.config();

function required(key: string) {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`환경변수 ${key} 가 세팅되지 않았습니다.`);
  }
  return value;
}

function array(key: string, sep: string) {
  const value = process.env[key];
  if (value === undefined || value.trim() === "") {
    return [];
  }

  const tokens = value.split(sep);
  return tokens;
}

export const PORT = process.env.PORT ?? 5000;
export const DATABASE_URI = required("DATABASE_URI");
export const ORIGIN = required("ORIGIN");
export const JWT_SECRET = required("JWT_SECRET");

export const REGISTER_PAGE_URI_TEMPLATE = required("REGISTER_PAGE_URI_TEMPLATE");

export const FACEBOOK_APP_ID = required("FACEBOOK_APP_ID");
export const FACEBOOK_APP_SECRET = required("FACEBOOK_APP_SECRET");
export const FACEBOOK_APP_REDIRECT_URI_AUTH = required("FACEBOOK_APP_REDIRECT_URI_AUTH");
export const FACEBOOK_APP_REDIRECT_URI_REGISTER = required("FACEBOOK_APP_REDIRECT_URI_REGISTER");

export const EMAIL_HOST = required("EMAIL_HOST");
export const EMAIL_USER = required("EMAIL_USER");
export const EMAIL_PASS = required("EMAIL_PASS");
export const EMAIL_SENDER_ADDRESS = required("EMAIL_SENDER_ADDRESS");

export const WEBHOOK_ON_REGISTER = array("WEBHOOK_ON_REGISTER", ",");
