import { createRegisterEmailHTML } from "../assets/emailTemplate";
import { EmailExternal } from "../external/email";
import { TokenClient } from "../lib/token";
import { SoptMemberRepsitory } from "../repository/soptPerson";

export interface RegisterService {
  sendRegisterLinkByEmail(email: string): Promise<{ status: "success" | "invalidEmail" | "alreadyTaken" }>;
  getRegisterInfo(token: string): Promise<{
    name: string;
    generation: number;
  } | null>;
}

interface RegisterServiceDeps {
  emailExternal: EmailExternal;
  soptMemberRepository: SoptMemberRepsitory;
  tokenClient: TokenClient;
  registerPageUriTemplate: string;
}

export function createRegisterService({
  emailExternal: emailRepository,
  soptMemberRepository: soptMemberRepository,
  tokenClient,
  registerPageUriTemplate,
}: RegisterServiceDeps): RegisterService {
  return {
    async sendRegisterLinkByEmail(email) {
      const soptMember = await soptMemberRepository.findByEmail(email);
      if (!soptMember) {
        return {
          status: "invalidEmail",
        };
      }

      if (soptMember.userId !== null) {
        return {
          status: "alreadyTaken",
        };
      }

      const token = await tokenClient.createRegisterToken(soptMember.id);

      await emailRepository.sendEmail(
        email,
        "SOPT 회원 인증",
        createRegisterEmailHTML({
          name: soptMember.name ?? "이름 없음",
          registerPageUriTemplate,
          token,
        }),
      );

      return {
        status: "success",
      };
    },
    async getRegisterInfo(token) {
      const registerTokenInfo = await tokenClient.verifyRegisterToken(token);
      if (!registerTokenInfo) {
        return null;
      }

      const member = await soptMemberRepository.findById(registerTokenInfo.soptMemberId);
      if (!member) {
        return null;
      }

      return {
        name: member.name ?? "",
        generation: member.generation,
      };
    },
  };
}
