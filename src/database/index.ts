import { Kysely, PostgresDialect } from "kysely";

import { AuthServerConfig, SoptMember, Users, UsersFacebookAuth } from "../__generated__/psql";

export interface DatabaseSchema {
  users: Users;
  users_facebook_auth: UsersFacebookAuth;
  sopt_member: SoptMember;
  auth_server_config: AuthServerConfig;
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
