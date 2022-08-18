import nodemailer from "nodemailer";

import { ServerConfig } from "../config";

export interface EmailExternal {
  sendEmail(to: string, subject: string, html: string): Promise<{ accepted: unknown[] }>;
}

interface EmailExternalDeps {
  config: ServerConfig;
}

export async function createEmailExternal({ config }: EmailExternalDeps): Promise<EmailExternal> {
  let transporter: nodemailer.Transporter;

  const setTransporter = async () => {
    const { host, port, secure, user, pass } = await config.get("EMAIL_CONFIG");

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  };

  config.subscribe("EMAIL_CONFIG", async () => {
    await setTransporter();
  });

  await setTransporter();

  return {
    async sendEmail(to, subject, html) {
      const { senderAddress } = await config.get("EMAIL_CONFIG");

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
