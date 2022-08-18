import to from "await-to-js";

import { ServerConfig } from "../config";

export interface ServerInternalService {
  reloadConfig(): Promise<void>;
  getConfig(
    key: string,
  ): Promise<
    { status: "success"; value: unknown } | { status: "invalidKey" } | { status: "invalidValue"; message: string }
  >;
  setConfig(
    key: string,
    value: unknown,
  ): Promise<{ status: "success"; value: unknown } | { status: "invalidKey" } | { status: "invalidValueType" }>;
}

interface ServerInternalServiceDeps {
  config: ServerConfig;
}

export function createServerInternalService({ config }: ServerInternalServiceDeps): ServerInternalService {
  return {
    async reloadConfig() {
      await config.flush();
    },
    async getConfig(key: string) {
      if (!config.isKeyValid(key)) {
        return { status: "invalidKey" };
      }

      const [err, value] = await to(config.get(key));

      if (err) {
        return { status: "invalidValue", message: err + "" };
      }

      return { status: "success", value };
    },
    async setConfig(key, value) {
      if (!config.isKeyValid(key)) {
        return { status: "invalidKey" };
      }

      if (!config.isValueValid(key, value)) {
        return { status: "invalidValueType" };
      }

      await config.set(key, value);
      return { status: "success", value };
    },
  };
}
