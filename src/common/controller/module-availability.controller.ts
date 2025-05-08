import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response/core.response';
import { ModuleAvailabilityService } from '../service/module-availability.service';

@ApiTags('system')
@Controller('system/modules')
export class ModuleAvailabilityController {
  constructor(
    private readonly moduleAvailabilityService: ModuleAvailabilityService,
  ) {}

  @Get()
  async getAvailableModules() {
    const availableModules =
      this.moduleAvailabilityService.getAvailableModules();
    return CoreApiResponse.success({
      availableModules,
      count: availableModules.length,
    });
  }

  @Get(':moduleName')
  async isModuleAvailable(@Param('moduleName') moduleName: string) {
    const isAvailable =
      this.moduleAvailabilityService.isModuleAvailable(moduleName);
    return CoreApiResponse.success({
      moduleName,
      isAvailable,
    });
  }
}
