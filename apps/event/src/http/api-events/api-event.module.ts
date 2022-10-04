import { Module } from '@nestjs/common';
import { EventModule } from '../../common/database';
import { ApiEventService } from './api-event.service';
import { ApiEventController } from './api-event.controller';

@Module({
  imports: [EventModule],
  controllers: [ApiEventController],
  providers: [ApiEventService],
  exports: [ApiEventService],
})
export class ApiEventModule {}
