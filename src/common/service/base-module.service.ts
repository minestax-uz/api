import { Injectable } from '@nestjs/common';
import { ModuleAvailabilityService } from './module-availability.service';
import { HttpError } from '../exception/http.error';

/**
 * Base service class for module services that need to check module availability
 * before performing operations
 */
@Injectable()
export class BaseModuleService {
  constructor(
    protected readonly moduleAvailabilityService: ModuleAvailabilityService,
  ) {}

  /**
   * Check if a module is available before performing an operation
   * @param moduleName The name of the module to check
   * @throws HttpError if the module is not available
   */
  protected checkModuleAvailability(moduleName: string): void {
    if (!this.moduleAvailabilityService.isModuleAvailable(moduleName)) {
      throw HttpError({
        code: 'MODULE_UNAVAILABLE',
        message: `The ${moduleName} module is currently unavailable due to database connection issues`,
        statusCode: 503, // Service Unavailable
      });
    }
  }
}
