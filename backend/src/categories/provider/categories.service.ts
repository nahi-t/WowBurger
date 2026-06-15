import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category.entity'; // Adjust path if needed

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 1. Find all categories
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  // 2. Create a new category
  async create(categoryData: Partial<Category>): Promise<Category> {
    const newCategory = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(newCategory);
  }

  // 3. Remove a category by ID
  async remove(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);

    // If no rows were affected, it means the category didn't exist
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }

  // 4. Update a category
  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepository.preload({
      id,
      ...categoryData,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return await this.categoryRepository.save(category);
  }
}