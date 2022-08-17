import { z } from "zod";

export interface ConfigStore<T extends Record<string, unknown>> {
  get<K extends keyof T>(key: K): Promise<T[K]>;
  set<K extends keyof T>(key: K, value: T[K]): Promise<void>;
  flush(): Promise<void>;
}

export type StringKeyObject = Record<string, unknown>;

export type Validator<T extends StringKeyObject = StringKeyObject> = { [key in keyof T]: z.ZodType<T[key]> };
