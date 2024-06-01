// src/user/user.controller.ts

import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from './role.decorator';
import { RoleGuard } from './role.guard';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('Admin', 'User')
  @Get('user/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
