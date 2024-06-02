import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_JWT_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { email: string }) {
    const token = req.headers['authorization'].split(' ')[1];
    const isTokenExpired =
      await this.tokenService.verifyUserAccessTokenExpired(token);

    if (isTokenExpired) {
      throw new UnauthorizedException();
    }

    return await this.userService.findOneById(payload.email);
  }
}
