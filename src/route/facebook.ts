import { Router } from "express";
import { z } from "zod";

import { Services } from "../service";
import { asyncRoute } from "../util/route";

interface FacebookRouteDeps {
  services: Services;
}

export function createFacebookRoute({ services }: FacebookRouteDeps) {
  const router = Router();
  router.post(
    "/auth",
    asyncRoute(async (req, res) => {
      const validator = z.object({
        facebookAuthCode: z.string(),
      });
      const data = validator.parse(req.body);

      const ret = await services.authService.authByFacebook(data.facebookAuthCode);
      if (!ret) {
        res.status(403).json({
          message: "인증에 실패했습니다.",
        });
        return;
      }

      res.json({
        accessToken: ret.accessToken,
      });
    }),
  );

  router.post(
    "/register",
    asyncRoute(async (req, res) => {
      const validator = z.object({
        facebookAuthCode: z.string(),
        registerToken: z.string(),
      });
      const data = validator.parse(req.body);

      const ret = await services.authService.registerByFacebook(data.registerToken, data.facebookAuthCode);
      if (!ret) {
        res.status(403).json({
          message: "가입에 실패했습니다.",
        });
        return;
      }

      res.status(200).json({
        accessToken: ret.accessToken,
      });
    }),
  );

  return router;
}
