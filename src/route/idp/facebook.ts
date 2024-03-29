import { Router } from "express";
import { z } from "zod";

import { Services } from "../../service";
import { asyncRoute, validateInput } from "../../util/route";

interface FacebookRouteDeps {
  services: Services;
}

export function createFacebookRoute({ services }: FacebookRouteDeps) {
  const router = Router();
  router.post(
    "/auth",
    asyncRoute(async (req, res) => {
      const data = validateInput(
        req.body,
        z.object({
          code: z.string(),
        }),
      );

      const ret = await services.authService.authByFacebook(data.code);

      if (ret.success) {
        res.json({
          accessToken: ret.accessToken,
        });
      } else if (ret.status === "idpFailed") {
        res.status(403).json({
          message: "Facebook 인증에 실패했습니다.",
        });
      } else if (ret.status === "invalidUser") {
        res.status(403).json({
          message: "SOPT.org 회원이 아닙니다.",
        });
      }
    }),
  );

  router.post(
    "/register",
    asyncRoute(async (req, res) => {
      const data = validateInput(
        req.body,
        z.object({
          code: z.string(),
          registerToken: z.string(),
        }),
      );

      const ret = await services.authService.registerByFacebook(data.registerToken, data.code);

      if (ret.success) {
        res.status(200).json({
          accessToken: ret.accessToken,
        });
      } else if (ret.status === "alreadyTaken") {
        res.status(403).json({
          code: "alreadyTaken",
          message: "이미 가입된 사용자입니다.",
        });
      } else if (ret.status === "idpFailed") {
        res.status(403).json({
          code: "idpFailed",
          message: "facebook 인증에 실패했습니다.",
        });
      } else if (ret.status === "tokenInvalid") {
        res.status(400).json({
          code: "invalidToken",
          message: "가입 토큰이 유효하지 않습니다.",
        });
      }
    }),
  );

  return router;
}
