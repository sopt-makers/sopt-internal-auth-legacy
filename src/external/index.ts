import { EmailExternal } from "./email";
import { FacebookAPIExternal } from "./facebookAPI";
import { WebHookExternal } from "./webHook";

export interface Externals {
  email: EmailExternal;
  facebookAPI: FacebookAPIExternal;
  webHook: WebHookExternal;
}
