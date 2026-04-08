export type Category =
  | 'Breakfast'
  | 'Sides'
  | 'Lunch'
  | 'Entrees'
  | 'Breads & Baked'
  | 'Desserts';

export const CATEGORIES: Category[] = [
  'Breakfast',
  'Sides',
  'Lunch',
  'Entrees',
  'Breads & Baked',
  'Desserts',
];

export const CATEGORY_SLUGS: Record<Category, string> = {
  'Breakfast': 'breakfast',
  'Sides': 'sides',
  'Lunch': 'lunch',
  'Entrees': 'entrees',
  'Breads & Baked': 'breads-baked',
  'Desserts': 'desserts',
};

export const SLUG_TO_CATEGORY: Record<string, Category> = {
  'breakfast': 'Breakfast',
  'sides': 'Sides',
  'lunch': 'Lunch',
  'entrees': 'Entrees',
  'breads-baked': 'Breads & Baked',
  'desserts': 'Desserts',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  'Breakfast': '🍳',
  'Sides': '🥗',
  'Lunch': '🥪',
  'Entrees': '🍽️',
  'Breads & Baked': '🍞',
  'Desserts': '🍰',
};

export interface RecipeStep {
  title: string;
  ingredients: string[];
  instructions: string[];
}

export interface Recipe {
  id: string;
  title: string;
  category: Category;
  prep_time: string;
  cook_time: string;
  servings: string;
  all_ingredients: string[];
  steps: RecipeStep[];
  created_at: string;
}
