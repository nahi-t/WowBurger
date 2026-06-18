import { MenuItemsService } from '../menu-items/provider/menu-items.service';
import { MenuItem } from '../menu-items/menu-item.entity';
import { PaginationDto } from './dto/PaginationDto';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    findAll(paginationDto: PaginationDto): Promise<{
        data: {
            id: string;
            name: string;
            slug: string;
            category: string;
            price: string;
            description: string;
            shortDescription: string;
            ingredients: string[];
            detailedIngredients: any[];
            calories: number;
            dietaryTags: string[];
            image: string;
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
            isAvailable: boolean;
            categoryId: string;
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
