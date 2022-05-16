import to from "await-to-js";
import axios from "axios";

export interface FacebookAPIRepository {
  getAccessTokenByCode(code: string): Promise<string | null>;
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
}: FacebokAPIRepositoryDeps): FacebookAPIRepository {
  async function getAppAccessToken(): Promise<string> {
    const res = await axios.get("https://graph.facebook.com/oauth/access_token", {
      params: {
        client_id: clientAppId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      },
    });

    const accessToken = res.data.access_token;

    return accessToken;
  }

  return {
    async getAccessTokenByCode(code) {
      const [err, ret] = await to(
        axios.get("https://graph.facebook.com/v13.0/oauth/access_token", {
          params: {
            client_id: clientAppId,
            redirect_uri: redirectUri,
            client_secret: clientSecret,
            code: code,
          },
        }),
      );

      if (err) {
        if (axios.isAxiosError(err)) {
          console.log("Error occured in getAccessTokenByCode: ", err.response?.data);
        }
        return null;
      }

      return ret.data.access_token;
    },
    async getAccessTokenInfo(accessToken) {
      const adminToken = await getAppAccessToken();

      const [err, res] = await to(
        axios.get("https://graph.facebook.com/debug_token", {
          params: {
            input_token: accessToken,
            access_token: adminToken,
          },
        }),
      );

      if (err) {
        if (axios.isAxiosError(err)) {
          console.log(err.response?.data);
        }

        throw err;
      }

      const { data } = res.data;

      return {
        userId: data.user_id,
        scopes: data.scopes,
      };
    },
  };
}
