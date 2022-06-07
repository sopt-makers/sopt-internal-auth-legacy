import { Router } from "express";
import { z } from "zod";

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
    "/checkRegisterToken",
    authUtil.authRequired(),
    asyncRoute(async (req, res) => {
      const userId = authUtil.getUserId(req);

      const success = await services.userService.verifySOPTUser(userId);

      res.json({
        success,
      });
    }),
  );

  router.post(
    "/sendRegisterEmail",
    asyncRoute(async (req, res) => {
      const validator = z.object({
        email: z.string(),
      });
      const data = validator.parse(req.body);

      await services.registerService.sendRegisterLinkByEmail(data.email);
      res.status(200).json({
        success: true,
      });
    }),
  );

  return router;
}
