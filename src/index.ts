import cors from "cors";
import express from "express";
import morgan from "morgan";

import { createServerConfig } from "./config";
import { ADMIN_ACCESS_TOKEN, DATABASE_URI, JWT_SECRET, ORIGIN, PORT } from "./const";
import { createDatabase } from "./database";
import { createEmailExternal } from "./external/email";
import { createFacebookAPIExternal } from "./external/facebookAPI";
import { noopNotifier, SlackNotifier } from "./external/notifier";
import { createWebHookExternal } from "./external/webHook";
import { createTokenClient } from "./lib/token";
import { createRepository } from "./repository";
import { createRoutes } from "./route";
import { createServices } from "./service";
import { syncObject } from "./util/syncObject";

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

  const config = createServerConfig(repository.config);

  const emailExternal = await createEmailExternal({
    config,
  });

  const facebookAPIExternal = createFacebookAPIExternal({
    config,
  });

  const webHookExternal = createWebHookExternal({
    config,
  });

  const notifier = await syncObject(
    (sync) => config.subscribe("SLACK_NOTIFY", sync),
    async () => {
      const slackConfig = await config.get("SLACK_NOTIFY");
      if (!slackConfig) {
        return noopNotifier;
      }
      return new SlackNotifier(slackConfig.botToken, slackConfig.channels);
    },
  );

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

  app.use("/api/v1", createRoutes({ services, notifier, adminAccessToken: ADMIN_ACCESS_TOKEN }));

  app.listen(PORT, () => {
    console.log(`Server Started: (${ORIGIN})`);
    notifier.notifyServerStart();
  });
})();
