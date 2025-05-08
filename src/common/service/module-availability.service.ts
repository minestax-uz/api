import { Injectable } from '@nestjs/common';

/**
 * Service to track the availability of modules in the application
 * This allows other parts of the application to check if a module is available
 * before attempting to use it
 */
@Injectable()
export class ModuleAvailabilityService {
  private moduleStatus: Map<string, boolean> = new Map();

  /**
   * Set the availability status of a module
   * @param moduleName The name of the module
   * @param isAvailable Whether the module is available
   */
  setModuleAvailability(moduleName: string, isAvailable: boolean): void {
    this.moduleStatus.set(moduleName, isAvailable);
  }

  /**
   * Check if a module is available
   * @param moduleName The name of the module
   * @returns Whether the module is available
   */
  isModuleAvailable(moduleName: string): boolean {
    return this.moduleStatus.get(moduleName) ?? false;
  }

  /**
   * Get a list of all available modules
   * @returns Array of available module names
   */
  getAvailableModules(): string[] {
    return Array.from(this.moduleStatus.entries())
      .filter(([_, isAvailable]) => isAvailable)
      .map(([moduleName]) => moduleName);
  }
}
