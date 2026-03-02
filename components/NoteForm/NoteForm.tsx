"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import type { Note } from "@/types/note";

import css from "./NoteForm.module.css";

type CreateNotePayload = {
  title: string;
  content?: string;
  tag: Note["tag"];
};

const TAG_OPTIONS: Note["tag"][] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

type ChangeEl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<ChangeEl>) => {
      const { name, value } = e.target;

      if (name === "title") {
        setDraft({ title: value });
        return;
      }

      if (name === "content") {
        setDraft({ content: value });
        return;
      }

      if (name === "tag") {
        setDraft({ tag: value as Note["tag"] });
      }
    },
    [setDraft]
  );

  const createNoteAction = useCallback(
    async (formData: FormData) => {
      const title = String(formData.get("title") ?? "").trim();
      const content = String(formData.get("content") ?? "").trim();
      const tag = String(formData.get("tag") ?? initialDraft.tag) as Note["tag"];

      if (title.length < 3) return;

      const payload: CreateNotePayload = {
        title,
        tag,
        ...(content ? { content } : {}),
      };

      try {
        await mutation.mutateAsync(payload);
        clearDraft();
        router.back();
      } catch {
        // error state is shown via mutation.isError
      }
    },
    [mutation, clearDraft, router]
  );

  return (
    <form className={css.form} action={createNoteAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={draft.title}
          required
          minLength={3}
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          value={draft.content}
          maxLength={500}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          required
          onChange={handleChange}
        >
          {TAG_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {mutation.isError && (
        <p className={css.error}>Failed to create note. Try again.</p>
      )}

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>

        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}