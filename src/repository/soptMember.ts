import { Database } from "../database";

export interface SoptMemberRepsitory {
  findByEmail(email: string): Promise<SoptMember[]>;
  findById(id: number): Promise<SoptMember | null>;
  setMemberJoined(memberEmail: string, joined?: boolean): Promise<void>;
}

interface SoptMember {
  id: number;
  name: string | null;
  email: string;
  generation: number;
  joined: boolean;
}

interface SoptMemberRepositoryDeps {
  db: Database;
}

export function createSoptMemberRepsitory({ db }: SoptMemberRepositoryDeps): SoptMemberRepsitory {
  return {
    async findByEmail(email) {
      const ret = await db
        .selectFrom("AUTH_sopt_member")
        .select(["name", "email", "id", "generation", "joined"])
        .where("email", "=", email)
        .orderBy("generation", "asc")
        .execute();

      return ret.map((item) => ({
        id: item.id ?? -1,
        name: item.name ?? null,
        generation: item.generation,
        email: item.email,
        joined: item.joined ?? false,
      }));
    },
    async findById(id) {
      const ret = await db
        .selectFrom("AUTH_sopt_member")
        .select(["name", "email", "joined", "generation", "id"])
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
        joined: ret.joined ?? false,
      };
    },
    async setMemberJoined(memberEmail, joined = true) {
      await db
        .updateTable("AUTH_sopt_member")
        .where("email", "=", memberEmail)
        .set({
          joined,
        })
        .executeTakeFirstOrThrow();
    },
  };
}
