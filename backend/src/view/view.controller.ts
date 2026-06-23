// src/views/views.controller.ts
import { Controller, Post, Param, Req } from '@nestjs/common';
import { ViewsService } from './view.service';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('posts')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService,
  
  ) {}

  @Post(':id/view')
  async incrementView(@Param('id') id: string, @Req() req: Request) {
    // Extract user IP address to prevent spam refreshes
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    
    const totalViews = await this.viewsService.incrementView(id, ip);
    return { success: true, views: totalViews };
  }

  
}