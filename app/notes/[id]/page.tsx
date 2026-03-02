import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

const OG_IMAGE_URL =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    const title = note.title || "Note details";
    const descriptionSource =
      note.content?.trim() || `Note tagged “${note.tag}”.`;
    const description =
      descriptionSource.length > 160
        ? `${descriptionSource.slice(0, 157)}...`
        : descriptionSource;

    const url = `/notes/${id}`;

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
  } catch {
    const url = `/notes/${id}`;
    return {
      title: "Note details",
      description: "View note details in NoteHub.",
      alternates: { canonical: url },
      openGraph: {
        title: "Note details | NoteHub",
        description: "View note details in NoteHub.",
        url,
        images: [OG_IMAGE_URL],
      },
    };
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}