import { Database } from "../database";

export interface SoptPersonRepsitory {
  findByEmail(email: string): Promise<SoptPerson | null>;
  findById(id: number): Promise<SoptPerson | null>;
}

interface SoptPerson {
  id: number;
  name: string | null;
  email: string;
  userId: number | null;
}

interface SoptPersonRepositoryDeps {
  db: Database;
}

export function createSoptPersonRepsitory({ db }: SoptPersonRepositoryDeps): SoptPersonRepsitory {
  return {
    async findByEmail(email) {
      const ret = await db
        .selectFrom("sopt_member")
        .select(["name", "email", "user_id", "id"])
        .where("email", "=", email)
        .executeTakeFirst();

      if (!ret) {
        return null;
      }
      return {
        id: ret.id ?? -1,
        name: ret.name ?? null,
        email: ret.email,
        userId: ret.user_id ?? null,
      };
    },
    async findById(id) {
      const ret = await db
        .selectFrom("sopt_member")
        .select(["name", "email", "user_id", "id"])
        .where("id", "=", id)
        .executeTakeFirst();

      if (!ret) {
        return null;
      }

      return {
        id: ret.id ?? -1,
        name: ret.name ?? null,
        email: ret.email,
        userId: ret.user_id ?? null,
      };
    },
  };
}
