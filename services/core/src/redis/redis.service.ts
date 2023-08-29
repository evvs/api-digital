import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClient;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient() {
    return this.client;
  }

  async addToBlacklist(token: string): Promise<void> {
    await this.client.sadd('core_jwt_blacklist', token);
  }

  async checkBlacklist(token: string): Promise<boolean> {
    const isBlacklisted = await this.client.sismember(
      'core_jwt_blacklist',
      token,
    );
    return Boolean(isBlacklisted);
  }
}
