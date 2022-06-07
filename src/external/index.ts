import { createEmailExternal, EmailExternal } from "./email";
import { createFacebookAPIExternal, FacebookAPIExternal } from "./facebookAPI";

export interface Externals {
  email: EmailExternal;
  facebookAPI: FacebookAPIExternal;
}

interface ExternalsDeps {
  facebookAppId: string;
  facebookAppSecret: string;
  facebookAppRedirectUri: string;
}

export function createExternals({
  facebookAppId,
  facebookAppSecret,
  facebookAppRedirectUri,
}: ExternalsDeps): Externals {
  return {
    email: createEmailExternal({ senderAddress: "asdf" }),
    facebookAPI: createFacebookAPIExternal({
      clientAppId: facebookAppId,
      redirectUri: facebookAppRedirectUri,
      clientSecret: facebookAppSecret,
    }),
  };
}
