import { Database } from "../database";

export interface FacebookAuthRepository {
  findByUserId(userId: number): Promise<FBRecord | null>;
  findByAuthId(authId: string): Promise<FBRecord | null>;
  create(data: { authId: string; userId: number }): Promise<FBRecord>;
  setAccessToken(authId: string, accessToken: string): Promise<void>;
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
        .selectFrom("users_facebook_auth")
        .select(["facebook_access_token", "facebook_auth_id", "user_id"])
        .where("user_id", "=", userId)
        .executeTakeFirst();

      if (!ret) {
        return null;
      }

      return {
        accessToken: ret.facebook_access_token ?? undefined,
        authId: ret.facebook_auth_id,
        userId: ret.user_id,
      };
    },
    async findByAuthId(authId) {
      const ret = await db
        .selectFrom("users_facebook_auth")
        .select(["facebook_access_token", "facebook_auth_id", "user_id"])
        .where("facebook_auth_id", "=", authId)
        .executeTakeFirst();

      if (!ret) {
        return null;
      }

      return {
        accessToken: ret.facebook_access_token ?? undefined,
        authId: ret.facebook_auth_id,
        userId: ret.user_id,
      };
    },
    async create({ authId, userId }) {
      await db
        .insertInto("users_facebook_auth")
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
    async setAccessToken(authId, accessToken) {
      await db
        .updateTable("users_facebook_auth")
        .set({
          facebook_access_token: accessToken,
        })
        .where("facebook_auth_id", "=", authId);
    },
  };
}
