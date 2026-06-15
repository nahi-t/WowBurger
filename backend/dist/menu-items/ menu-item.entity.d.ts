import { Category } from '../categories/category.entity';
import { ItemVariant } from './item-variant.entity';
export declare class MenuItem {
    id: string;
    categoryId: string;
    category: Category;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    isAvailable: boolean;
    variants: ItemVariant[];
    createdAt: Date;
}
