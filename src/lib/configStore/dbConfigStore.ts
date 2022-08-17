import { ConfigRepository } from "../../repository/config";
import { ConfigStore, StringKeyObject, Validator } from "./types";

interface DBConfigStoreDeps {
  configRepository: ConfigRepository;
}

export function createDBConfigStore<T extends StringKeyObject>(
  { configRepository }: DBConfigStoreDeps,
  validator: Validator<T>,
): ConfigStore<T> {
  const cache = new Map();

  return {
    async get(key) {
      if (cache.has(key)) {
        return cache.get(key);
      }

      const rawData = await configRepository.getConfig(key as string);
      if (rawData === null) {
        throw new ConfigStoreError(`Config for key '${key}' does not exists.`);
      }

      const data = JSON.parse(rawData);

      const { success } = validator[key].safeParse(data);
      if (!success) {
        throw new ConfigStoreError(`Config for key '${key}' is invalid.`);
      }

      cache.set(key, data);

      return data;
    },
    async set(key, value) {
      cache.delete(key);
      await configRepository.setConfig(key as string, JSON.stringify(value));
    },
    async flush() {
      cache.clear();
    },
  };
}

export class ConfigStoreError extends Error {}
