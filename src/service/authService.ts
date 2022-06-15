import { FacebookAPIExternal } from "../external/facebookAPI";
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
}

export function createAuthService({
  facebookAPIExternal,
  webHookExternal,
  facebookAuthRepository,
  userRepository,
  soptMemberRepository,
  tokenClient,
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

      const soptMemberInfo = await soptMemberRepository.findById(registerTokenInfo.soptMemberId);
      if (soptMemberInfo === null) {
        throw new Error(`Member id ${registerTokenInfo.soptMemberId} not found.`);
      }

      if (soptMemberInfo.userId !== null) {
        return {
          success: false,
          status: "alreadyTaken",
        };
      }

      const createdUser = await userRepository.createUser({
        name: soptMemberInfo.name ?? "알 수 없음",
        generation: soptMemberInfo.generation,
      });

      await soptMemberRepository.setUserId(registerTokenInfo.soptMemberId, createdUser.userId);
      await facebookAuthRepository.create({ authId: fbUserInfo.userId, userId: createdUser.userId });

      const accessToken = await tokenClient.createAuthToken({ userId: createdUser.userId });

      await webHookExternal.callOnRegister({
        userId: createdUser.userId,
        name: createdUser.name,
        generation: createdUser.generation,
      });

      return {
        success: true,
        accessToken,
      };
    },
  };
}
