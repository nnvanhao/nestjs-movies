import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { decrypt } from 'src/utils/securities';
import { UserStatus } from '@prisma/client';
import {
  InactiveUserException,
  InvalidRefreshTokenException,
  UnauthorizedException,
} from 'src/common/excepptions/common.exception';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: { email: string; password: string }) {
    const passwordDecrypt = decrypt(user.password, process.env.SECRET_KEY);
    const userResult = await this.userService.findOneByEmail(user.email);

    if (
      userResult &&
      (await bcrypt.compare(passwordDecrypt, userResult.password))
    ) {
      if (userResult.active === UserStatus.INACTIVE) {
        throw new InactiveUserException();
      }

      return {
        accessToken: this.jwtService.sign(
          { email: userResult.email },
          { expiresIn: '7d' },
        ),
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
}
