import to from "await-to-js";

import { EmailRepository } from "../repository/email";
import { SoptPersonRepsitory } from "../repository/soptPerson";
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
  soptPersonRepository: SoptPersonRepsitory;
  userRepository: UserRepository;
  tokenService: TokenService;
}

export function createRegisterService({
  emailRepository,
  soptPersonRepository,
  userRepository,
  tokenService,
}: RegisterServiceDeps): RegisterService {
  return {
    async sendRegisterLinkByEmail(email) {
      const soptPerson = await soptPersonRepository.findByEmail(email);

      if (!soptPerson) {
        return;
      }

      if (soptPerson.userId !== null) {
        return;
      }

      const code = await tokenService.createRegisterToken(soptPerson.id);

      await emailRepository.sendEmail(email, "SOPT 회원 인증", `code: ${code}`);
    },
    async getRegisterInfo(token) {
      const [err, ret] = await to(tokenService.verifyRegisterToken(token));
      if (err) {
        return null;
      }

      const member = await soptPersonRepository.findById(ret.userId);

      return {
        name: member?.name ?? "",
      };
    },
    async processRegister(token, data) {
      const [err, ret] = await to(tokenService.verifyRegisterToken(token));
      if (err) {
        return { success: false };
      }

      const member = await soptPersonRepository.findById(ret.userId);

      await userRepository.createUser({
        name: member?.name ?? data.name,
      });

      return { success: true };
    },
  };
}
