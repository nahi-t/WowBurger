import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../ menu-item.entity'; // Fixed the spacing in the path

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  // 1. Find all available menu items with their variants
  findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      relations: {
        variants: true, // Fixed: Using object syntax instead of ['variants']
      },
      where: { isAvailable: true },
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
}