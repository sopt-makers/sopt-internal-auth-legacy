import to from "await-to-js";
import { NextFunction, Request, Response } from "express";

import { TokenClient } from "../lib/token";

export interface AuthUtil {
  authRequired(): Middleware;
  getUserId(req: Request): number;
}

type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

interface AuthUtilDeps {
  tokenClient: TokenClient;
}

export function createAuthUtil({ tokenClient }: AuthUtilDeps): AuthUtil {
  interface AuthInfo {
    userId: number;
  }

  function extendAuthInfo(obj: unknown) {
    return obj as unknown as { auth?: AuthInfo };
  }

  function unauthorized(res: Response) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }

  return {
    authRequired() {
      return async (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          unauthorized(res);
          return;
        }

        const accessToken = authHeader.split("Bearer ")[1];

        const [err, user] = await to(tokenClient.verifyAuthToken(accessToken));

        if (err) {
          unauthorized(res);
          return;
        }

        extendAuthInfo(req).auth = { userId: user.userId };

        next();
      };
    },
    getUserId(req) {
      const authInfo = extendAuthInfo(req).auth;

      if (!authInfo) {
        throw new Error("function 'getUserId' should only be used with 'authRequired' middleware.");
      }

      return authInfo.userId;
    },
  };
}
