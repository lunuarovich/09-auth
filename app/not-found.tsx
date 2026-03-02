import type { Metadata } from "next";

import css from "./Home.module.css";

const OG_IMAGE_URL =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "The requested page does not exist in NoteHub.",
  alternates: { canonical: "/404" },
  openGraph: {
    title: "404 — Page not found | NoteHub",
    description: "The requested page does not exist in NoteHub.",
    url: "/404",
    images: [OG_IMAGE_URL],
  },
};

export default function NotFound() {
  return (
    <main>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={`${css.description} ${css.notFound}`}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}