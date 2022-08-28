import { z } from "zod";

import { createDBConfigStore } from "../lib/configStore/dbConfigStore";
import { ConfigRepository } from "../repository/config";

export const configDef = {
  REGISTER_PAGE_URL_TEMPLATE: z.string(),
  WEBHOOK_ON_REGISTER: z.array(z.string()),
  FACEBOOK_OAUTH: z.object({
    clientAppId: z.string(),
    redirectUriAuth: z.string(),
    redirectUriRegister: z.string(),
    clientSecret: z.string(),
  }),
  EMAIL_CONFIG: z.object({
    senderAddress: z.string(),
    host: z.string(),
    user: z.string(),
    pass: z.string(),
    port: z.number(),
    secure: z.boolean(),
  }),
  SLACK_NOTIFY: z.union([
    z.null(),
    z.object({
      botToken: z.string(),
      channels: z.object({
        error: z.string().optional(),
        info: z.string().optional(),
        join: z.string().optional(),
      }),
    }),
  ]),
};

export function createServerConfig(configRepository: ConfigRepository) {
  return createDBConfigStore(
    { getConfig: configRepository.getConfig, setConfig: configRepository.setConfig },
    configDef,
  );
}

export type ServerConfig = ReturnType<typeof createServerConfig>;
