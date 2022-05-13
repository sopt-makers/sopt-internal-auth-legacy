import { Router } from "express";

import { Services } from "../service";
import { createFacebookRoute } from "./facebook";
interface CreateRoutesDeps {
  services: Services;
}

export function createRoutes({ services }: CreateRoutesDeps) {
  const router = Router();

  router.use("/auth/facebook", createFacebookRoute({ services }));

  return router;
}
