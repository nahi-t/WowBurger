import { ViewAnalytics } from './view-analytics.entity';
// src/views/views.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Cache } from 'cache-manager';


@Injectable()
export class ViewsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ViewAnalytics)
    private readonly analyticsRepo: Repository<ViewAnalytics>,
  ) {}

  async incrementView(postId: string, ip: string): Promise<number> {
    const cooldownKey = `cooldown:${postId}:${ip}`;
    const countKey = `views:${postId}`;

    // 1. Check IP cooldown window
    const onCooldown = await this.cacheManager.get<string>(cooldownKey);

    if (!onCooldown) {
      await this.cacheManager.set(cooldownKey, 'true', 600000); // 10 min TTL

      // 2. Get current Redis view count
      let currentViews = await this.cacheManager.get<number>(countKey);

      // 🔄 SAFEGUARD: If Redis restarted or was cleared, look it up in PostgreSQL
      if (currentViews === undefined || currentViews === null) {
        const record = await this.analyticsRepo.findOne({ where: { postId } });
        currentViews = record ? record.views : 0;
      }

      const newCount = currentViews + 1;
      await this.cacheManager.set(countKey, newCount); // Save fast updated total to Redis

      // Add to a background tracking set so our Cron Job knows this post has new views
      await this.trackActivePost(postId);

      return newCount;
    }

    // If on cooldown, read from Redis or fallback to PostgreSQL
    let stableViews = await this.cacheManager.get<number>(countKey);
    if (stableViews === undefined || stableViews === null) {
      const record = await this.analyticsRepo.findOne({ where: { postId } });
      stableViews = record ? record.views : 0;
      await this.cacheManager.set(countKey, stableViews);
    }
    return stableViews;
  }

  // Helper method to keep a list of modified keys in Redis
  private async trackActivePost(postId: string) {
    const keysSetKey = 'active_posts_to_sync';
    const existingKeys = (await this.cacheManager.get<string[]>(keysSetKey)) || [];
    if (!existingKeys.includes(postId)) {
      existingKeys.push(postId);
      await this.cacheManager.set(keysSetKey, existingKeys);
    }
  }

  // 🕒 CRON JOB: Runs automatically every 5 minutes in the background
  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncViewsToPostgres() {
    console.log('🔄 Syncing analytics from Redis memory to PostgreSQL database...');
    const keysSetKey = 'active_posts_to_sync';
    const activePostIds = await this.cacheManager.get<string[]>(keysSetKey);

    if (!activePostIds || activePostIds.length === 0) return;

    for (const postId of activePostIds) {
      const redisViews = await this.cacheManager.get<number>(`views:${postId}`);
      
      if (redisViews !== undefined && redisViews !== null) {
        // Upsert query: inserts the record if new, updates views if it already exists
        await this.analyticsRepo.upsert(
          { postId, views: redisViews },
          ['postId']
        );
      }
    }

    // Clear out the tracking array so we don't re-process static posts next time
    await this.cacheManager.set(keysSetKey, []);
    console.log('✅ Analytics sync completed successfully.');
  }
}