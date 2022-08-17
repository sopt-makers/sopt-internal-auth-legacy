import { z } from "zod";

import { createDBConfigStore } from "../lib/configStore/dbConfigStore";
import { ConfigRepository } from "../repository/config";

export const configDef = {
  REGISTER_EMAIL_TEMPLATE: z.string(),
  WEBHOOK_ON_REGISTER: z.array(z.string()),
  FACEBOOK_OAUTH: z.object({
    clientAppId: z.string(),
    redirectUriAuth: z.string(),
    redirectUriRegister: z.string(),
    clientSecret: z.string(),
  }),
};

export function createServerConfig(configRepository: ConfigRepository) {
  return createDBConfigStore({ configRepository }, configDef);
}

export type ServerConfig = ReturnType<typeof createServerConfig>;
