import { Repository } from 'typeorm';
import { Category } from '../category.entity';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    create(categoryData: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<void>;
    update(id: string, categoryData: Partial<Category>): Promise<Category>;
}
