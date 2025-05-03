import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetBansDto } from './dto/get-bans.dto';
import { Bans } from 'src/common/database/entities/bans/bans.entity';

@Injectable()
export class BansService {
  constructor(
    @InjectRepository(Bans) private readonly bansRepo: Repository<Bans>,
  ) {}

  async get(dto: GetBansDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    const baseQuery = this.bansRepo
      .createQueryBuilder('b')
      .select([
        'b.id',
        'b.reason',
        'b.uuid',
        'b.time',
        'b.until',
        'b.removed_by_uuid',
        'p.name as player_name',
        'a.name as admin_name',
        'ub.name as unbanned_by_name',
      ])
      .addSelect(
        `DATE_FORMAT(FROM_UNIXTIME(b.time/1000), '%m/%d/%Y, %h:%i %p')`,
        'formatted_time',
      )
      .addSelect(
        `CASE 
    WHEN b.until = 0 THEN 'Permanent'
    ELSE DATE_FORMAT(FROM_UNIXTIME(b.until/1000), '%m/%d/%Y, %h:%i %p')
    END`,
        'formatted_until',
      )
      .addSelect(
        `CASE 
    WHEN b.removed_by_uuid IS NOT NULL THEN 'removed'
    WHEN b.until = 0 THEN 'permanent'
    WHEN b.until > (UNIX_TIMESTAMP() * 1000) THEN 'active'
    ELSE 'expired'
    END`,
        'status',
      )
      .leftJoin('litebans_history', 'p', 'b.uuid = p.uuid')
      .leftJoin('litebans_history', 'a', 'b.banned_by_uuid = a.uuid')
      .leftJoin('litebans_history', 'ub', 'b.removed_by_uuid = ub.uuid')
      .orderBy('b.time', 'DESC');

    if (dto.search) {
      baseQuery.andWhere('p.name LIKE :search', { search: `%${dto.search}%` });
    }

    const paginatedQuery = baseQuery.clone().skip(skip).take(limit);

    const [items, total] = await Promise.all([
      paginatedQuery.getRawAndEntities(), // get paginated items
      baseQuery.getCount(), // get full count
    ]);

    items.raw = items.raw.map((item) => {
      return {
        id: item.b_id,
        uuid: item.b_uuid,
        reason: item.b_reason,
        removed_by_uuid: item.b_removed_by_uuid,
        time: item.b_time,
        until: item.b_until,
        player_name: item.player_name,
        admin_name: item.admin_name,
        unbanned_by_name: item.unbanned_by_name,
        formatted_time: item.formatted_time,
        formatted_until: item.formatted_until,
        status:
          item.status === 'active'
            ? 'Active'
            : item.status.charAt(0).toUpperCase() + item.status.slice(1),
      };
    });

    return {
      items: items.raw,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
