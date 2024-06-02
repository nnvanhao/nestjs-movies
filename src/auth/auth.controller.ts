// src/auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RefreshEntity } from './entities/refresh.entity';
import { SignInDto } from './dto/sign-in.dto';
import { SignInEntity } from './entities/sign-in.entity';
import { SignUpEntity } from './entities/sign-up.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignOutDto } from './dto/sign-out.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh')
  @ApiOkResponse({ type: RefreshEntity })
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('sign-in')
  @ApiOkResponse({ type: SignInEntity })
  @ApiBody({ type: SignInDto })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  @ApiOkResponse({ type: SignUpEntity })
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-out')
  @ApiBody({ type: SignOutDto })
  async signOut(@Body() user: SignOutDto) {
    return this.authService.signOut(user.userId);
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() user: ForgotPasswordDto) {
    return this.authService.forgotPassword(user);
  }

  @Post('update-new-password')
  @ApiBody({ type: UpdatePasswordDto })
  async updatePassword(@Body() user: UpdatePasswordDto) {
    return this.authService.updatePassword(user);
  }
}
