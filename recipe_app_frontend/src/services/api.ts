import { sampleRecipes } from "./mockData";
import type { Recipe, RecipeInput, RecipeQuery, PagedResult } from "./types";

/**
 * Data layer that uses REST via VITE_API_BASE if available; otherwise falls back to in-memory mock.
 * Never hardcodes endpoints; reads from import.meta.env.
 */
const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE || (import.meta as any)?.env?.VITE_BACKEND_URL || "";

const useMock =
  !API_BASE || `${API_BASE}`.trim() === "" || (import.meta as any)?.env?.VITE_NODE_ENV === "development";

let memory = [...sampleRecipes];

function simulateLatency<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// PUBLIC_INTERFACE
export async function fetchRecipes(query: RecipeQuery = {}): Promise<PagedResult<Recipe>> {
  /**
   * Fetch paged recipes list with optional search/filter.
   * Falls back to mock if VITE_API_BASE not set.
   */
  if (useMock) {
    const { q = "", cuisine = "", type = "", page = 1, pageSize = 9 } = query;
    const qlc = q.toLowerCase();
    const filtered = memory.filter((r) => {
      const matchesQ =
        !qlc ||
        r.title.toLowerCase().includes(qlc) ||
        (r.description || "").toLowerCase().includes(qlc) ||
        r.ingredients.join(" ").toLowerCase().includes(qlc);
      const matchesCuisine = !cuisine || r.cuisine === cuisine;
      const matchesType = !type || r.type === type;
      return matchesQ && matchesCuisine && matchesType;
    });
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return simulateLatency({ items, page, pageSize, total: filtered.length });
  }

  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.cuisine) params.set("cuisine", query.cuisine);
  if (query.type) params.set("type", query.type);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));

  const res = await fetch(`${API_BASE}/recipes?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch recipes: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchRecipeById(id: string): Promise<Recipe> {
  /** Fetch a single recipe by id */
  if (useMock) {
    const found = memory.find((r) => r.id === id);
    if (!found) throw new Error("Recipe not found");
    return simulateLatency(found);
  }
  const res = await fetch(`${API_BASE}/recipes/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch recipe: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  /** Create a recipe */
  if (useMock) {
    const id = String(Math.max(0, ...memory.map((r) => Number(r.id) || 0)) + 1);
    const now = new Date().toISOString();
    const recipe = { ...input, id, createdAt: now, updatedAt: now };
    memory = [recipe, ...memory];
    return simulateLatency(recipe);
  }
  const res = await fetch(`${API_BASE}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create recipe: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
  /** Update a recipe by id */
  if (useMock) {
    const idx = memory.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Recipe not found");
    const now = new Date().toISOString();
    const updated = { ...memory[idx], ...input, id, updatedAt: now };
    memory[idx] = updated;
    return simulateLatency(updated);
  }
  const res = await fetch(`${API_BASE}/recipes/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to update recipe: ${res.status}`);
  return res.json();
}
