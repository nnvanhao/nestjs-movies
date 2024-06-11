import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { FileManagementService } from './file-management.service';
import { FileManagementController } from './file-management.controller';

@Module({
  imports: [JwtModule, UserModule],
  providers: [FileManagementService],
  controllers: [FileManagementController],
  exports: [FileManagementService],
})
export class FileManagementModule {}
