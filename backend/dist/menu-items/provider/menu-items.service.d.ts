import { Repository } from 'typeorm';
import { MenuItem } from '../menu-item.entity';
import { PaginationDto } from '../dto/PaginationDto';
import type { Cache } from 'cache-manager';
export declare class MenuItemsService {
    private readonly menuItemRepository;
    private readonly cacheManager;
    constructor(menuItemRepository: Repository<MenuItem>, cacheManager: Cache);
    findAll(paginationDto: PaginationDto): Promise<{
        data: {
            views: number;
            id: string;
            categoryId: string;
            category: import("../../categories/category.entity").Category;
            name: string;
            slug: string;
            shortDescription: string;
            description: string;
            imageUrl: string;
            isAvailable: boolean;
            price: string;
            ingredients: string[];
            detailedIngredients: any[];
            calories: number;
            dietaryTags: string[];
            rating: number;
            reviewsCount: number;
            nutrition: {
                protein: string;
                carbs: string;
                fat: string;
                sodium?: string;
            };
            customizableOptions: {
                name: string;
                options: string[];
            }[];
            variants: import("../item-variant.entity").ItemVariant[];
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(itemData: Partial<MenuItem>): Promise<MenuItem>;
    remove(id: string): Promise<void>;
    update(id: string, itemData: Partial<MenuItem>): Promise<MenuItem>;
}
