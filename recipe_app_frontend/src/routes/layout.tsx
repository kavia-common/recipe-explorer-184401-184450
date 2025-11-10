import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import styles from "./styles.css?inline";
import { Navbar } from "~/components/ui/Navbar";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

// PUBLIC_INTERFACE
export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <Navbar />
      <main class="container" style={{ padding: "1rem 0 2rem" }}>
        <Slot />
      </main>
    </>
  );
});
