import { NextFunction, Request, Response, Router } from "express";

import { Notifier } from "../external/notifier";
import { Services } from "../service";
import { ZodValidationError } from "../util/route";
import { createFacebookRoute } from "./idp/facebook";
import { createRegisterRoute } from "./register";
import { createServerInternalRoute } from "./serverInternal";
interface CreateRoutesDeps {
  services: Services;
  adminAccessToken: string;
  notifier: Notifier;
}

export function createRoutes({ services, adminAccessToken, notifier }: CreateRoutesDeps) {
  const router = Router();

  router.use("/idp/facebook", createFacebookRoute({ services }));
  router.use("/register", createRegisterRoute({ services }));
  router.use("/serverInternal", createServerInternalRoute({ services, adminAccessToken }));

  router.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    if (err instanceof ZodValidationError) {
      res.status(400).json({ message: "올바르지 않은 입력 형식입니다.", errors: err.zodError.format() });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
      console.error("[Error]: Internal Server Error:", err.message);
      notifier.notifyError(err);
    }
  });

  return router;
}
