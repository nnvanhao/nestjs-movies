// src/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService as Mailer } from '@nestjs-modules/mailer';
import { encrypt } from 'src/utils/securities';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: Mailer) {}

  async sendEmailForActiveUser(user: { id: string; email: string }) {
    const token = encrypt(user?.id, process.env.SECRET_KEY);
    const url = `${process.env.CLIENT_WEB_URL}/auth/active-user?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nest App! Accept your email to active account',
      template: './activeUser',
      context: {
        name: '',
        url,
      },
    });
  }

  async sendEmailForForgotPassword(user: { email: string }) {
    const token = encrypt(user?.email, process.env.SECRET_KEY);
    const url = `${process.env.CLIENT_WEB_URL}/auth/forgot-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request for Your Account',
      template: './forgotPassword',
      context: {
        name: '',
        url,
      },
    });
  }
}
