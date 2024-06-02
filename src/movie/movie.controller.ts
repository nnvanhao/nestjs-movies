import { Controller, Get, Request } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileEntity } from 'src/user/entities/user-profile.entity';

@Controller('movie')
@ApiTags('Movies')
export class MovieController {
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles('Admin', 'User')
  @Get('list')
  @ApiOkResponse({ type: UserProfileEntity })
  getProfile(@Request() req) {
    return [{ a: 1 }];
  }
}
