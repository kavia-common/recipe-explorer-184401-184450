import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";
import { RecipeForm } from "~/components/recipes/RecipeForm";
import { fetchRecipeById, updateRecipe } from "~/services/api";
import type { Recipe } from "~/services/types";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Edit recipe page */
  const loc = useLocation();
  const id = loc.params["id"];
  const nav = useNavigate();

  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const initial = useSignal<Recipe | null>(null);

  const load = $(async () => {
    loading.value = true;
    error.value = null;
    try {
      initial.value = await fetchRecipeById(id);
    } catch (e: any) {
      error.value = e?.message || "Failed to load recipe";
    } finally {
      loading.value = false;
    }
  });

  useVisibleTask$(async () => {
    await load();
  });

  const onSubmit = $(async (input: any) => {
    try {
      const updated = await updateRecipe(id, input);
      await nav(`/recipe/${updated.id}`);
    } catch (e: any) {
      error.value = e?.message || "Failed to update recipe";
    }
  });

  return (
    <div>
      <section class="section-header">
        <div>
          <Link class="helper-text" href={`/recipe/${id}`}>← Back to details</Link>
          <h1 style={{ margin: "0.25rem 0 0" }}>Edit Recipe</h1>
        </div>
      </section>
      {loading.value ? (
        <div>Loading...</div>
      ) : error.value ? (
        <div style={{ color: "var(--color-error)" }}>{error.value}</div>
      ) : initial.value ? (
        <RecipeForm initial={initial.value} onSubmit$={onSubmit} submitLabel="Save Changes" />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Recipe",
  meta: [{ name: "description", content: "Edit existing recipe." }],
};
