import { Database } from "../database";

export interface FacebookAuthRepository {
  findByUserId(userId: number): Promise<FBRecord | null>;
  findByAuthId(authId: string): Promise<FBRecord | null>;
  create(data: { authId: string; userId: number }): Promise<FBRecord>;
}

interface FBRecord {
  accessToken?: string;
  authId: string;
  userId: number;
}

interface FacebookAuthRepositoryDeps {
  db: Database;
}

export function createFacebookAuthRepository({ db }: FacebookAuthRepositoryDeps): FacebookAuthRepository {
  return {
    async findByUserId(userId) {
      const ret = await db
        .selectFrom("AUTH_idp_facebook")
        .select(["facebook_auth_id", "user_id"])
        .where("user_id", "=", userId)
        .executeTakeFirst();

      if (!ret) {
        return null;
      }

      return {
        authId: ret.facebook_auth_id,
        userId: ret.user_id,
      };
    },
    async findByAuthId(authId) {
      const ret = await db
        .selectFrom("AUTH_idp_facebook")
        .select(["facebook_auth_id", "user_id"])
        .where("facebook_auth_id", "=", authId)
        .executeTakeFirst();

      if (!ret) {
        return null;
      }

      return {
        authId: ret.facebook_auth_id,
        userId: ret.user_id,
      };
    },
    async create({ authId, userId }) {
      await db
        .insertInto("AUTH_idp_facebook")
        .values({
          facebook_auth_id: authId,
          user_id: userId,
        })
        .execute();

      return {
        authId: authId,
        userId: userId,
      };
    },
  };
}
