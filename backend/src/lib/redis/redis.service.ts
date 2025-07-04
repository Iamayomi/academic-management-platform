import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { REDIS_CLOUD_URL } from '../config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis(
      this.configService.get<string>(REDIS_CLOUD_URL) ||
        'redis://localhost:6379',
      {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      },
    );

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  async onModuleInit() {
    if (
      this.client.status !== 'connecting' &&
      this.client.status !== 'connect' &&
      this.client.status !== 'ready'
    ) {
      await this.client.connect();
    }
  }
  // async onModuleInit() {
  //   await this.client.connect();
  // }

  // async onModuleDestroy() {
  //   await this.client.quit();
  // }
  async onModuleDestroy() {
    if (this.client.status !== 'end') {
      await this.client.quit();
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async publish(channel: string, message: string) {
    await this.client.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    await this.client.subscribe(channel);
    this.client.on('message', (ch, msg) => {
      if (ch === channel) callback(msg);
    });
  }
}
