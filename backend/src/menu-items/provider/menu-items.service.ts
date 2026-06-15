import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  // 1. Find all available menu items with their variants and category
  findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      relations: {
        category: true,
        variants: true,
      },
    });
  }

  // 2. Create a new menu item
  create(itemData: Partial<MenuItem>): Promise<MenuItem> {
    const newItem = this.menuItemRepository.create(itemData);
    return this.menuItemRepository.save(newItem);
  }

  // 3. Remove a menu item by ID
  async remove(id: string): Promise<void> {
    const result = await this.menuItemRepository.delete(id);
    
    // Optional but highly recommended: Throw a 404 if the item didn't exist
    if (result.affected === 0) {
      throw new NotFoundException(`Menu item with ID "${id}" not found`);
    }
  }

  // 4. Update a menu item
  async update(id: string, itemData: Partial<MenuItem>): Promise<MenuItem> {
    const item = await this.menuItemRepository.preload({
      id,
      ...itemData,
    });
    if (!item) {
      throw new NotFoundException(`Menu item with ID "${id}" not found`);
    }
    return await this.menuItemRepository.save(item);
  }
}