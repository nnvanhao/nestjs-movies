import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  imports: [JwtModule, UserModule],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
