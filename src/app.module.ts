import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HttpsAndCorsMiddleware } from './middleware/https-redirect.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { MovieModule } from './movie/movie.module';
import { TokenModule } from './token/token.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { FileManagementService } from './file-management/file-management.service';
import { FileManagementController } from './file-management/file-management.controller';
import { FileManagementModule } from './file-management/file-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TokenModule,
    MailerModule,
    AuthModule,
    MovieModule,
    MailerModule,
    FileManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsAndCorsMiddleware).forRoutes('*'); // Apply to all routes
  }
}
