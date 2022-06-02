import nodemailer from "nodemailer";

export interface EmailRepository {
  sendEmail(to: string, subject: string, html: string): Promise<{ accepted: unknown[] }>;
}

interface EmailRepositoryDeps {
  senderAddress: string;
}

export function createEmailRepository({ senderAddress }: EmailRepositoryDeps): EmailRepository {
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
