import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class SignUpEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  active: $Enums.UserStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
