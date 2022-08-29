import { sign, verify } from "jsonwebtoken";
import { z } from "zod";

export interface TokenClient {
  createAuthToken(data: { userId: number }): Promise<string>;
  verifyAuthToken(accessToken: string): Promise<{ userId: number }>;
  createRegisterToken(email: string): Promise<string>;
  verifyRegisterToken(token: string): Promise<{ registerEmail: string } | null>;
}

interface TokenClientDeps {
  jwtSecret: string;
  origin: string;
}

export function createTokenClient({ jwtSecret, origin }: TokenClientDeps): TokenClient {
  return {
    async createAuthToken(data) {
      const token = sign(
        {
          iss: origin,
          sub: `user|${data.userId}`,
        },
        jwtSecret,
        {
          algorithm: "HS256",
          expiresIn: "10d",
        },
      );

      return token;
    },
    async verifyAuthToken(accessToken) {
      const extracted = verify(accessToken, jwtSecret, { issuer: origin });

      const validator = z.object({
        iss: z.string(),
        sub: z.string(),
      });

      const tokenInfo = validator.parse(extracted);
      const userId = Number(tokenInfo.sub.split("|")[1]);

      if (isNaN(userId)) {
        throw new Error(`Not a valid user ID (${userId})`);
      }

      return {
        userId,
      };
    },
    async createRegisterToken(email) {
      const token = sign({ register: email }, jwtSecret, { algorithm: "HS256", expiresIn: "6h" });
      return token;
    },
    async verifyRegisterToken(token) {
      const extracted = safeVerify(token, jwtSecret);
      if (!extracted) {
        return null;
      }

      const validator = z.object({
        register: z.string(),
      });

      const tokenInfo = validator.safeParse(extracted);
      if (!tokenInfo.success) {
        return null;
      }
      const registerEmail = tokenInfo.data.register;

      return {
        registerEmail,
      };
    },
  };
}

function safeVerify(token: string, jwtSecret: string) {
  try {
    return verify(token, jwtSecret);
  } catch {
    return null;
  }
}
