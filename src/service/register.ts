import to from "await-to-js";

import { createRegisterEmailHTML } from "../assets/emailTemplate";
import { ServerConfig } from "../config";
import { EmailExternal } from "../external/email";
import { Notifier } from "../external/notifier";
import { TokenClient } from "../lib/token";
import { SoptMemberRepsitory } from "../repository/soptMember";

export interface RegisterService {
  sendRegisterLinkByEmail(
    email: string,
  ): Promise<{ status: "success" | "invalidEmail" | "alreadyTaken" | "cannotSendEmail" }>;
  getRegisterInfo(token: string): Promise<
    | {
        success: true;
        name: string;
        generation: number;
      }
    | { success: false }
  >;
}

interface RegisterServiceDeps {
  emailExternal: EmailExternal;
  soptMemberRepository: SoptMemberRepsitory;
  tokenClient: TokenClient;
  config: ServerConfig;
  notifier: Notifier;
}

export function createRegisterService({
  emailExternal,
  soptMemberRepository,
  tokenClient,
  config,
  notifier,
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

      const [err] = await to(
        emailExternal.sendEmail(
          email,
          "SOPT 회원 인증",
          createRegisterEmailHTML({
            name: soptMember.name ?? "이름 없음",
            registerPageUriTemplate: await config.get("REGISTER_PAGE_URL_TEMPLATE"),
            token,
          }),
        ),
      );

      if (err) {
        console.error(err);
        notifier.notifyError("이메일 전송 실패", err);
        return {
          status: "cannotSendEmail",
        };
      }

      return {
        status: "success",
      };
    },
    async getRegisterInfo(token) {
      const registerTokenInfo = await tokenClient.verifyRegisterToken(token);
      if (!registerTokenInfo) {
        return { success: false };
      }

      const member = await soptMemberRepository.findById(registerTokenInfo.soptMemberId);
      if (!member) {
        return { success: false };
      }

      return {
        success: true,
        name: member.name ?? "",
        generation: member.generation,
      };
    },
  };
}
