import { EmailExternal } from "../external/email";
import { TokenClient } from "../lib/token";
import { SoptMemberRepsitory } from "../repository/soptPerson";
import { UserRepository } from "../repository/user";

export interface RegisterService {
  sendRegisterLinkByEmail(email: string): Promise<void>;
  getRegisterInfo(token: string): Promise<{
    name: string;
  } | null>;
  processRegister(token: string, data: { name: string }): Promise<{ success: boolean }>;
}

interface RegisterServiceDeps {
  emailExternal: EmailExternal;
  soptMemberRepository: SoptMemberRepsitory;
  userRepository: UserRepository;
  tokenClient: TokenClient;
}

export function createRegisterService({
  emailExternal: emailRepository,
  soptMemberRepository: soptMemberRepository,
  userRepository,
  tokenClient,
}: RegisterServiceDeps): RegisterService {
  return {
    async sendRegisterLinkByEmail(email) {
      const soptMember = await soptMemberRepository.findByEmail(email);

      if (!soptMember) {
        return;
      }

      if (soptMember.userId !== null) {
        return;
      }

      const code = await tokenClient.createRegisterToken(soptMember.id);

      await emailRepository.sendEmail(email, "SOPT 회원 인증", `code: ${code}`);
    },
    async getRegisterInfo(token) {
      const registerTokenInfo = await tokenClient.verifyRegisterToken(token);
      if (!registerTokenInfo) {
        return null;
      }

      const member = await soptMemberRepository.findById(registerTokenInfo.soptMemberId);

      return {
        name: member?.name ?? "",
      };
    },
    async processRegister(token, data) {
      const ret = await tokenClient.verifyRegisterToken(token);
      if (!ret) {
        return { success: false };
      }

      const member = await soptMemberRepository.findById(ret.soptMemberId);

      await userRepository.createUser({
        name: member?.name ?? data.name,
      });

      return { success: true };
    },
  };
}
