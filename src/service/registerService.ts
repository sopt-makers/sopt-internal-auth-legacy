import to from "await-to-js";

import { EmailRepository } from "../repository/email";
import { SoptMemberRepsitory } from "../repository/soptPerson";
import { UserRepository } from "../repository/user";
import { TokenService } from "./tokenService";

export interface RegisterService {
  sendRegisterLinkByEmail(email: string): Promise<void>;
  getRegisterInfo(token: string): Promise<{
    name: string;
  } | null>;
  processRegister(token: string, data: { name: string }): Promise<{ success: boolean }>;
}

interface RegisterServiceDeps {
  emailRepository: EmailRepository;
  soptMemberRepository: SoptMemberRepsitory;
  userRepository: UserRepository;
  tokenService: TokenService;
}

export function createRegisterService({
  emailRepository,
  soptMemberRepository: soptMemberRepository,
  userRepository,
  tokenService,
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

      const code = await tokenService.createRegisterToken(soptMember.id);

      await emailRepository.sendEmail(email, "SOPT 회원 인증", `code: ${code}`);
    },
    async getRegisterInfo(token) {
      const registerTokenInfo = await tokenService.verifyRegisterToken(token);
      if (!registerTokenInfo) {
        return null;
      }

      const member = await soptMemberRepository.findById(registerTokenInfo.soptMemberId);

      return {
        name: member?.name ?? "",
      };
    },
    async processRegister(token, data) {
      const [err, ret] = await to(tokenService.verifyRegisterToken(token));
      if (err) {
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
