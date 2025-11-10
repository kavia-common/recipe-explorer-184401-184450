export type Recipe = {
  id: string;
  title: string;
  cuisine?: string;
  type?: string; // e.g., 'Breakfast', 'Lunch', 'Dinner', 'Dessert'
  description?: string;
  imageUrl?: string;
  ingredients: string[];
  instructions: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RecipeInput = Omit<Recipe, "id" | "createdAt" | "updatedAt">;

export type RecipeQuery = {
  q?: string;
  cuisine?: string;
  type?: string;
  page?: number;
  pageSize?: number;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
