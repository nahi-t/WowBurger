export declare const SEED_CATEGORIES: {
    name: string;
    slug: string;
    description: string;
    iconName: string;
    displayOrder: number;
}[];
export declare const SEED_MENU_ITEMS: ({
    name: string;
    slug: string;
    categorySlug: string;
    price: string;
    shortDescription: string;
    description: string;
    ingredients: string[];
    detailedIngredients: {
        name: string;
        source: string;
        icon: string;
    }[];
    calories: number;
    dietaryTags: string[];
    imageUrl: string;
    rating: number;
    reviewsCount: number;
    nutrition: {
        protein: string;
        carbs: string;
        fat: string;
        sodium: string;
    };
    customizableOptions: {
        name: string;
        options: string[];
    }[];
} | {
    name: string;
    slug: string;
    categorySlug: string;
    price: string;
    shortDescription: string;
    description: string;
    ingredients: string[];
    detailedIngredients: {
        name: string;
        source: string;
        icon: string;
    }[];
    calories: number;
    dietaryTags: string[];
    imageUrl: string;
    rating: number;
    reviewsCount: number;
    nutrition: {
        protein: string;
        carbs: string;
        fat: string;
        sodium: string;
    };
    customizableOptions?: undefined;
})[];
