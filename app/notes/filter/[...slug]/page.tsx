import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const OG_IMAGE_URL =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const first = slug?.[0] ?? "all";
  const tag = first === "all" ? undefined : first;

  const title = tag ? `Notes — ${tag}` : "Notes";
  const description = tag
    ? `Browse notes filtered by “${tag}” in NoteHub.`
    : "Browse all notes in NoteHub.";

  const url = tag ? `/notes/filter/${tag}` : "/notes/filter/all";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | NoteHub`,
      description,
      url,
      images: [OG_IMAGE_URL],
    },
  };
}

export default async function NotesBySlugPage({ params }: PageProps) {
  const { slug } = await params;

  const first = slug?.[0] ?? "all";
  const tag = first === "all" ? undefined : first;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag ?? ""],
    queryFn: () => fetchNotes(1, "", tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}