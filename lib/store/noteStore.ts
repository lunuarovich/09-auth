import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Note } from "@/types/note";

export const initialDraft: DraftNote = {
  title: "",
  content: "",
  tag: "Todo",
};

export type DraftNote = {
  title: string;
  content: string;
  tag: Note["tag"];
};

type NoteStoreState = {
  draft: DraftNote;
  setDraft: (note: Partial<DraftNote>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStoreState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
