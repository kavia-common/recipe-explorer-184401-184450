import { component$, $, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

// PUBLIC_INTERFACE
export const Navbar = component$(() => {
  /**
   * Navbar with application title and quick actions.
   * Uses Ocean Professional theme colors and responsive layout.
   */
  const menuOpen = useSignal(false);
  const toggle = $(() => (menuOpen.value = !menuOpen.value));

  return (
    <header
      style={{
        background:
          "linear-gradient(135deg, rgba(59,130,246,0.10), #f9fafb 60%)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <nav class="container" style={{ padding: "0.75rem 1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" aria-label="Recipe Explorer home">
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "var(--color-primary)",
                  borderRadius: "10px",
                  boxShadow: "var(--shadow-sm)",
                }}
                aria-hidden="true"
              />
              <div>
                <div style={{ fontWeight: 700, color: "var(--color-text)" }}>
                  Recipe Explorer
                </div>
                <div class="helper-text">Discover. Cook. Enjoy.</div>
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link class="btn ghost" href="/" aria-label="Browse recipes">
              Browse
            </Link>
            <Link class="btn" href="/recipe/new" aria-label="Add recipe">
              + Add Recipe
            </Link>
            <button
              class="btn ghost"
              onClick$={toggle}
              aria-label="Toggle menu"
              style={{ display: "none" }}
            >
              Menu
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
});
