import { sign, verify } from "jsonwebtoken";
import { z } from "zod";

export interface TokenService {
  createAuthToken(data: { userId: number }): Promise<string>;
  verifyAuthToken(accessToken: string): Promise<{ userId: number }>;
  createRegisterToken(soptMemberId: number): Promise<string>;
  verifyRegisterToken(token: string): Promise<{ soptMemberId: number } | null>;
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
    async createRegisterToken(soptMemberId) {
      const token = sign({ register: soptMemberId }, jwtSecret, { algorithm: "HS256", expiresIn: "6h" });
      return token;
    },
    async verifyRegisterToken(token) {
      const extracted = () => {
        try {
          return verify(token, jwtSecret);
        } catch {
          return null;
        }
      };
      if (!extracted) {
        return null;
      }

      const validator = z.object({
        register: z.number(),
      });

      const tokenInfo = validator.safeParse(extracted);
      if (!tokenInfo.success) {
        return null;
      }
      const soptMemberId = tokenInfo.data.register;

      return {
        soptMemberId,
      };
    },
  };
}
