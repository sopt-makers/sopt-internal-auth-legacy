import { FacebookAPIRepository } from "../repository/facebookAPI";
import { FacebookAuthRepository } from "../repository/facebookAuth";
import { SoptMemberRepsitory } from "../repository/soptPerson";
import { UserRepository } from "../repository/user";
import { TokenService } from "./tokenService";

export interface AuthService {
  authByFacebook(code: string): Promise<{ accessToken: string } | null>;
  registerByFacebook(registerToken: string, code: string): Promise<{ accessToken: string } | null>;
}

interface AuthServiceDeps {
  facebookAPIRepository: FacebookAPIRepository;
  facebookAuthRepository: FacebookAuthRepository;
  userRepository: UserRepository;
  soptMemberRepository: SoptMemberRepsitory;
  tokenService: TokenService;
}

export function createAuthService({
  facebookAPIRepository,
  facebookAuthRepository,
  userRepository,
  soptMemberRepository,
  tokenService,
}: AuthServiceDeps): AuthService {
  return {
    async authByFacebook(code) {
      const fbAccessToken = await facebookAPIRepository.getAccessTokenByCode(code);
      if (!fbAccessToken) {
        return null;
      }

      const fbUserInfo = await facebookAPIRepository.getAccessTokenInfo(fbAccessToken);

      const userInfo = await facebookAuthRepository.findByAuthId(fbUserInfo.userId);
      if (!userInfo) {
        return null;
      }

      const accessToken = await tokenService.createAuthToken({ userId: userInfo.userId });

      return {
        accessToken,
      };
    },
    async registerByFacebook(registerToken, code) {
      const registerTokenInfo = await tokenService.verifyRegisterToken(registerToken);
      if (!registerTokenInfo) {
        return null;
      }

      const fbAccessToken = await facebookAPIRepository.getAccessTokenByCode(code);
      if (!fbAccessToken) {
        return null;
      }

      const fbUserInfo = await facebookAPIRepository.getAccessTokenInfo(fbAccessToken);

      const soptMemberInfo = await soptMemberRepository.findById(registerTokenInfo.soptMemberId);
      if (!soptMemberInfo) {
        return null;
      }

      const createdUser = await userRepository.createUser({ name: fbUserInfo.userName });

      await soptMemberRepository.setUserId(registerTokenInfo.soptMemberId, createdUser.userId);
      await facebookAuthRepository.create({ authId: fbUserInfo.userId, userId: createdUser.userId });

      const accessToken = await tokenService.createAuthToken({ userId: createdUser.userId });

      return {
        accessToken,
      };
    },
  };
}
