import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetServerStatsDto {
  @ApiProperty({ required: false, description: 'Time range in hours' })
  @IsOptional()
  range?: number;
}
