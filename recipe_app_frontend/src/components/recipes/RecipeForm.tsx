import { component$, useSignal, $ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import type { Recipe, RecipeInput } from "~/services/types";

type FormProps = {
  initial?: Partial<Recipe>;
  onSubmit$: PropFunction<(input: RecipeInput) => Promise<void> | void>;
  submitLabel?: string;
};

// PUBLIC_INTERFACE
export const RecipeForm = component$((props: FormProps) => {
  /** Controlled form with simple validation and accessible labels. */
  const title = useSignal(props.initial?.title || "");
  const cuisine = useSignal(props.initial?.cuisine || "");
  const rtype = useSignal(props.initial?.type || "");
  const description = useSignal(props.initial?.description || "");
  const ingredients = useSignal((props.initial?.ingredients || []).join("\n"));
  const instructions = useSignal(props.initial?.instructions || "");

  const errors = useSignal<{ [k: string]: string }>({});
  const submitting = useSignal(false);

  const validate = $(() => {
    const e: { [k: string]: string } = {};
    if (!title.value.trim()) e["title"] = "Title is required.";
    if (!ingredients.value.trim()) e["ingredients"] = "At least one ingredient is required.";
    if (!instructions.value.trim()) e["instructions"] = "Instructions are required.";
    errors.value = e;
    return Object.keys(e).length === 0;
  });

  const handleSubmit = $(async (ev: Event) => {
    ev.preventDefault();
    if (!(await validate())) return;
    submitting.value = true;
    try {
      const input: RecipeInput = {
        title: title.value.trim(),
        cuisine: cuisine.value || undefined,
        type: rtype.value || undefined,
        description: description.value || undefined,
        imageUrl: props.initial?.imageUrl,
        ingredients: ingredients.value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        instructions: instructions.value,
      };
      await props.onSubmit$(input);
    } finally {
      submitting.value = false;
    }
  });

  return (
    <Card>
      <form onSubmit$={handleSubmit} class="grid" style={{ gap: "0.75rem" }}>
        <div>
          <label>
            Title
            <input
              type="text"
              value={title.value}
              onInput$={(e: any) => (title.value = e.target.value)}
              aria-invalid={!!errors.value.title}
              aria-describedby="err-title"
              placeholder="e.g., Creamy Mushroom Pasta"
            />
          </label>
          {errors.value.title ? (
            <div id="err-title" style={{ color: "var(--color-error)", fontSize: "0.875rem" }}>
              {errors.value.title}
            </div>
          ) : null}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label>
              Cuisine
              <select value={cuisine.value} onChange$={(e: any) => (cuisine.value = e.target.value)}>
                <option value="">Select cuisine</option>
                <option>American</option>
                <option>Italian</option>
                <option>Mexican</option>
                <option>Indian</option>
                <option>Asian</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Type
              <select value={rtype.value} onChange$={(e: any) => (rtype.value = e.target.value)}>
                <option value="">Select type</option>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Dessert</option>
                <option>Snack</option>
              </select>
            </label>
          </div>
        </div>

        <div>
          <label>
            Description
            <textarea
              rows={3}
              value={description.value}
              onInput$={(e: any) => (description.value = e.target.value)}
              placeholder="Short overview..."
            />
          </label>
        </div>

        <div>
          <label>
            Ingredients (one per line)
            <textarea
              rows={6}
              value={ingredients.value}
              onInput$={(e: any) => (ingredients.value = e.target.value)}
              aria-invalid={!!errors.value.ingredients}
              aria-describedby="err-ingredients"
              placeholder={"e.g.\n8 oz pasta\n2 cups mushrooms"}
            />
          </label>
          {errors.value.ingredients ? (
            <div id="err-ingredients" style={{ color: "var(--color-error)", fontSize: "0.875rem" }}>
              {errors.value.ingredients}
            </div>
          ) : null}
        </div>

        <div>
          <label>
            Instructions
            <textarea
              rows={6}
              value={instructions.value}
              onInput$={(e: any) => (instructions.value = e.target.value)}
              aria-invalid={!!errors.value.instructions}
              aria-describedby="err-instructions"
              placeholder="Describe preparation steps..."
            />
          </label>
          {errors.value.instructions ? (
            <div id="err-instructions" style={{ color: "var(--color-error)", fontSize: "0.875rem" }}>
              {errors.value.instructions}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <Button kind="ghost" type="reset">Reset</Button>
          <Button type="submit" disabled={submitting.value}>
            {props.submitLabel || "Save Recipe"}
          </Button>
        </div>
      </form>
    </Card>
  );
});
