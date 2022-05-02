import { Router } from "express";

import { Services } from "../service";
import { asyncRoute } from "../util/route";

interface CreateRoutesDeps {
  services: Services;
}

export function createRoutes({ services }: CreateRoutesDeps) {
  const router = Router();

  router.get(
    "/",
    asyncRoute(async (_req, res) => {
      const ret = services.hello();

      res.json({
        message: ret,
      });
    }),
  );

  return router;
}
