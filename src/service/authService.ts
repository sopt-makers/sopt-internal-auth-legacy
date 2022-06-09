import { FacebookAPIExternal } from "../external/facebookAPI";
import { TokenClient } from "../lib/token";
import { FacebookAuthRepository } from "../repository/facebookAuth";
import { SoptMemberRepsitory } from "../repository/soptPerson";
import { UserRepository } from "../repository/user";

export interface AuthService {
  authByFacebook(code: string): Promise<{ accessToken: string } | null>;
  registerByFacebook(registerToken: string, code: string): Promise<{ accessToken: string } | null>;
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
        return null;
      }

      const fbUserInfo = await facebookAPIExternal.getAccessTokenInfo(fbAccessToken);

      const userInfo = await facebookAuthRepository.findByAuthId(fbUserInfo.userId);
      if (!userInfo) {
        return null;
      }

      const accessToken = await tokenClient.createAuthToken({ userId: userInfo.userId });

      return {
        accessToken,
      };
    },
    async registerByFacebook(registerToken, code) {
      const registerTokenInfo = await tokenClient.verifyRegisterToken(registerToken);
      const fbAccessToken = await facebookAPIExternal.getAccessTokenByCode(code);

      if (!registerTokenInfo || !fbAccessToken) {
        return null;
      }

      const fbUserInfo = await facebookAPIExternal.getAccessTokenInfo(fbAccessToken);

      const soptMemberInfo = await soptMemberRepository.findById(registerTokenInfo.soptMemberId);
      if (!soptMemberInfo) {
        return null;
      }

      const createdUser = await userRepository.createUser({ name: fbUserInfo.userName });

      await soptMemberRepository.setUserId(registerTokenInfo.soptMemberId, createdUser.userId);
      await facebookAuthRepository.create({ authId: fbUserInfo.userId, userId: createdUser.userId });

      const accessToken = await tokenClient.createAuthToken({ userId: createdUser.userId });

      return {
        accessToken,
      };
    },
  };
}
