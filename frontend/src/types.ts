export enum DietaryType {
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  GLUTEN_FREE = 'Gluten-Free',
  SPICY = 'Spicy',
  SIGNATURE = 'Signature',
}

export interface IngredientInfo {
  name: string;
  source?: string;
  isAllergen?: boolean;
  allergenName?: string;
  icon?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  ingredients: string[]; // Retrocompatibility
  detailedIngredients: IngredientInfo[]; // Visual interactive ingredients
  calories: number;
  dietaryTags: DietaryType[];
  image: string;
  rating: number;
  reviewsCount: number;
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    sodium?: string;
  };
  customizableOptions?: {
    name: string;
    options: string[];
  }[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  iconName: string; // lucide icon identifier
}
