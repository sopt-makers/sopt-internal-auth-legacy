import nodemailer from "nodemailer";

export interface EmailExternal {
  sendEmail(to: string, subject: string, html: string): Promise<SendEmailResult>;
}

interface SendEmailResult {
  accepted: unknown[];
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  senderAddress: string;
}

export class NodeMailerEmailExternal implements EmailExternal {
  private transporter: nodemailer.Transporter;
  private senderAddress: string;

  constructor(emailConfig: EmailConfig) {
    const { host, port, secure, user, pass, senderAddress } = emailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    this.senderAddress = senderAddress;
  }

  async sendEmail(to: string, subject: string, html: string): Promise<SendEmailResult> {
    const res = await this.transporter.sendMail({
      sender: `<${this.senderAddress}>`,
      to: to,
      subject,
      html,
    });
    return res;
  }
}
