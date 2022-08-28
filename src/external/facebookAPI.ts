import to from "await-to-js";
import axios from "axios";

import { ServerConfig } from "../config";

export interface FacebookAPIExternal {
  getAccessTokenByCode(code: string, redirectType: "auth" | "register"): Promise<string | null>;
  getAccessTokenInfo(accessToken: string): Promise<{
    userId: string;
    userName: string;
  }>;
}

interface FacebokAPIExternalDeps {
  config: ServerConfig;
}

export function createFacebookAPIExternal({ config }: FacebokAPIExternalDeps): FacebookAPIExternal {
  return {
    async getAccessTokenByCode(code, redirectType) {
      const { redirectUriAuth, redirectUriRegister, clientAppId, clientSecret } = await config.get("FACEBOOK_OAUTH");

      const redirectUri = redirectType === "auth" ? redirectUriAuth : redirectUriRegister;

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
          console.error("Error occured in getAccessTokenByCode: ", err.response?.data);
        }
        return null;
      }

      return ret.data.access_token;
    },
    async getAccessTokenInfo(accessToken) {
      const [err, res] = await to(
        axios.get("https://graph.facebook.com/me", {
          params: {
            access_token: accessToken,
          },
        }),
      );

      if (err) {
        if (axios.isAxiosError(err)) {
          console.log(err.response?.data);
        }

        throw err;
      }

      const data = res.data;

      return {
        userId: data.id,
        userName: data.name,
      };
    },
  };
}
