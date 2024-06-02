import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async setExpireOldToken(userId: string) {
    const tokenResult = await this.prisma.token.findFirst({
      where: {
        userId,
        isExpired: false,
      },
      orderBy: {
        createdAt: 'desc', // or 'id' if you're sorting by id
      },
    });

    if (tokenResult) {
      return this.prisma.token.update({
        where: {
          id: tokenResult.id,
        },
        data: {
          isExpired: true,
        },
      });
    }
  }

  async addUserAccessToken(token: string, userId: string) {
    return this.prisma.token.create({
      data: {
        token,
        userId,
      },
    });
  }

  async verifyUserAccessTokenExpired(token: string) {
    const tokenResult = await this.prisma.token.findFirst({
      where: {
        token,
      },
    });

    if (!tokenResult) {
      return true;
    }

    return tokenResult?.isExpired;
  }
}
