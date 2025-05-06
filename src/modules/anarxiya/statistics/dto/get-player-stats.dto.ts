import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetPlayerStatsDto {
  @ApiProperty({ required: true, description: 'Player username or UUID' })
  @IsString()
  player: string;

  @ApiProperty({ required: false, description: 'Time range in days' })
  @IsOptional()
  range?: number;
}
