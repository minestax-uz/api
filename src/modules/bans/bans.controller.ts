import {
  Controller,
  Body,
  Get,
  Query,
  Post,
  Param,
  ParseIntPipe,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { CoreApiResponse } from 'src/common/response/core.response';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
import { HttpError } from 'src/common/exception/http.error';
import { BansService } from './bans.service';
import { GetBansDto } from './dto/get-bans.dto';
import { AddProofDto } from './dto/add-proof.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { UploadProofDto } from './dto/upload-proof.dto';

@ApiTags('bans')
@Controller('bans')
export class BansController {
  constructor(private readonly bansService: BansService) {}

  @Get()
  @DecoratorWrapper('get bans')
  async get(@Query() dto: GetBansDto) {
    return CoreApiResponse.success(await this.bansService.get(dto));
  }

  @Post('proof')
  @DecoratorWrapper('add ban proof', true, [Role.ADMIN, Role.MODER])
  async addProof(@Body() dto: AddProofDto, @Request() req) {
    return CoreApiResponse.success(
      await this.bansService.addProof(dto, req.user.username),
    );
  }

  @Post('proof/upload')
  @DecoratorWrapper('upload ban proof', true, [Role.ADMIN, Role.MODER])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ban_id: { type: 'number' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|webm)$/)) {
          return cb(
            new Error('Only image and video files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 50, // 50MB max file size
      },
    }),
  )
  async uploadProof(
    @Body() dto: UploadProofDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return CoreApiResponse.success(
      await this.bansService.uploadProof(dto, file, req.user.username),
    );
  }

  @Get(':id/proofs')
  @DecoratorWrapper('get ban proofs')
  async getProofs(@Param('id', ParseIntPipe) id: number) {
    return CoreApiResponse.success(await this.bansService.getProofs(id));
  }

  @Delete('proof/:id')
  @DecoratorWrapper('delete ban proof', true, [Role.ADMIN, Role.MODER])
  async deleteProof(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const isAdmin = req.user.role === Role.ADMIN;
    return CoreApiResponse.success(
      await this.bansService.deleteProof(id, req.user.username, isAdmin),
    );
  }

  @Post('comment')
  @DecoratorWrapper('add ban comment', true, [
    Role.USER,
    Role.ADMIN,
    Role.MODER,
  ])
  async addComment(@Body() dto: AddCommentDto, @Request() req) {
    return CoreApiResponse.success(
      await this.bansService.addComment(dto, req.user.username),
    );
  }

  @Get(':id/comments')
  @DecoratorWrapper('get ban comments', true, [
    Role.USER,
    Role.ADMIN,
    Role.MODER,
  ])
  async getComments(@Param('id', ParseIntPipe) id: number) {
    return CoreApiResponse.success(await this.bansService.getComments(id));
  }

  @Delete('comment/:id')
  @DecoratorWrapper('delete ban comment', true, [Role.ADMIN, Role.MODER])
  async deleteComment(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const isAdmin = req.user.role === Role.ADMIN;
    return CoreApiResponse.success(
      await this.bansService.deleteComment(id, req.user.username, isAdmin),
    );
  }
}
