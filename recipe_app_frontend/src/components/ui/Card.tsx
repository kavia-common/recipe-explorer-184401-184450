import { component$, Slot } from "@builder.io/qwik";

// PUBLIC_INTERFACE
export const Card = component$(() => {
  /** Themed card surface with padding and shadow */
  return (
    <div
      class="app-surface"
      style={{
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <Slot />
    </div>
  );
});
