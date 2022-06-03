import { Users } from "../__generated__/psql";
import { Database } from "../database";

export interface UserRepository {
  getUserByUserId(userId: number): Promise<Users | null>;

  createUser(init: { name?: string }): Promise<{ userId: number }>;
  setUserVerified(userId: number): Promise<void>;
}

export function createUserRepository(db: Database): UserRepository {
  return {
    async getUserByUserId(userId) {
      const ret = await db.selectFrom("users").where("id", "=", userId).selectAll().executeTakeFirst();
      return ret ?? null;
    },
    async createUser(init) {
      const { id } = await db
        .insertInto("users")
        .values({
          bio: "",
          name: init.name ?? "",
          is_sopt_member: false,
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      return {
        userId: Number(id),
      };
    },
    async setUserVerified(userId) {
      await db
        .updateTable("users")
        .where("id", "=", userId)
        .set({
          is_sopt_member: true,
        })
        .executeTakeFirstOrThrow();
    },
  };
}
