import { ChangeHandlerFunction, ConfigStore, StringKeyObject, Validator } from "./types";

interface ConfigDBAccesser {
  getConfig(key: string): Promise<string | null>;
  setConfig(key: string, value: string): Promise<void>;
}

export function createDBConfigStore<T extends StringKeyObject>(
  configDB: ConfigDBAccesser,
  validator: Validator<T>,
): ConfigStore<T> {
  const cache = new Map<keyof T, T[never]>();
  const subscribers = new Map<keyof T, ChangeHandlerFunction[]>();

  const notifySubscribers = <K extends keyof T>(key: K) => {
    const handlers = subscribers.get(key);

    if (!handlers) {
      return;
    }

    handlers.forEach((handler) => handler());
  };

  return {
    async get(key) {
      const cachedValue = cache.get(key);
      if (cachedValue) {
        return cachedValue;
      }

      const rawData = await configDB.getConfig(key as string);
      if (rawData === null) {
        throw new ConfigStoreError(`Config key '${key}' does not exists.`);
      }

      const data = JSON.parse(rawData);

      const ret = validator[key].safeParse(data);
      if (!ret.success) {
        throw new ConfigStoreError(`Config value for key '${key}' is invalid.`);
      }

      cache.set(key, data);

      return ret.data;
    },

    subscribe(key, fn) {
      const handlers = subscribers.get(key);

      if (!handlers) {
        subscribers.set(key, [fn]);
        return;
      }

      handlers.push(fn);
    },

    unsubscribe(key, fn) {
      const handlers = subscribers.get(key);

      if (!handlers) {
        return;
      }

      const handlerIndex = handlers.findIndex((handler) => handler === fn);
      if (handlerIndex === -1) {
        return;
      }

      handlers.splice(handlerIndex, -1);
    },

    async set(key, value) {
      cache.delete(key);
      await configDB.setConfig(key as string, JSON.stringify(value));
      notifySubscribers(key);
    },

    async flush() {
      cache.clear();
      Object.keys(validator).forEach((key) => notifySubscribers(key));
    },

    isKeyValid(key): key is keyof T {
      return key in validator;
    },

    isValueValid<K extends keyof T>(key: K, value: unknown): value is T[K] {
      const { success } = validator[key].safeParse(value);
      return success;
    },
  };
}

export class ConfigStoreError extends Error {}
