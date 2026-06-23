// src/menu-items/menu-items.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { MenuItem } from '../menu-item.entity';
import { PaginationDto } from '../dto/PaginationDto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 1. Find all available menu items with their variants, category, and live view counts
  async findAll(paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 5;
    const search = paginationDto.search ? String(paginationDto.search).trim() : '';
    
    const skip = (page - 1) * limit;

    // 1. Create a Query Builder targeted at your item entity table alias
    const queryBuilder = this.menuItemRepository.createQueryBuilder('menuItem')
      .leftJoinAndSelect('menuItem.category', 'category')
     

    // 2. Safely apply Postgres Brackets matching to protect pagination
    if (search !== '') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('menuItem.name ILIKE :search', { search: `%${search}%` })
            .orWhere('menuItem.description ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    // 3. Chain pagination parameters cleanly
    queryBuilder
      .orderBy('menuItem.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    // 4. Retrieve matching dataset and total count from Postgres
    const [data, total] = await queryBuilder.getManyAndCount();

    // 5. HYDRATION: Fetch live view numbers from Redis for each item concurrently
    // Fixes the type casting gap by forcing clean string keys and numeric values
    const dataWithViews = await Promise.all(
      data.map(async (item) => {
        const targetId = String(item.id).trim();
        const rawViews = await this.cacheManager.get(`views:${targetId}`);
        
        // Explicitly convert raw cache data to an integer
        const parsedViews = rawViews !== undefined && rawViews !== null ? Number(rawViews) : 0;

        return {
          ...item,
          views: isNaN(parsedViews) ? 0 : parsedViews,
        };
      })
    );

    return {
      data: dataWithViews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  // 2. Create a new menu item
  create(itemData: Partial<MenuItem>): Promise<MenuItem> {
    const newItem = this.menuItemRepository.create(itemData);
    return this.menuItemRepository.save(newItem);
  }

  // 3. Remove a menu item by ID
  async remove(id: string): Promise<void> {
    const result = await this.menuItemRepository.delete(id);
    
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