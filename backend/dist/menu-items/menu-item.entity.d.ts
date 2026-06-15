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
    variants: ItemVariant[];
    createdAt: Date;
}
