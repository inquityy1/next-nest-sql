import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client;

  constructor() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || '6379';

    this.client = createClient({
      url: `redis://${redisHost}:${redisPort}`,
    });

    this.client.connect().catch((err) => {
      console.error('Redis connection error:', err);
    });
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async set(key: string, value: any, ttl: number = 3600) {
    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async get(key: string) {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async delMatching(pattern: string) {
    const keys = await this.client.keys(pattern);
    if (keys.length) {
      await this.client.del(keys);
    }
  }
}
