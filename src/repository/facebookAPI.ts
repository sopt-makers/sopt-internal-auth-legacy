import axios from "axios";

export interface FacebookAPIRepository {
  getAccessTokenByCode(code: string): Promise<{
    accessToken: string;
  }>;
  getAccessTokenInfo(accessToken: string): Promise<{
    userId: string;
    scopes: string[];
  }>;
}

interface FacebokAPIRepositoryDeps {
  clientAppId: string;
  redirectUri: string;
  clientSecret: string;
  adminToken: string;
}

export function createFacebookAPIRepository({
  clientAppId,
  clientSecret,
  redirectUri,
  adminToken,
}: FacebokAPIRepositoryDeps): FacebookAPIRepository {
  return {
    async getAccessTokenByCode(code) {
      const ret = await axios.get("https://graph.facebook.com/v13.0/oauth/access_token", {
        params: {
          client_id: clientAppId,
          redirect_uri: redirectUri,
          client_secret: clientSecret,
          code: code,
        },
      });

      return {
        accessToken: ret.data.access_token,
      };
    },
    async getAccessTokenInfo(accessToken) {
      const res = await axios.get("https://graph.facebook.com/debug_token", {
        params: {
          input_token: accessToken,
          access_token: adminToken,
        },
      });

      const { data } = res.data;

      return {
        userId: data.user_id,
        scopes: data.scopes,
      };
    },
  };
}
