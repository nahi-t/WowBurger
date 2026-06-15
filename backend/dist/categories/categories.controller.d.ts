import { CategoriesService } from '../categories/provider/categories.service';
import { Category } from '../categories/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<Category[]>;
    create(categoryData: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<void>;
    update(id: string, categoryData: Partial<Category>): Promise<Category>;
}
