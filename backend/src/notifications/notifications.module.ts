import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { RedisService } from '../lib';

@Module({
  providers: [NotificationsGateway, RedisService],
})
export class NotificationsModule {}
