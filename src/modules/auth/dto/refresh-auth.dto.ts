import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
