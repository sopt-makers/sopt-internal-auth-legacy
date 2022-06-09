import cors from "cors";
import express from "express";

import {
  DATABASE_URI,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_REDIRECT_URI,
  FACEBOOK_APP_SECRET,
  JWT_SECRET,
  ORIGIN,
  PORT,
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

  const db = createDatabase({
    DATABASE_URI,
  });

  const repository = createRepository({
    db,
  });

  const externals = createExternals({
    facebookAppId: FACEBOOK_APP_ID,
    facebookAppRedirectUri: FACEBOOK_APP_REDIRECT_URI,
    facebookAppSecret: FACEBOOK_APP_SECRET,
  });

  const tokenClient = createTokenClient({
    jwtSecret: JWT_SECRET,
    origin: ORIGIN,
  });

  const services = createServices({ repository, externals, tokenClient });

  app.use("/api/v1", createRoutes({ services, tokenClient }));

  app.listen(PORT, () => {
    console.log(`Server Started: (http://localhost:${PORT})`);
  });
})();
