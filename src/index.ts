import cors from "cors";
import express from "express";
import morgan from "morgan";

import {
  DATABASE_URI,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_REDIRECT_URI_AUTH,
  FACEBOOK_APP_REDIRECT_URI_REGISTER,
  FACEBOOK_APP_SECRET,
  JWT_SECRET,
  ORIGIN,
  PORT,
  REGISTER_PAGE_URI_TEMPLATE,
} from "./const";
import { createDatabase } from "./database";
import { createExternals } from "./external";
import { createTokenClient } from "./lib/token";
import { createRepository } from "./repository";
import { createRoutes } from "./route";
import { createServices } from "./service";

(async function () {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan("dev"));

  const db = createDatabase({
    DATABASE_URI,
  });

  const repository = createRepository({
    db,
  });

  const externals = createExternals({
    facebookAppId: FACEBOOK_APP_ID,
    facebookAppRedirectUriAuth: FACEBOOK_APP_REDIRECT_URI_AUTH,
    facebookAppRedirectUriRegister: FACEBOOK_APP_REDIRECT_URI_REGISTER,
    facebookAppSecret: FACEBOOK_APP_SECRET,
  });

  const tokenClient = createTokenClient({
    jwtSecret: JWT_SECRET,
    origin: ORIGIN,
  });

  const services = createServices({
    repository,
    externals,
    tokenClient,
    registerPageUriTemplate: REGISTER_PAGE_URI_TEMPLATE,
  });

  app.use("/api/v1", createRoutes({ services, tokenClient }));

  app.listen(PORT, () => {
    console.log(`Server Started: (http://localhost:${PORT})`);
  });
})();
