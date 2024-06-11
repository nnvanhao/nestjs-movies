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
import { FileService } from './file.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/user/role.guard';
import { Roles } from 'src/user/role.decorator';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

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
    return this.fileService.uploadFile(file);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('Admin')
  @Delete()
  async deleteFile(@Body('id') id: string) {
    if (!id) {
      throw new BadRequestException('Please provide a key file');
    }
    return this.fileService.deleteFile(id);
  }
}
