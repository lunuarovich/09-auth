"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import css from "./SidebarNotes.module.css";
import type { Note } from "@/types/note";

const TAGS: Note["tag"][] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  const pathname = usePathname();

  const getLinkClassName = (href: string) =>
    `${css.menuLink} ${pathname === href ? css.active : ""}`;

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link
          href="/notes/filter/all"
          className={getLinkClassName("/notes/filter/all")}
        >
          All notes
        </Link>
      </li>

      {TAGS.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${tag}`}
            className={getLinkClassName(`/notes/filter/${tag}`)}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
