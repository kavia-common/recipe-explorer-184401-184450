import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import type { Recipe, RecipeQuery, PagedResult } from "~/services/types";
import { fetchRecipes } from "~/services/api";

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(245,158,11,0.12))",
            border: "1px solid var(--color-border)",
            flex: "0 0 auto",
          }}
          aria-hidden="true"
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/recipe/${recipe.id}`}>
            <h3 style={{ margin: 0, color: "var(--color-text)" }}>
              {recipe.title}
            </h3>
          </Link>
          <div class="helper-text" style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            {recipe.cuisine ? <span class="badge">{recipe.cuisine}</span> : null}
            {recipe.type ? <span class="badge">{recipe.type}</span> : null}
          </div>
          <p style={{ marginTop: "0.5rem", color: "var(--color-muted)" }}>
            {recipe.description || "No description provided."}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <Link class="btn ghost" href={`/recipe/${recipe.id}`}>View</Link>
            <Link class="btn secondary" href={`/recipe/${recipe.id}/edit`}>Edit</Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

// PUBLIC_INTERFACE
export default component$(() => {
  /**
   * Home page with search, filters, and grid list of recipes.
   */
  const q = useSignal("");
  const cuisine = useSignal("");
  const rtype = useSignal("");
  const page = useSignal(1);
  const pageSize = 9;

  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const data = useSignal<PagedResult<Recipe> | null>(null);

  const load = $(async () => {
    loading.value = true;
    error.value = null;
    try {
      const query: RecipeQuery = {
        q: q.value,
        cuisine: cuisine.value || undefined,
        type: rtype.value || undefined,
        page: page.value,
        pageSize,
      };
      data.value = await fetchRecipes(query);
    } catch (e: any) {
      error.value = e?.message || "Failed to load recipes";
    } finally {
      loading.value = false;
    }
  });

  useVisibleTask$(async () => {
    await load();
  });

  const onSearch = $(async (e: Event) => {
    e.preventDefault();
    page.value = 1;
    await load();
  });

  const totalPages = $(() => Math.max(1, Math.ceil((data.value?.total || 0) / pageSize)));

  return (
    <div>
      <section class="section-header">
        <div>
          <h1 style={{ margin: 0 }}>Discover Recipes</h1>
          <div class="helper-text">
            Browse, search, and filter recipes. Add your own creations.
          </div>
        </div>
        <Link class="btn" href="/recipe/new">+ New Recipe</Link>
      </section>

      <Card>
        <form
          onSubmit$={onSearch}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 160px 160px auto",
            gap: "0.75rem",
          }}
        >
          <input
            type="search"
            placeholder="Search by name, ingredient..."
            value={q.value}
            onInput$={(e: any) => (q.value = e.target.value)}
            aria-label="Search recipes"
          />
          <select
            value={cuisine.value}
            onChange$={(e: any) => (cuisine.value = e.target.value)}
            aria-label="Filter by cuisine"
          >
            <option value="">All Cuisines</option>
            <option>American</option>
            <option>Italian</option>
            <option>Mexican</option>
            <option>Indian</option>
            <option>Asian</option>
          </select>
          <select
            value={rtype.value}
            onChange$={(e: any) => (rtype.value = e.target.value)}
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Dessert</option>
            <option>Snack</option>
          </select>
          <Button type="submit">Search</Button>
        </form>
      </Card>

      {loading.value ? (
        <div style={{ padding: "1rem" }}>Loading recipes...</div>
      ) : error.value ? (
        <div style={{ padding: "1rem", color: "var(--color-error)" }}>{error.value}</div>
      ) : data.value && data.value.items.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <div class="helper-text">No recipes found. Try adjusting filters or add a new recipe.</div>
            <div style={{ marginTop: "0.75rem" }}>
              <Link class="btn" href="/recipe/new">Add your first recipe</Link>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: "1rem" }}>
            {data.value?.items.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              kind="ghost"
              ariaLabel="Previous page"
              onClick$={$(async () => {
                page.value = Math.max(1, page.value - 1);
                await load();
              })}
              disabled={page.value <= 1}
            >
              ← Prev
            </Button>
            <div class="helper-text">
              Page {page.value} of {totalPages()}
            </div>
            <Button
              kind="ghost"
              ariaLabel="Next page"
              onClick$={$(async () => {
                const tp = Math.max(1, Math.ceil((data.value?.total || 0) / pageSize));
                page.value = Math.min(tp, page.value + 1);
                await load();
              })}
              disabled={page.value >= Math.max(1, Math.ceil((data.value?.total || 0) / pageSize))}
            >
              Next →
            </Button>
          </div>
        </>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Recipe Explorer",
  meta: [
    {
      name: "description",
      content:
        "Browse, search, add, and edit recipes using a modern, responsive interface.",
    },
  ],
};
