import { Router } from "express";

import { Services } from "../service";
import { createAuthUtil } from "../util/token";
import { createFacebookRoute } from "./facebook";
import { createVerifyRoute } from "./verify";
interface CreateRoutesDeps {
  services: Services;
}

export function createRoutes({ services }: CreateRoutesDeps) {
  const router = Router();

  const authUtil = createAuthUtil({ tokenService: services.tokenService });

  router.use("/auth/facebook", createFacebookRoute({ services }));
  router.use("/verify", createVerifyRoute({ services, authUtil }));

  return router;
}
