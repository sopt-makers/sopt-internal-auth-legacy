import { FacebookAPIExternal } from "../external/facebookAPI";
import { TokenClient } from "../lib/token";
import { FacebookAuthRepository } from "../repository/facebookAuth";
import { SoptMemberRepsitory } from "../repository/soptPerson";
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
  facebookAuthRepository: FacebookAuthRepository;
  userRepository: UserRepository;
  soptMemberRepository: SoptMemberRepsitory;
  tokenClient: TokenClient;
}

export function createAuthService({
  facebookAPIExternal,
  facebookAuthRepository,
  userRepository,
  soptMemberRepository,
  tokenClient,
}: AuthServiceDeps): AuthService {
  return {
    async authByFacebook(code) {
      const fbAccessToken = await facebookAPIExternal.getAccessTokenByCode(code);
      if (!fbAccessToken) {
        return {
          success: false,
          status: "idpFailed",
        };
      }

      const fbUserInfo = await facebookAPIExternal.getAccessTokenInfo(fbAccessToken);

      const userInfo = await facebookAuthRepository.findByAuthId(fbUserInfo.userId);
      if (!userInfo) {
        return { success: false, status: "idpFailed" };
      }

      const accessToken = await tokenClient.createAuthToken({ userId: userInfo.userId });

      return { success: true, accessToken };
    },
    async registerByFacebook(registerToken, code) {
      const registerTokenInfo = await tokenClient.verifyRegisterToken(registerToken);
      const fbAccessToken = await facebookAPIExternal.getAccessTokenByCode(code);

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
        name: fbUserInfo.userName,
        generation: soptMemberInfo.generation,
      });

      await soptMemberRepository.setUserId(registerTokenInfo.soptMemberId, createdUser.userId);
      await facebookAuthRepository.create({ authId: fbUserInfo.userId, userId: createdUser.userId });

      const accessToken = await tokenClient.createAuthToken({ userId: createdUser.userId });

      return {
        success: true,
        accessToken,
      };
    },
  };
}
