import { FacebookAPIRepository } from "../repository/facebookAPI";
import { FacebookAuthRepository } from "../repository/facebookAuth";
import { UserRepository } from "../repository/user";

const SOPT_NOTICE_GROUP_ID = "1392673424331756";

export interface UserService {
  verifySOPTUser(userId: number): Promise<boolean>;
}

interface UserServiceDeps {
  facebookAPIRepository: FacebookAPIRepository;
  facebookAuthRepository: FacebookAuthRepository;
  userRepository: UserRepository;
}

export function createUserService({
  facebookAPIRepository,
  facebookAuthRepository,
  userRepository,
}: UserServiceDeps): UserService {
  return {
    async verifySOPTUser(userId) {
      const userInfo = await userRepository.getUserByUserId(userId);
      if (userInfo?.is_sopt_member) {
        return true;
      }

      const fbInfo = await facebookAuthRepository.findByUserId(userId);
      if (!fbInfo || !fbInfo.accessToken) {
        return false;
      }

      const groupInfo = await facebookAPIRepository.getGroupInfo(fbInfo.authId, fbInfo.accessToken);

      const soptNotice = groupInfo.find((group) => group.groupId === SOPT_NOTICE_GROUP_ID);
      if (!soptNotice) {
        return false;
      }

      await userRepository.setUserVerified(userId);
      return true;
    },
  };
}
