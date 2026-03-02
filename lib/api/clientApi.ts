import { api } from "./api";

import type { Note } from "@/types/note";
import type { NotesResponse } from "@/types/notes-response";
import type { User } from "@/types/user";

export type FetchNotesParams = {
  page: number;
  search: string;
  tag?: string;
};

export async function fetchNotes(params: FetchNotesParams): Promise<NotesResponse> {
  const { page, search, tag } = params;

  const res = await api.get<NotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search: search || undefined,
      tag: tag || undefined,
    },
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export type CreateNotePayload = Pick<Note, "title" | "content" | "tag">;

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}

export type AuthPayload = {
  email: string;
  password: string;
};

export async function register(payload: AuthPayload): Promise<User> {
  const res = await api.post<User>("/auth/register", payload);
  return res.data;
}

export async function login(payload: AuthPayload): Promise<User> {
  const res = await api.post<User>("/auth/login", payload);
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export type SessionResponse = { success: boolean };

export async function checkSession(): Promise<SessionResponse> {
  const res = await api.get<SessionResponse>("/auth/session");
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}

export type UpdateMePayload = Partial<Pick<User, "username">>;

export async function updateMe(payload: UpdateMePayload): Promise<User> {
  const res = await api.patch<User>("/users/me", payload);
  return res.data;
}
