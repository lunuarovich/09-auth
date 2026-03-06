import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.overlay}>
      <div className={css.spinner}></div>
      <p className={css.text}>Loading...</p>
    </div>
  );
}