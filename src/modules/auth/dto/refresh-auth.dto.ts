import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshauthDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
