import { Kysely, PostgresDialect } from "kysely";

import { AuthIdpFacebook, AuthServerConfig, AuthSoptMember, AuthUser } from "../__generated__/psql";

export interface DatabaseSchema {
  AUTH_user: AuthUser;
  AUTH_idp_facebook: AuthIdpFacebook;
  AUTH_sopt_member: AuthSoptMember;
  AUTH_server_config: AuthServerConfig;
}

export type Database = Kysely<DatabaseSchema>;
interface CreateDatabaseDeps {
  DATABASE_URI: string;
}

export function createDatabase({ DATABASE_URI }: CreateDatabaseDeps): Database {
  const db = new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({
      connectionString: DATABASE_URI,
    }),
  });

  return db;
}
