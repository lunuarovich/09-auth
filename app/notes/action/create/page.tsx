import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

const BASE_URL = "https://08-zustand-gamma-virid.vercel.app";
const PAGE_URL = `${BASE_URL}/notes/action/create`;
const OG_IMAGE_URL = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description:
    "Create a new note in NoteHub. Add a title, content, and select a tag.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Create note | NoteHub",
    description:
      "Create a new note in NoteHub. Add a title, content, and select a tag.",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE_URL,
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
