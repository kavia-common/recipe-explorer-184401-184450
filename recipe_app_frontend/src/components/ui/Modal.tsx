import { component$, Slot } from "@builder.io/qwik";

export type ModalProps = {
  open: boolean;
  onClose$?: any;
  title?: string;
};

// PUBLIC_INTERFACE
export const Modal = component$((props: ModalProps) => {
  /** Accessible modal with basic theming and scrim. */
  if (!props.open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: "0",
        background: "rgba(17,24,39,0.45)",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        zIndex: "50",
      }}
      onClick$={props.onClose$}
    >
      <div
        class="app-surface"
        style={{
          width: "100%",
          maxWidth: "640px",
          borderRadius: "12px",
          boxShadow: "var(--shadow-lg)",
          padding: "1rem",
        }}
        onClick$={(e: any) => e.stopPropagation()}
      >
        {props.title ? (
          <div style={{ marginBottom: "0.75rem", fontWeight: 600 }}>
            {props.title}
          </div>
        ) : null}
        <Slot />
      </div>
    </div>
  );
});
