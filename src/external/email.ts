import nodemailer from "nodemailer";

export interface EmailExternal {
  sendEmail(to: string, subject: string, html: string): Promise<{ accepted: unknown[] }>;
}

interface EmailExternalDeps {
  senderAddress: string;
}

export function createEmailExternal({ senderAddress }: EmailExternalDeps): EmailExternal {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "tracy.farrell29@ethereal.email",
      pass: "NAECkdf8j4yxgMjJhz",
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
