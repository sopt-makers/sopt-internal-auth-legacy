import { Database } from "../database";

export interface ConfigRepository {
  getConfig(key: string): Promise<string | null>;
  setConfig(key: string, value: string): Promise<void>;
}

interface ConfigRepositoryDeps {
  db: Database;
}

export function createConfigRepository({ db }: ConfigRepositoryDeps): ConfigRepository {
  return {
    async getConfig(key) {
      const ret = await db.selectFrom("auth_server_config").where("key", "=", key).selectAll().executeTakeFirst();

      return ret?.value ?? null;
    },
    async setConfig(key, value) {
      await db
        .insertInto("auth_server_config")
        .values({
          key,
          value,
        })
        .onDuplicateKeyUpdate({
          value,
        })
        .execute();
    },
  };
}
