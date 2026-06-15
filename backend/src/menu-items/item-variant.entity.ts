import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('item_variants')
export class ItemVariant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'menu_item_id' })
  menuItemId!: string;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem!: MenuItem;

  @Column({ length: 100 })
  name!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ name: 'is_available', default: true })
  isAvailable!: boolean;
}