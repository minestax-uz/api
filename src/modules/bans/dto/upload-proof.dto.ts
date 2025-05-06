import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class UploadProofDto {
  @ApiProperty()
  @IsNumberString()
  ban_id: string;
}
