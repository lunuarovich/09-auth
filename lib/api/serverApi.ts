import { api } from "./api";

import type { Note } from "@/types/note";
import type { NotesResponse } from "@/types/notes-response";
import type { User } from "@/types/user";

export type FetchNotesParams = {
  page: number;
  search: string;
  tag?: string;
};

function withCookies(cookieHeader: string) {
  return {
    headers: {
      Cookie: cookieHeader,
    },
  };
}

export async function fetchNotes(
  params: FetchNotesParams,
  cookieHeader: string
): Promise<NotesResponse> {
  const { page, search, tag } = params;

  const res = await api.get<NotesResponse>("/notes", {
    ...withCookies(cookieHeader),
    params: {
      page,
      perPage: 12,
      search: search || undefined,
      tag: tag || undefined,
    },
  });

  return res.data;
}

export async function fetchNoteById(
  id: string,
  cookieHeader: string
): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`, withCookies(cookieHeader));
  return res.data;
}

export type SessionResponse = { success: boolean };

export async function checkSession(cookieHeader: string): Promise<SessionResponse> {
  const res = await api.get<SessionResponse>("/auth/session", withCookies(cookieHeader));
  return res.data;
}

export async function getMe(cookieHeader: string): Promise<User> {
  const res = await api.get<User>("/users/me", withCookies(cookieHeader));
  return res.data;
}
