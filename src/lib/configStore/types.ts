import { z } from "zod";

export interface ConfigStore<T extends Record<string, unknown>> {
  get<K extends keyof T>(key: K): Promise<T[K]>;
  set<K extends keyof T>(key: K, value: T[K]): Promise<void>;
  flush(): Promise<void>;
  isKeyValid(key: string | number | symbol): key is keyof T;
  isValueValid<K extends keyof T>(key: K, value: unknown): value is T[K];

  subscribe<K extends keyof T>(key: K, fn: ChangeHandlerFunction): void;
  unsubscribe<K extends keyof T>(key: K, fn: ChangeHandlerFunction): void;
}

export type ChangeHandlerFunction = () => void;

export type StringKeyObject = Record<string, unknown>;

export type Validator<T extends StringKeyObject = StringKeyObject> = { [key in keyof T]: z.ZodType<T[key]> };
