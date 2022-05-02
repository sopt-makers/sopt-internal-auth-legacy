import { Users } from "../__generated__/psql";
import { Database } from "../database";

export interface UserRepository {
  getUserByUserId(userId: string): Promise<Users | null>;
}

export function createUserRepository(db: Database): UserRepository {
  return {
    async getUserByUserId(userId: string) {
      const ret = await db.selectFrom("users").where("id", "=", parseInt(userId)).selectAll().executeTakeFirst();
      return ret ?? null;
    },
  };
}
