import { Router } from "express";

import { Services } from "../service";
import { asyncRoute } from "../util/route";

interface FacebookRouteDeps {
  services: Services;
}

export function createFacebookRoute({ services }: FacebookRouteDeps) {
  const router = Router();
  router.get(
    "/",
    asyncRoute(async (req, res) => {
      const code = req.query.code;

      if (typeof code !== "string") {
        res.status(400).json({
          message: "잘못된 code 값입니다.",
        });
        return;
      }

      const ret = await services.authService.authByFacebook(code);

      const token = await services.tokenService.createAuthToken({ userId: ret.userId });

      res.json({
        accessToken: token,
      });
    }),
  );

  return router;
}
