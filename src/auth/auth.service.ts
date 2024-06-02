import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { decrypt } from 'src/utils/securities';
import { UserStatus } from '@prisma/client';
import {
  CommonException,
  InactiveUserException,
  InvalidRefreshTokenException,
  UnauthorizedException,
  UserAlreadyExistsException,
} from 'src/common/excepptions/common.exception';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenService } from 'src/token/token.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private mailerService: MailerService,
  ) {}

  async signIn(user: { email: string; password: string }) {
    const passwordDecrypt = decrypt(user.password, process.env.SECRET_KEY);
    const userResult = await this.userService.findOneByEmail(user.email);

    if (
      userResult &&
      (await bcrypt.compare(passwordDecrypt, userResult.password))
    ) {
      if (userResult.active === UserStatus.INACTIVE) {
        throw new InactiveUserException();
      }

      const accessToken = this.jwtService.sign(
        { email: userResult.email, time: new Date() },
        { expiresIn: '7d' },
      );

      // Set expire for old token
      await this.tokenService.setExpireOldToken(userResult.id);

      await this.tokenService.addUserAccessToken(accessToken, userResult.id);

      return {
        accessToken,
        refreshToken: this.jwtService.sign(
          { email: userResult.email, id: userResult.id },
          { expiresIn: '14d' },
        ),
      };
    }
    throw new UnauthorizedException();
  }

  async refreshToken(data: { refreshToken: string }) {
    try {
      const payload = this.jwtService.verify(data.refreshToken, {
        secret: process.env.SECRET_JWT_KEY,
      });
      const newAccessToken = this.jwtService.sign({ email: payload.email });
      return {
        accessToken: newAccessToken,
      };
    } catch (e) {
      throw new InvalidRefreshTokenException();
    }
  }

  async signUp(user: SignUpDto) {
    try {
      const userResult = await this.userService.findOneByEmail(user.email);
      if (userResult) {
        throw new UserAlreadyExistsException();
      }
      const createUserResult = await this.userService.createUser(user);

      if (createUserResult) {
        // Send email to active user
        await this.mailerService.sendEmailForActiveUser(createUserResult);
      }

      return createUserResult;
    } catch (e) {
      throw new CommonException(e.message, e.status);
    }
  }

  async signOut(userId: string) {
    try {
      await this.tokenService.setExpireOldToken(userId);
    } catch (e) {
      throw new CommonException(e.message, e.status);
    }
  }

  async forgotPassword(user: ForgotPasswordDto) {
    try {
      const userResult = await this.userService.findOneByEmail(user.email);
      if (!userResult) {
        throw new CommonException('User not exist', HttpStatus.BAD_REQUEST);
      }

      if (userResult) {
        // Send email to active user
        await this.mailerService.sendEmailForForgotPassword(user);
      }
    } catch (e) {
      throw new CommonException(e.message, e.status);
    }
  }

  async updatePassword(user: UpdatePasswordDto) {
    try {
      await this.userService.updateNewPassword(user.token, user.newPassword);
    } catch (e) {
      throw new CommonException(e.message, e.status);
    }
  }
}
