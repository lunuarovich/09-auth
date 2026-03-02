"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes } from "@/lib/api";
import type { NotesResponse } from "@/types/notes-response";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

import css from "./NotesPage.module.css";

export default function NotesClient({ tag }: { tag?: string }) {
  const [page, setPage] = useState<number>(() => 1);
  const [search, setSearch] = useState<string>(() => "");

  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery<NotesResponse>({
    queryKey: ["notes", page, debouncedSearch, tag ?? ""],
    queryFn: () => fetchNotes(page, debouncedSearch, tag),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        <Link href="/notes/action/create" className={css.button}>
          Create note
        </Link>
      </div>

      <NoteList notes={data.notes} />

      {data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </main>
  );
}