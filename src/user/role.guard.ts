// src/user/role.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenRoleException } from 'src/common/excepptions/common.exception';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles required, access allowed
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    const decodedToken = this.jwtService.decode(token.split(' ')?.[1].trim());
    const userResult = await this.userService.findOneByEmail(
      decodedToken?.email,
    );
    const userRoles = await this.userService.getUserRolesAssignment(
      userResult.id,
    );

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenRoleException();
    }

    return true;
  }
}
