import type { Recipe } from "./types";

export const sampleRecipes: Recipe[] = [
  {
    id: "1",
    title: "Grilled Lemon Herb Chicken",
    cuisine: "American",
    type: "Dinner",
    description:
      "Juicy grilled chicken marinated with lemon, garlic, and herbs.",
    imageUrl: "",
    ingredients: [
      "4 chicken breasts",
      "2 lemons (zest and juice)",
      "3 cloves garlic, minced",
      "2 tbsp olive oil",
      "1 tsp dried oregano",
      "Salt & pepper",
    ],
    instructions:
      "Whisk marinade, coat chicken, marinate 30 min, grill 6-7 min each side.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Creamy Mushroom Pasta",
    cuisine: "Italian",
    type: "Dinner",
    description: "Rich and creamy pasta with sautéed mushrooms and parmesan.",
    imageUrl: "",
    ingredients: [
      "8 oz pasta",
      "2 cups mushrooms, sliced",
      "2 cloves garlic, minced",
      "1 cup cream",
      "1/2 cup parmesan, grated",
      "Salt & pepper",
    ],
    instructions:
      "Cook pasta. Sauté mushrooms and garlic, add cream and cheese, toss with pasta.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Avocado Toast with Egg",
    cuisine: "American",
    type: "Breakfast",
    description:
      "Crispy toast topped with mashed avocado and a perfectly cooked egg.",
    imageUrl: "",
    ingredients: [
      "2 slices bread",
      "1 ripe avocado",
      "1 egg",
      "Salt, pepper, chili flakes",
      "Olive oil",
    ],
    instructions:
      "Toast bread. Mash avocado with seasoning. Cook egg to preference. Assemble.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
