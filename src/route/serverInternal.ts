import { NextFunction, Request, Response, Router } from "express";
import { z } from "zod";

import { Services } from "../service";
import { asyncRoute, validateInput } from "../util/route";

interface ServerInternalRouteDeps {
  services: Services;
  adminAccessToken: string;
}

export function createServerInternalRoute({ services, adminAccessToken }: ServerInternalRouteDeps) {
  const router = Router();

  const checkIsAdmin = (req: Request, res: Response, next: NextFunction) => {
    const isAdminTokenMatch = req.headers["admin-access-token"] === adminAccessToken;

    if (isAdminTokenMatch) {
      next();
      return;
    }

    res.status(401).json({
      status: "unauthorized",
    });
  };

  router.use(checkIsAdmin);

  router.patch(
    "/config",
    asyncRoute(async (req, res) => {
      const data = validateInput(
        req.body,
        z.object({
          key: z.string(),
          value: z.unknown(),
        }),
      );

      const ret = await services.serverInternalService.setConfig(data.key, data.value);

      if (ret.status !== "success") {
        res.json({
          status: ret.status,
        });
        return;
      }

      res.json({
        status: ret.status,
        value: ret.value,
      });
    }),
  );

  router.get(
    "/config",
    asyncRoute(async (req, res) => {
      const data = validateInput(
        req.query,
        z.object({
          key: z.string(),
        }),
      );

      const ret = await services.serverInternalService.getConfig(data.key);

      if (ret.status === "invalidKey") {
        res.json({
          status: ret.status,
        });
        return;
      }

      if (ret.status === "invalidValue") {
        res.json({
          status: ret.status,
          message: ret.message,
        });
        return;
      }

      res.json({
        status: ret.status,
        value: ret.value,
      });
    }),
  );

  router.post(
    "/config/reload",
    asyncRoute(async (_req, res) => {
      await services.serverInternalService.reloadConfig();

      res.json({
        status: "success",
      });
    }),
  );

  return router;
}
