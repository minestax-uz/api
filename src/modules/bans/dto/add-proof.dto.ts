import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddProofDto {
  @ApiProperty()
  @IsNumber()
  ban_id: number;

  @ApiProperty()
  @IsString()
  file_path: string;

  @ApiProperty()
  @IsString()
  file_type: string;
}
