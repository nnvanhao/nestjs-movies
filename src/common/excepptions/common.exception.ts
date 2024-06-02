// src/common/exceptions/forbidden-role.exception.ts

import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenRoleException extends HttpException {
  constructor() {
    super('No permission to access this resource', HttpStatus.FORBIDDEN);
  }
}

export class InactiveUserException extends HttpException {
  constructor() {
    super(
      'Your account is inactive. Please contact support.',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super('Incorrect email or password', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidRefreshTokenException extends HttpException {
  constructor() {
    super('Invalid refresh token', HttpStatus.UNAUTHORIZED);
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User already exists', HttpStatus.CONFLICT);
  }
}

export class CommonException extends HttpException {
  constructor(message: string, code: number) {
    super(message, code);
  }
}
