import { Router } from "express";

import { TokenClient } from "../lib/token";
import { Services } from "../service";
import { createAuthUtil } from "../util/token";
import { createFacebookRoute } from "./facebook";
import { createVerifyRoute } from "./verify";
interface CreateRoutesDeps {
  services: Services;
  tokenClient: TokenClient;
}

export function createRoutes({ services, tokenClient }: CreateRoutesDeps) {
  const router = Router();

  const authUtil = createAuthUtil({ tokenClient });

  router.use("/idp/facebook", createFacebookRoute({ services }));
  router.use("/verify", createVerifyRoute({ services, authUtil }));

  return router;
}
