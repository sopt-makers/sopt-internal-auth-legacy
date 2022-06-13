import nodemailer from "nodemailer";

export interface EmailExternal {
  sendEmail(to: string, subject: string, html: string): Promise<{ accepted: unknown[] }>;
}

interface EmailExternalDeps {
  emailSenderAddress: string;
  emailHost: string;
  emailUser: string;
  emailPass: string;
}

export function createEmailExternal({
  emailSenderAddress,
  emailHost,
  emailUser,
  emailPass,
}: EmailExternalDeps): EmailExternal {
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return {
    async sendEmail(to, subject, html) {
      const res = await transporter.sendMail({
        sender: `<${emailSenderAddress}>`,
        to: to,
        subject,
        html,
      });
      return res;
    },
  };
}
