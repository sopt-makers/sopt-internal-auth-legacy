import cors from "cors";
import express from "express";
import morgan from "morgan";

import { configDef } from "./config";
import { DATABASE_URI, JWT_SECRET, ORIGIN, PORT } from "./const";
import { createDatabase } from "./database";
import { createEmailExternal } from "./external/email";
import { createFacebookAPIExternal } from "./external/facebookAPI";
import { createWebHookExternal } from "./external/webHook";
import { createDBConfigStore } from "./lib/configStore/dbConfigStore";
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

  const config = createDBConfigStore({ configRepository: repository.config }, configDef);

  const emailExternal = await createEmailExternal({
    config,
  });

  const facebookAPIExternal = createFacebookAPIExternal({
    config,
  });

  const webHookExternal = createWebHookExternal({
    config,
  });

  const tokenClient = createTokenClient({
    jwtSecret: JWT_SECRET,
    origin: ORIGIN,
  });

  const services = createServices({
    repository,
    externals: {
      email: emailExternal,
      facebookAPI: facebookAPIExternal,
      webHook: webHookExternal,
    },
    tokenClient,
    config,
  });

  app.use("/api/v1", createRoutes({ services, tokenClient }));

  app.listen(PORT, () => {
    console.log(`Server Started: (http://localhost:${PORT})`);
  });
})();
