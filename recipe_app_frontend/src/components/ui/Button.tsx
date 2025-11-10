import { component$, Slot } from "@builder.io/qwik";

export type ButtonProps = {
  kind?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick$?: any;
  ariaLabel?: string;
  class?: string;
};

// PUBLIC_INTERFACE
export const Button = component$((props: ButtonProps) => {
  /** Simple themed button wrapper. */
  const kindClass =
    props.kind === "secondary"
      ? "btn secondary"
      : props.kind === "ghost"
      ? "btn ghost"
      : "btn";
  return (
    <button
      type={props.type ?? "button"}
      class={`${kindClass} ${props.class ?? ""}`.trim()}
      onClick$={props.onClick$}
      disabled={props.disabled}
      aria-label={props.ariaLabel}
    >
      <Slot />
    </button>
  );
});
