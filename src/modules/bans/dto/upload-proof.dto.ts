import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UploadProofDto {
  @ApiProperty()
  @IsNumber()
  ban_id: number;
}
