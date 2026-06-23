// src/views/entities/view-analytics.entity.ts
import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('view_analytics')
export class ViewAnalytics {
  @PrimaryColumn()
  postId!: string; // The ID of your burger/menu item

  @Column({ default: 0 })
  views!: number; // The total persistent view count

  @UpdateDateColumn()
  updatedAt!: Date; // Keeps track of the last sync time
}