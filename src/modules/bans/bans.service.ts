import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetBansDto } from './dto/get-bans.dto';
import { AddProofDto } from './dto/add-proof.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { UploadProofDto } from './dto/upload-proof.dto';
import { Bans } from 'src/common/database/entities/bans/bans.entity';
import { Proof } from 'src/common/database/entities/bans/proof.entity';
import { Comment } from 'src/common/database/entities/bans/comments.entity';
import { HttpError } from 'src/common/exception/http.error';
import { handleEncrypted } from 'src/common/utils/hash/media-upload.utils';

@Injectable()
export class BansService {
  constructor(
    @InjectRepository(Bans) private readonly bansRepo: Repository<Bans>,
    @InjectRepository(Proof) private readonly proofRepo: Repository<Proof>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
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
      .addSelect(
        `EXISTS(SELECT 1 FROM proofs pr WHERE pr.ban_id = b.id)`,
        'has_proof',
      )
      .leftJoin('litebans_history', 'p', 'b.uuid = p.uuid')
      .leftJoin('litebans_history', 'a', 'b.banned_by_uuid = a.uuid')
      .leftJoin('litebans_history', 'ub', 'b.removed_by_uuid = ub.uuid')
      .orderBy('b.time', 'DESC');

    if (dto.search) {
      baseQuery.andWhere('p.name LIKE :search', { search: `%${dto.search}%` });
    }

    if (dto.banned_by_name) {
      baseQuery.andWhere('b.banned_by_name LIKE :bannedBy', {
        bannedBy: `%${dto.banned_by_name}%`,
      });
    }

    if (dto.has_proof !== undefined) {
      baseQuery.andWhere(
        dto.has_proof
          ? 'EXISTS(SELECT 1 FROM proofs pr WHERE pr.ban_id = b.id)'
          : 'NOT EXISTS(SELECT 1 FROM proofs pr WHERE pr.ban_id = b.id)',
      );
    }

    const paginatedQuery = baseQuery.clone().skip(skip).take(limit);

    const [items, total] = await Promise.all([
      paginatedQuery.getRawAndEntities(),
      baseQuery.getCount(),
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
        has_proof: item.has_proof === 1,
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

  async addProof(dto: AddProofDto, username: string) {
    const ban = await this.bansRepo.findOne({ where: { id: dto.ban_id } });
    if (!ban) throw new HttpError({ code: 'BAN_NOT_FOUND' });

    const proof = this.proofRepo.create({
      ...dto,
      moderator_name: username,
    });
    return await this.proofRepo.save(proof);
  }

  async getProofs(banId: number) {
    const ban = await this.bansRepo.findOne({ where: { id: banId } });
    if (!ban) throw new HttpError({ code: 'BAN_NOT_FOUND' });

    return await this.proofRepo.find({
      where: { ban_id: banId },
      order: { create_at: 'DESC' },
    });
  }

  async deleteProof(id: number, username: string, isAdmin: boolean) {
    const proof = await this.proofRepo.findOne({ where: { id } });
    if (!proof) throw new HttpError({ code: 'PROOF_NOT_FOUND' });

    if (!isAdmin && proof.moderator_name !== username) {
      throw new HttpError({ code: 'UNAUTHORIZED' });
    }

    await this.proofRepo.remove(proof);
    return true;
  }

  async addComment(dto: AddCommentDto, username: string) {
    const ban = await this.bansRepo.findOne({ where: { id: dto.ban_id } });
    if (!ban) throw new HttpError({ code: 'BAN_NOT_FOUND' });

    const comment = this.commentRepo.create({
      ...dto,
      author_name: username,
    });
    return await this.commentRepo.save(comment);
  }

  async getComments(banId: number) {
    const ban = await this.bansRepo.findOne({ where: { id: banId } });
    if (!ban) throw new HttpError({ code: 'BAN_NOT_FOUND' });

    return await this.commentRepo.find({
      where: { ban_id: banId },
      order: { created_at: 'DESC' },
    });
  }

  async deleteComment(id: number, username: string, isAdmin: boolean) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new HttpError({ code: 'COMMENT_NOT_FOUND' });

    if (!isAdmin && comment.author_name !== username) {
      throw new HttpError({ code: 'UNAUTHORIZED' });
    }

    await this.commentRepo.remove(comment);
    return true;
  }

  async uploadProof(
    dto: UploadProofDto,
    file: Express.Multer.File,
    username: string,
  ) {
    const ban = await this.bansRepo.findOne({ where: { id: dto.ban_id } });
    if (!ban) throw new HttpError({ code: 'BAN_NOT_FOUND' });

    // Generate encrypted token for the file path
    const encryptedToken = handleEncrypted();
    const fileExtension = file.originalname.split('.').pop();
    const filePath = `proofs/${dto.ban_id}/${encryptedToken}.${fileExtension}`;

    const proof = this.proofRepo.create({
      ban_id: dto.ban_id,
      moderator_name: username,
      file_path: filePath,
      file_type: file.mimetype,
    });

    return await this.proofRepo.save(proof);
  }
}
