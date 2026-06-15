import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { MenuItem } from '../menu-items/ menu-item.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 100 })
  slug!: string;

  @Column({ name: 'display_order', default: 0 })
  displayOrder!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menuItems!: MenuItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}