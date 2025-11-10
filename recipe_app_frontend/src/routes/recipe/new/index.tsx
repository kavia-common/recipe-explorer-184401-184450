import { component$, $, useSignal } from "@builder.io/qwik";
import { Link, type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { RecipeForm } from "~/components/recipes/RecipeForm";
import { createRecipe } from "~/services/api";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Add recipe page */
  const nav = useNavigate();
  const error = useSignal<string | null>(null);

  const onSubmit = $(async (input: any) => {
    try {
      const created = await createRecipe(input);
      await nav(`/recipe/${created.id}`);
    } catch (e: any) {
      error.value = e?.message || "Failed to create recipe";
    }
  });

  return (
    <div>
      <section class="section-header">
        <div>
          <Link class="helper-text" href="/">← Back to list</Link>
          <h1 style={{ margin: "0.25rem 0 0" }}>Add New Recipe</h1>
        </div>
      </section>
      {error.value ? (
        <div style={{ color: "var(--color-error)", marginBottom: "0.75rem" }}>{error.value}</div>
      ) : null}
      <RecipeForm onSubmit$={onSubmit} submitLabel="Create Recipe" />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Add Recipe",
  meta: [{ name: "description", content: "Create a new recipe." }],
};
