"use client";

import Modal from "@/components/Modal/Modal";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";

export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !data) return <p>Something went wrong.</p>;

  return (
    <Modal onClose={() => router.back()}>
      <button
        type="button"
        className={css.backBtn}
        onClick={() => router.back()}
      >
        Back
      </button>

      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>

        <p className={css.tag}>{data.tag}</p>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>{data.createdAt}</p>
      </div>
    </Modal>
  );
}
