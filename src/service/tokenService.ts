import { sign } from "jsonwebtoken";

export interface TokenService {
  createAuthToken(data: { userId: string }): Promise<string>;
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
          sub: data.userId,
        },
        jwtSecret,
        {
          algorithm: "HS256",
          expiresIn: "10d",
        },
      );

      return token;
    },
  };
}
