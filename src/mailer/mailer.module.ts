// src/mailer/mailer.module.ts
import { MailerModule as Mailer } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Mailer.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Log environment variables
        console.log(
          'BREVO_SMTP_HOST:',
          configService.get<string>('BREVO_SMTP_HOST'),
        );
        console.log(
          'BREVO_SMTP_PORT:',
          configService.get<number>('BREVO_SMTP_PORT'),
        );
        console.log(
          'BREVO_SMTP_USER:',
          configService.get<string>('BREVO_SMTP_USER'),
        );
        console.log(
          'BREVO_SMTP_PASS:',
          configService.get<string>('BREVO_SMTP_PASS'),
        );
        console.log(
          'BREVO_FROM_EMAIL:',
          configService.get<string>('BREVO_FROM_EMAIL'),
        );

        console.log(join(process.cwd(), 'templates'));

        return {
          transport: {
            host: configService.get<string>('BREVO_SMTP_HOST'),
            port: configService.get<number>('BREVO_SMTP_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
              user: configService.get<string>('BREVO_SMTP_USER'),
              pass: configService.get<string>('BREVO_SMTP_PASS'),
            },
          },
          defaults: {
            from: `"No Reply" <${configService.get<string>('BREVO_FROM_EMAIL')}>`,
          },
          template: {
            dir: join(process.cwd(), 'src/mailer/templates'),
            adapter: new HandlebarsAdapter(), // Adapter for Handlebars
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
