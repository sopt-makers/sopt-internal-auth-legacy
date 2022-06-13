import cors from "cors";
import express from "express";
import morgan from "morgan";

import {
  DATABASE_URI,
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_SENDER_ADDRESS,
  EMAIL_USER,
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
import { createEmailExternal } from "./external/email";
import { createFacebookAPIExternal } from "./external/facebookAPI";
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

  const emailExternal = createEmailExternal({
    emailHost: EMAIL_HOST,
    emailPass: EMAIL_PASS,
    emailUser: EMAIL_USER,
    emailSenderAddress: EMAIL_SENDER_ADDRESS,
  });

  const facebookAPIExternal = createFacebookAPIExternal({
    clientAppId: FACEBOOK_APP_ID,
    redirectUriAuth: FACEBOOK_APP_REDIRECT_URI_AUTH,
    redirectUriRegister: FACEBOOK_APP_REDIRECT_URI_REGISTER,
    clientSecret: FACEBOOK_APP_SECRET,
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
    },
    tokenClient,
    registerPageUriTemplate: REGISTER_PAGE_URI_TEMPLATE,
  });

  app.use("/api/v1", createRoutes({ services, tokenClient }));

  app.listen(PORT, () => {
    console.log(`Server Started: (http://localhost:${PORT})`);
  });
})();
