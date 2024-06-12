import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { TerminusLogger } from './terminus-logger.service';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
      // logger: TerminusLogger,
    }),
    HttpModule,
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
