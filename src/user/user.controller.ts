// src/user/user.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from './role.decorator';
import { RoleGuard } from './role.guard';
import { UserService } from './user.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileEntity } from './entities/user-profile.entity';

@Controller()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('Admin', 'User')
  @Get('user/profile')
  @ApiOkResponse({ type: UserProfileEntity })
  getProfile(@Request() req) {
    return this.userService.findUserProfile(req.user.id);
  }

  @Post('user/active')
  activeUser(@Body() data: { token: string }) {
    return this.userService.activeUser(data.token);
  }
}
