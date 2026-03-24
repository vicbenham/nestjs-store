import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendNewOrderNotification(
    to: string,
    merchantName: string,
    amount: number,
    description: string,
  ) {
    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'New order',
      text: `Hello ${merchantName}, you just received an order for ${amount}€ : ${description}`,
    });

    this.logger.log(`Email sent to ${to} — ID: ${info.messageId}`);
  }

  async sendNewMerchantNotification(name: string, email: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_FROM,
      subject: 'New Merchant registered',
      text: `New Merchant : ${name} (${email})`,
    });
  }
}
