import { Router } from "express";

import { Services } from "../service";
import { asyncRoute } from "../util/route";
import { AuthUtil } from "../util/token";

interface VerifyRouteDeps {
  services: Services;
  authUtil: AuthUtil;
}

export function createVerifyRoute({ services, authUtil }: VerifyRouteDeps) {
  const router = Router();

  router.post(
    "/facebook",
    authUtil.authRequired(),
    asyncRoute(async (req, res) => {
      const userId = authUtil.getUserId(req);

      const success = await services.userService.verifySOPTUser(userId);

      res.json({
        success,
      });
    }),
  );

  return router;
}
