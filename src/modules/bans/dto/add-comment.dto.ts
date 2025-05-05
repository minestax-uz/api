import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddCommentDto {
  @ApiProperty()
  @IsNumber()
  ban_id: number;

  @ApiProperty()
  @IsString()
  content: string;
}
