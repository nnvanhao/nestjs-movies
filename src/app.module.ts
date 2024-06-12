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
import { FileModule } from './file/file.module';
import { RequestLoggingMiddleware } from './middleware/logging.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulingModule } from './task-scheduling/task-scheduling.module';
import { HealthModule } from './health/health.module';

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
    FileModule,
    ScheduleModule.forRoot(),
    TaskSchedulingModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpsAndCorsMiddleware, RequestLoggingMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
