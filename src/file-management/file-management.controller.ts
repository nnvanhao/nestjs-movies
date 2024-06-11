import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileManagementService } from './file-management.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/user/role.guard';
import { Roles } from 'src/user/role.decorator';

@Controller('file')
export class FileManagementController {
  constructor(private readonly fileManagementService: FileManagementService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('Admin')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Check if a file was uploaded
    if (!file) {
      throw new BadRequestException('Please upload a file');
    }

    // If file exists, proceed with your logic
    return this.fileManagementService.uploadFile(file);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('Admin')
  @Delete()
  async deleteFile(@Body('id') id: string) {
    if (!id) {
      throw new BadRequestException('Please provide a key file');
    }
    return this.fileManagementService.deleteFile(id);
  }
}
