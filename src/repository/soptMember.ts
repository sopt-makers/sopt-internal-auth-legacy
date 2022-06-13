import { Database } from "../database";

export interface SoptMemberRepsitory {
  findByEmail(email: string): Promise<SoptMember | null>;
  findById(id: number): Promise<SoptMember | null>;
  setUserId(memberId: number, userId: number): Promise<void>;
}

interface SoptMember {
  id: number;
  name: string | null;
  email: string;
  generation: number;
  userId: number | null;
}

interface SoptMemberRepositoryDeps {
  db: Database;
}

export function createSoptMemberRepsitory({ db }: SoptMemberRepositoryDeps): SoptMemberRepsitory {
  return {
    async findByEmail(email) {
      const ret = await db
        .selectFrom("sopt_member")
        .select(["name", "email", "user_id", "id", "generation"])
        .where("email", "=", email)
        .executeTakeFirst();

      if (!ret) {
        return null;
      }
      return {
        id: ret.id ?? -1,
        name: ret.name ?? null,
        generation: ret.generation,
        email: ret.email,
        userId: ret.user_id ?? null,
      };
    },
    async findById(id) {
      const ret = await db
        .selectFrom("sopt_member")
        .select(["name", "email", "user_id", "generation", "id"])
        .where("id", "=", id)
        .executeTakeFirst();

      if (!ret) {
        return null;
      }

      return {
        id: ret.id ?? -1,
        name: ret.name ?? null,
        generation: ret.generation,
        email: ret.email,
        userId: ret.user_id ?? null,
      };
    },
    async setUserId(memberId, userId) {
      await db
        .updateTable("sopt_member")
        .where("id", "=", memberId)
        .set({
          user_id: userId,
        })
        .executeTakeFirstOrThrow();
    },
  };
}
