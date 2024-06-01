// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

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

  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
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
}
