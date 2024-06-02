import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MovieController } from './movie.controller';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
