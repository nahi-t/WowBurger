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
  categoryId: string; // Use this for filtering
  price: string;
  description: string;
  ingredients: string[];
  detailedIngredients: { icon: string; name: string; source: string }[];
  calories: number;
  dietaryTags: string[]; // e.g., ["Vegetarian"]
  image: string;
  rating: number;
  nutrition: { fat: string; carbs: string; sodium: string; protein: string };
  isAvailable: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  iconName: string; // lucide icon identifier
}
