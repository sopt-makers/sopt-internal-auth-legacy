import nodemailer from "nodemailer";

import { ServerConfig } from "../config";

export interface EmailExternal {
  sendEmail(to: string, subject: string, html: string): Promise<{ accepted: unknown[] }>;
}

interface EmailExternalDeps {
  config: ServerConfig;
}

export async function createEmailExternal({ config }: EmailExternalDeps): Promise<EmailExternal> {
  const { host, port, secure, user, pass, senderAddress } = await config.get("EMAIL_CONFIG");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return {
    async sendEmail(to, subject, html) {
      const res = await transporter.sendMail({
        sender: `<${senderAddress}>`,
        to: to,
        subject,
        html,
      });
      return res;
    },
  };
}
