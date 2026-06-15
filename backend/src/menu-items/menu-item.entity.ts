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

  @Column({ name: 'short_description', length: 255, nullable: true })
  shortDescription!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column({ name: 'image_url', nullable: true, length: 512 })
  imageUrl!: string;

  @Column({ name: 'is_available', default: true })
  isAvailable!: boolean;

  @Column({ type: 'varchar', length: 50, default: 'Br 0' })
  price!: string;

  @Column('jsonb', { default: [] })
  ingredients!: string[];

  @Column('jsonb', { name: 'detailed_ingredients', default: [] })
  detailedIngredients!: any[]; // IngredientInfo[]

  @Column('integer', { default: 0 })
  calories!: number;

  @Column('jsonb', { name: 'dietary_tags', default: [] })
  dietaryTags!: string[]; // DietaryType[]

  @Column('numeric', { precision: 2, scale: 1, default: 5.0 })
  rating!: number;

  @Column('integer', { name: 'reviews_count', default: 0 })
  reviewsCount!: number;

  @Column('jsonb', { nullable: true })
  nutrition!: {
    protein: string;
    carbs: string;
    fat: string;
    sodium?: string;
  };

  @Column('jsonb', { name: 'customizable_options', default: [] })
  customizableOptions!: {
    name: string;
    options: string[];
  }[];

  @OneToMany(() => ItemVariant, (variant) => variant.menuItem, { cascade: true })
  variants!: ItemVariant[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}