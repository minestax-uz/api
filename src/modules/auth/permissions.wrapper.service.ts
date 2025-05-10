import { Injectable } from '@nestjs/common';
import { AnarxiyaPermissionsService } from '../anarxiya/permissions/permissions.service';
import { SurvivalPermissionsService } from '../survival/permissions/permissions.service';
import { BoxpvpPermissionsService } from '../boxpvp/permissions/permissions.service';

/**
 * This service wraps all permission services to avoid circular dependencies
 * and provide a single point of access for the AuthService
 */
@Injectable()
export class PermissionsWrapperService {
  constructor(
    private readonly anarxiyaPermissionsService: AnarxiyaPermissionsService,
    private readonly survivalPermissionsService: SurvivalPermissionsService,
    private readonly boxpvpPermissionsService: BoxpvpPermissionsService,
  ) {}

  async getAnarxiyaPlayerRole(username: string): Promise<string> {
    return this.anarxiyaPermissionsService.getPlayerRole(username);
  }

  async getSurvivalPlayerRole(username: string): Promise<string> {
    return this.survivalPermissionsService.getPlayerRole(username);
  }

  async getBoxpvpPlayerRole(username: string): Promise<string> {
    return this.boxpvpPermissionsService.getPlayerRole(username);
  }

  async getAllPlayerRoles(username: string): Promise<string[]> {
    try {
      return [
        await this.boxpvpPermissionsService.getPlayerRole(username),
        await this.anarxiyaPermissionsService.getPlayerRole(username),
        await this.survivalPermissionsService.getPlayerRole(username),
      ];
    } catch (error) {
      console.error('Error getting player roles:', error);
      return ['user', 'user', 'user']; // Default to user if there's an error
    }
  }
}
