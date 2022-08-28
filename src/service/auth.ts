import { FacebookAPIExternal } from "../external/facebookAPI";
import { Notifier } from "../external/notifier";
import { WebHookExternal } from "../external/webHook";
import { TokenClient } from "../lib/token";
import { FacebookAuthRepository } from "../repository/facebookAuth";
import { SoptMemberRepsitory } from "../repository/soptMember";
import { UserRepository } from "../repository/user";

export interface AuthService {
  authByFacebook(
    code: string,
  ): Promise<{ success: true; accessToken: string } | { success: false; status: "invalidUser" | "idpFailed" }>;
  registerByFacebook(
    registerToken: string,
    code: string,
  ): Promise<
    { success: true; accessToken: string } | { success: false; status: "idpFailed" | "tokenInvalid" | "alreadyTaken" }
  >;
}

interface AuthServiceDeps {
  facebookAPIExternal: FacebookAPIExternal;
  webHookExternal: WebHookExternal;
  facebookAuthRepository: FacebookAuthRepository;
  userRepository: UserRepository;
  soptMemberRepository: SoptMemberRepsitory;
  tokenClient: TokenClient;
  notifier: Notifier;
}

export function createAuthService({
  facebookAPIExternal,
  webHookExternal,
  facebookAuthRepository,
  userRepository,
  soptMemberRepository,
  tokenClient,
  notifier,
}: AuthServiceDeps): AuthService {
  return {
    async authByFacebook(code) {
      const fbAccessToken = await facebookAPIExternal.getAccessTokenByCode(code, "auth");
      if (!fbAccessToken) {
        return {
          success: false,
          status: "idpFailed",
        };
      }

      const fbUserInfo = await facebookAPIExternal.getAccessTokenInfo(fbAccessToken);

      const userInfo = await facebookAuthRepository.findByAuthId(fbUserInfo.userId);
      if (!userInfo) {
        return { success: false, status: "invalidUser" };
      }

      const accessToken = await tokenClient.createAuthToken({ userId: userInfo.userId });

      return { success: true, accessToken };
    },
    async registerByFacebook(registerToken, code) {
      const registerTokenInfo = await tokenClient.verifyRegisterToken(registerToken);
      const fbAccessToken = await facebookAPIExternal.getAccessTokenByCode(code, "register");

      if (!registerTokenInfo) {
        return {
          success: false,
          status: "tokenInvalid",
        };
      }
      if (!fbAccessToken) {
        return {
          success: false,
          status: "idpFailed",
        };
      }

      const fbUserInfo = await facebookAPIExternal.getAccessTokenInfo(fbAccessToken);

      const soptMemberInfos = await soptMemberRepository.findByEmail(registerTokenInfo.registerEmail);
      if (soptMemberInfos.length === 0) {
        throw new Error(`Member email ${registerTokenInfo.registerEmail} not found.`);
      }

      if (soptMemberInfos.some((item) => item.joined)) {
        return {
          success: false,
          status: "alreadyTaken",
        };
      }

      const soptMemberInfo = soptMemberInfos[0];

      const createdUser = await userRepository.createUser({
        name: soptMemberInfo.name ?? "알 수 없음",
        generation: soptMemberInfo.generation,
      });

      await soptMemberRepository.setMemberJoined(registerTokenInfo.registerEmail);
      await facebookAuthRepository.create({ authId: fbUserInfo.userId, userId: createdUser.userId });

      const accessToken = await tokenClient.createAuthToken({ userId: createdUser.userId });

      await webHookExternal.callOnRegister({
        userId: createdUser.userId,
        name: createdUser.name,
        generation: createdUser.generation,
      });

      notifier.notifyUserRegistrer({
        name: createdUser.name ?? "Unknown",
        generation: createdUser.generation,
      });

      return {
        success: true,
        accessToken,
      };
    },
  };
}
