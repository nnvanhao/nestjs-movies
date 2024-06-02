// src/user/user.service.ts

import { HttpStatus, Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { decrypt } from 'src/utils/securities';
import { CommonException } from 'src/common/excepptions/common.exception';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(user: CreateUserDto) {
    const passwordDecrypt = decrypt(user.password, process.env.SECRET_KEY);
    const hashedPassword = await bcrypt.hash(passwordDecrypt, 10);
    const userCreateResult = await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
    });
    delete userCreateResult.password;
    return userCreateResult;
  }

  async getUserRolesAssignment(userId: string) {
    const roles = await this.prisma.userRoleAssignment.findMany({
      where: { userId },
      include: { role: true },
    });

    // Return an array of role names
    return roles.map((roleAssignment) => roleAssignment.role.name);
  }

  async findAllCandidates() {
    const results = await this.prisma.userRoleAssignment.findMany({
      where: {
        role: {
          name: 'Admin',
        },
        user: {
          active: UserStatus.ACTIVE,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return results.map((result) => result.user);
  }

  async findUserProfile(id: string) {
    const userResult = this.prisma.user.findUnique({
      where: { id },
    });

    delete (await userResult).password;

    return userResult;
  }

  async activeUser(token: string) {
    try {
      const userId = decrypt(token, process.env.SECRET_KEY);

      const userResult = await this.prisma.user.update({
        where: { id: userId },
        data: {
          active: 'ACTIVE',
        },
      });

      return userResult;
    } catch (error) {
      throw new CommonException('Active user failed', HttpStatus.BAD_REQUEST);
    }
  }

  async updateNewPassword(token: string, newPassword: string) {
    try {
      const email = decrypt(token, process.env.SECRET_KEY);

      const userResult = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!userResult) {
        throw new CommonException('User not exist', HttpStatus.NOT_FOUND);
      }

      if (userResult) {
        const passwordDecrypt = decrypt(newPassword, process.env.SECRET_KEY);
        const hashedPassword = await bcrypt.hash(passwordDecrypt, 10);

        await this.prisma.user.update({
          where: { email },
          data: {
            password: hashedPassword,
          },
        });
      }

      return userResult;
    } catch (error) {
      throw new CommonException(
        'Update new password failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
