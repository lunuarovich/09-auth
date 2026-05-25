"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Select, {
  components,
  type DropdownIndicatorProps,
  type SingleValue,
} from "react-select";

import { createNote } from "@/lib/api/clientApi";
import type { CreateNotePayload } from "@/lib/api/clientApi";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import type { Note } from "@/types/note";

import css from "./NoteForm.module.css";

const TAG_OPTIONS: Note["tag"][] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

type TagOption = {
  value: Note["tag"];
  label: Note["tag"];
};

const SELECT_OPTIONS: TagOption[] = TAG_OPTIONS.map((tag) => ({
  value: tag,
  label: tag,
}));

type ChangeEl = HTMLInputElement | HTMLTextAreaElement;

function DropdownIndicator(props: DropdownIndicatorProps<TagOption, false>) {
  const iconId = props.selectProps.menuIsOpen
    ? "icon-up-active"
    : "icon-up-default";

  return (
    <components.DropdownIndicator {...props}>
      <svg className={css.selectIcon} aria-hidden="true">
        <use href={`/sprite.svg#${iconId}`} />
      </svg>
    </components.DropdownIndicator>
  );
}

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
    },
    [setDraft],
  );

  const handleTagChange = useCallback(
    (option: SingleValue<TagOption>) => {
      if (!option) return;
      setDraft({ tag: option.value });
    },
    [setDraft],
  );

  const selectedTag =
    SELECT_OPTIONS.find((option) => option.value === draft.tag) ??
    SELECT_OPTIONS[0];

  const createNoteAction = useCallback(
    async (formData: FormData) => {
      const title = String(formData.get("title") ?? "").trim();
      const content = String(formData.get("content") ?? "").trim();
      const tag = String(
        formData.get("tag") ?? initialDraft.tag,
      ) as Note["tag"];

      if (title.length < 3) return;

      const payload: CreateNotePayload = {
        title,
        content,
        tag,
      };

      try {
        await mutation.mutateAsync(payload);
        clearDraft();
        router.back();
      } catch {
        // error state is shown via mutation.isError
      }
    },
    [mutation, clearDraft, router],
  );

  return (
    <form className={css.form} action={createNoteAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          placeholder="Note title"
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
          placeholder="Write the note details..."
          value={draft.content}
          maxLength={500}
          minLength={3}
          required
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <input type="hidden" name="tag" value={draft.tag} />
        <Select<TagOption, false>
          inputId="tag"
          instanceId="tag-select"
          className={css.select}
          classNamePrefix="tagSelect"
          components={{ DropdownIndicator, IndicatorSeparator: null }}
          options={SELECT_OPTIONS}
          value={selectedTag}
          isSearchable={false}
          required
          onChange={handleTagChange}
        />
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
          <svg className={css.buttonIcon} aria-hidden="true">
            <use href="/sprite.svg#icon-add" />
          </svg>
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
