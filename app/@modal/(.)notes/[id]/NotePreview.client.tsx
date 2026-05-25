"use client";

import Modal from "@/components/Modal/Modal";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/clientApi";
import formatNoteDate from "@/lib/utils/formatNoteDate";
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
        Back to notes
      </button>

      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
          <div className={css.meta}>
            <span className={css.tag}>{data.tag}</span>
            <span className={css.date}>
              Created {formatNoteDate(data.createdAt)}
            </span>
          </div>
        </div>

        <div className={css.contentBlock}>
          <p className={css.content}>{data.content}</p>
        </div>
      </div>
    </Modal>
  );
}
