import Link from "next/link";
import Image from "next/image";
import css from "./Header.module.css";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        <Image
          src="/icon.svg"
          alt=""
          width={30}
          height={30}
          className={css.logoIcon}
          aria-hidden="true"
        />
        NoteHub
      </Link>
      <nav>
        <ul className={css.navigation}>
          <li>
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/notes/filter/all" className={css.navigationLink}>
              Notes
            </Link>
          </li>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
