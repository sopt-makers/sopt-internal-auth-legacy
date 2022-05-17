import { sign, verify } from "jsonwebtoken";
import { z } from "zod";

export interface TokenService {
  createAuthToken(data: { userId: number }): Promise<string>;
  verifyAuthToken(accessToken: string): Promise<{ userId: number }>;
}

interface TokenServiceDeps {
  jwtSecret: string;
  origin: string;
}

export function createTokenService({ jwtSecret, origin }: TokenServiceDeps): TokenService {
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
  };
}
