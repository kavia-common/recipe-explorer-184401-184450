import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/Card";
import type { Recipe } from "~/services/types";
import { fetchRecipeById } from "~/services/api";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Recipe details page showing ingredients and instructions. */
  const loc = useLocation();
  const id = loc.params["id"];

  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const recipe = useSignal<Recipe | null>(null);

  const load = $(async () => {
    loading.value = true;
    error.value = null;
    try {
      recipe.value = await fetchRecipeById(id);
    } catch (e: any) {
      error.value = e?.message || "Failed to load recipe";
    } finally {
      loading.value = false;
    }
  });

  useVisibleTask$(async () => {
    await load();
  });

  return (
    <div>
      <section class="section-header">
        <div>
          <Link class="helper-text" href="/">← Back to list</Link>
          <h1 style={{ margin: "0.25rem 0 0" }}>{recipe.value?.title || "Recipe"}</h1>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link class="btn secondary" href={`/recipe/${id}/edit`}>
            Edit
          </Link>
        </div>
      </section>

      {loading.value ? (
        <div style={{ padding: "1rem" }}>Loading...</div>
      ) : error.value ? (
        <div style={{ padding: "1rem", color: "var(--color-error)" }}>{error.value}</div>
      ) : recipe.value ? (
        <div class="grid sm:grid-cols-2" style={{ gap: "1rem" }}>
          <Card>
            <div
              style={{
                width: "100%",
                height: "220px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(245,158,11,0.12))",
                border: "1px solid var(--color-border)",
              }}
              aria-hidden="true"
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
              {recipe.value.cuisine ? <span class="badge">{recipe.value.cuisine}</span> : null}
              {recipe.value.type ? <span class="badge">{recipe.value.type}</span> : null}
            </div>
            {recipe.value.description ? (
              <p style={{ marginTop: "0.5rem", color: "var(--color-muted)" }}>
                {recipe.value.description}
              </p>
            ) : null}
          </Card>

          <div class="grid" style={{ gap: "1rem" }}>
            <Card>
              <h3 style={{ marginTop: 0 }}>Ingredients</h3>
              <ul>
                {recipe.value.ingredients.map((ing, idx) => (
                  <li key={idx} style={{ marginBottom: "0.25rem" }}>
                    {ing}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 style={{ marginTop: 0 }}>Instructions</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{recipe.value.instructions}</p>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Recipe Details",
  meta: [{ name: "description", content: "Recipe detail view." }],
};
