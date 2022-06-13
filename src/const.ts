import dotenv from "dotenv-safe";
dotenv.config();

function required(value: string | undefined) {
  if (value === undefined) {
    throw new Error(`환경변수 ${value}가 세팅되지 않았습니다.`);
  }
  return value;
}

export const PORT = process.env.PORT ?? 5000;
export const DATABASE_URI = required(process.env.DATABASE_URI);
export const ORIGIN = required(process.env.ORIGIN);
export const JWT_SECRET = required(process.env.JWT_SECRET);

export const REGISTER_PAGE_URI_TEMPLATE = required(process.env.REGISTER_PAGE_URI_TEMPLATE);

export const FACEBOOK_APP_ID = required(process.env.FACEBOOK_APP_ID);
export const FACEBOOK_APP_SECRET = required(process.env.FACEBOOK_APP_SECRET);
export const FACEBOOK_APP_REDIRECT_URI_AUTH = required(process.env.FACEBOOK_APP_REDIRECT_URI_AUTH);
export const FACEBOOK_APP_REDIRECT_URI_REGISTER = required(process.env.FACEBOOK_APP_REDIRECT_URI_REGISTER);

export const EMAIL_HOST = required(process.env.EMAIL_HOST);
export const EMAIL_USER = required(process.env.EMAIL_USER);
export const EMAIL_PASS = required(process.env.EMAIL_PASS);
