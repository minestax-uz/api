import { Global, Module } from '@nestjs/common';
import { ModuleAvailabilityService } from './module-availability.service';
import { ModuleAvailabilityController } from '../controller/module-availability.controller';

@Global()
@Module({
  controllers: [ModuleAvailabilityController],
  providers: [ModuleAvailabilityService],
  exports: [ModuleAvailabilityService],
})
export class ModuleAvailabilityModule {}
