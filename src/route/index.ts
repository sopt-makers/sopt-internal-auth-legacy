import { NextFunction, Request, Response, Router } from "express";

import { TokenClient } from "../lib/token";
import { Services } from "../service";
import { ZodValidationError } from "../util/route";
import { createFacebookRoute } from "./facebook";
import { createRegisterRoute } from "./register";
interface CreateRoutesDeps {
  services: Services;
  tokenClient: TokenClient;
}

export function createRoutes({ services }: CreateRoutesDeps) {
  const router = Router();

  router.use("/idp/facebook", createFacebookRoute({ services }));
  router.use("/register", createRegisterRoute({ services }));

  router.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    if (err instanceof ZodValidationError) {
      res.status(400).json({ message: "올바르지 않은 입력 형식입니다.", errors: err.zodError.format() });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
      console.error("[Error]: Internal Server Error:", err.message);
    }
  });

  return router;
}
