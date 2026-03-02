import axios from "axios";

import type { Note } from "@/types/note";
import type { NotesResponse } from "@/types/notes-response";

const apiClient = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<NotesResponse> => {
  const { data } = await apiClient.get<NotesResponse>("/notes", {
    params: { page, search, tag },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await apiClient.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: {
  title: string;
  tag: Note["tag"];
  content?: string;
}): Promise<Note> => {
  const { data } = await apiClient.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await apiClient.delete<Note>(`/notes/${id}`);
  return data;
};