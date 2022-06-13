import { createEmailExternal, EmailExternal } from "./email";
import { createFacebookAPIExternal, FacebookAPIExternal } from "./facebookAPI";

export interface Externals {
  email: EmailExternal;
  facebookAPI: FacebookAPIExternal;
}

interface ExternalsDeps {
  facebookAppId: string;
  facebookAppSecret: string;
  facebookAppRedirectUriAuth: string;
  facebookAppRedirectUriRegister: string;
}

export function createExternals({
  facebookAppId,
  facebookAppSecret,
  facebookAppRedirectUriAuth,
  facebookAppRedirectUriRegister,
}: ExternalsDeps): Externals {
  return {
    email: createEmailExternal({ senderAddress: "asdf" }),
    facebookAPI: createFacebookAPIExternal({
      clientAppId: facebookAppId,
      redirectUriAuth: facebookAppRedirectUriAuth,
      redirectUriRegister: facebookAppRedirectUriRegister,
      clientSecret: facebookAppSecret,
    }),
  };
}
