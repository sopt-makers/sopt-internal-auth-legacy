import { AuthUser } from "../__generated__/psql";
import { Database } from "../database";

export interface UserRepository {
  getUserByUserId(userId: number): Promise<AuthUser | null>;
  createUser(init: { name: string; generation: number }): Promise<{ userId: number; name: string; generation: number }>;
}

export function createUserRepository(db: Database): UserRepository {
  return {
    async getUserByUserId(userId) {
      const ret = await db.selectFrom("AUTH_user").where("id", "=", userId).selectAll().executeTakeFirst();
      return ret ?? null;
    },
    async createUser(init) {
      const { id } = await db
        .insertInto("AUTH_user")
        .values({
          name: init.name,
          generation: init.generation,
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      return {
        userId: Number(id),
        name: init.name,
        generation: init.generation,
      };
    },
  };
}
