import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rank } from '../../common/database/entities/ranks.entity';
import { RankPurchase } from '../../common/database/entities/rank-purchase.entity';
import { HttpError } from '../../common/exception/http.error';
import { AnarxiyaPermissionsService } from '../anarxiya/permissions/permissions.service';
import { SurvivalPermissionsService } from '../survival/permissions/permissions.service';
import { BoxpvpPermissionsService } from '../boxpvp/permissions/permissions.service';
import axios from 'axios';
import { env } from 'src/common/config';

@Injectable()
export class RankService {
  constructor(
    @InjectRepository(Rank)
    private readonly rankRepo: Repository<Rank>,
    @InjectRepository(RankPurchase)
    private readonly purchaseRepo: Repository<RankPurchase>,
    private readonly anarxiyaPermissionsService: AnarxiyaPermissionsService,
    private readonly survivalPermissionsService: SurvivalPermissionsService,
    private readonly boxpvpPermissionsService: BoxpvpPermissionsService,
  ) {}

  async getRanks(serverType?: 'anarxiya' | 'survival' | 'boxpvp') {
    if (serverType) {
      return await this.rankRepo.find({ where: { serverType, enabled: true } });
    }
    return await this.rankRepo.find({ where: { enabled: true } });
  }

  async getRank(id: number) {
    const rank = await this.rankRepo.findOne({ where: { id } });
    if (!rank) throw new HttpError({ code: 'RANK_NOT_FOUND' });
    return rank;
  }

  async initiateRankPurchase(username: string, rankId: number) {
    const rank = await this.getRank(rankId);
    if (!rank.enabled) throw new HttpError({ code: 'RANK_DISABLED' });

    // Create purchase record
    const purchase = this.purchaseRepo.create({
      username,
      rankId,
      amount: rank.price,
      status: 'pending',
      paymentMethod: 'clickpay',
    });
    await this.purchaseRepo.save(purchase);

    // Initialize ClickPay payment
    const paymentResponse = await this.createClickPayPayment(
      purchase.id,
      rank.price,
      {
        username,
        rankName: rank.name,
      },
    );

    return {
      purchaseId: purchase.id,
      paymentUrl: paymentResponse.paymentUrl,
      ...paymentResponse,
    };
  }

  private async createClickPayPayment(
    purchaseId: number,
    amount: number,
    metadata: any,
  ) {
    const apiKey = env.CLICKPAY_API_KEY;
    const apiUrl = env.CLICKPAY_API_URL;
    const appUrl = env.APP_URL;

    try {
      const response = await axios.post(
        `${apiUrl}/payments`,
        {
          amount,
          currency: 'USD',
          metadata: {
            purchaseId,
            ...metadata,
          },
          success_url: `${appUrl}/ranks/purchase/success`,
          cancel_url: `${appUrl}/ranks/purchase/cancel`,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new HttpError({ code: 'PAYMENT_INITIALIZATION_FAILED' });
    }
  }

  async handlePaymentWebhook(payload: any) {
    const purchase = await this.purchaseRepo.findOne({
      where: { id: payload.metadata.purchaseId },
    });

    if (!purchase) throw new HttpError({ code: 'PURCHASE_NOT_FOUND' });

    if (payload.status === 'completed') {
      purchase.status = 'completed';
      purchase.completedAt = new Date();
      purchase.transactionId = payload.id;
      await this.purchaseRepo.save(purchase);

      // Apply rank to user
      await this.applyRankToUser(purchase);
    } else if (payload.status === 'failed') {
      purchase.status = 'failed';
      await this.purchaseRepo.save(purchase);
    }

    return true;
  }

  private async applyRankToUser(purchase: RankPurchase) {
    const rank = await this.getRank(purchase.rankId);

    // Get the appropriate permissions service based on server type
    let permissionsService;
    switch (rank.serverType) {
      case 'anarxiya':
        permissionsService = this.anarxiyaPermissionsService;
        break;
      case 'survival':
        permissionsService = this.survivalPermissionsService;
        break;
      case 'boxpvp':
        permissionsService = this.boxpvpPermissionsService;
        break;
    }

    // Add rank permissions to user
    for (const permission of rank.permissions) {
      await permissionsService.addPlayerPermission(
        purchase.username,
        permission,
      );
    }
  }
}
