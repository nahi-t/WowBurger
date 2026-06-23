import { Module } from '@nestjs/common';
import { ViewsController } from './view.controller';
import { ViewsService } from './view.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewAnalytics } from './view-analytics.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Activates the background cron task runners
    TypeOrmModule.forFeature([ViewAnalytics]), // Connects the entity to PostgreSQL
  ],
  controllers: [ViewsController],
  providers: [ViewsService]
})
export class ViewModule {}
