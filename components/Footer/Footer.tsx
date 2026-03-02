import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
      <div className={css.wrap}>
        <p>Developer: Martynchuk Maksym</p>
        <p>
          Contact us:
          <a href="mailto:lenuar.max@gmail.com">lenuar.max@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}