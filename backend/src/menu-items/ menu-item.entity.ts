import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { ItemVariant } from './item-variant.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'category_id' })
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.menuItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ length: 150 })
  name!: string;

  @Column({ unique: true, length: 150 })
  slug!: string;

  @Column({ name: 'short_description', length: 255 })
  shortDescription!: string;

  @Column('text')
  description!: string;

  @Column({ name: 'image_url', nullable: true, length: 512 })
  imageUrl!: string;

  @Column({ name: 'is_available', default: true })
  isAvailable!: boolean;

  @OneToMany(() => ItemVariant, (variant) => variant.menuItem, { cascade: true })
  variants!: ItemVariant[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}