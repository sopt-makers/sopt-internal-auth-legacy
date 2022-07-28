import { Router } from "express";
import { z } from "zod";

import { Services } from "../service";
import { asyncRoute, validateInput } from "../util/route";

interface RegisterRouteDeps {
  services: Services;
}

export function createRegisterRoute({ services }: RegisterRouteDeps) {
  const router = Router();

  router.post(
    "/checkToken",
    asyncRoute(async (req, res) => {
      const data = validateInput(
        req.body,
        z.object({
          registerToken: z.string(),
        }),
      );

      const ret = await services.registerService.getRegisterInfo(data.registerToken);

      if (!ret.success) {
        res.status(403).json({
          message: "가입 토큰이 유효하지 않습니다.",
        });
        return;
      }

      res.json({
        name: ret.name,
        generation: ret.generation,
      });
    }),
  );

  router.post(
    "/sendEmail",
    asyncRoute(async (req, res) => {
      const data = validateInput(
        req.body,
        z.object({
          email: z.string(),
        }),
      );

      const ret = await services.registerService.sendRegisterLinkByEmail(data.email);

      if (ret.status === "success") {
        res.status(200).json({
          success: true,
        });
      } else if (ret.status === "cannotSendEmail") {
        res.status(500).json({
          success: false,
          code: "cannotSendEmail",
          message: "이메일 발송에 실패했습니다.",
        });
      } else if (ret.status === "alreadyTaken") {
        res.status(409).json({
          success: false,
          code: "alreadyTaken",
          message: "가입할 수 없는 이메일입니다.",
        });
      } else if (ret.status === "invalidEmail") {
        res.status(409).json({
          success: false,
          code: "invalidEmail",
          message: "가입할 수 없는 이메일입니다.",
        });
      }
    }),
  );

  return router;
}
