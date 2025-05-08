import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum LeaderboardType {
  PLAYTIME = 'playtime',
  KILLS = 'kills',
  DEATHS = 'deaths',
  KDR = 'kdr',
  BLOCKS_PLACED = 'blocks_placed',
  BLOCKS_BROKEN = 'blocks_broken',
  ITEMS_CRAFTED = 'items_crafted',
  DISTANCE_TRAVELED = 'distance_traveled',
  MOB_KILLS = 'mob_kills',
}

export class GetLeaderboardDto {
  @ApiProperty({
    required: true,
    enum: LeaderboardType,
    description: 'Type of leaderboard to retrieve',
  })
  @IsEnum(LeaderboardType)
  type: LeaderboardType;

  @ApiProperty({ required: false, default: 10, description: 'Number of players to return' })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
