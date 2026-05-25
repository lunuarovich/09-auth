"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import css from "./SignInPage.module.css";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login({ email, password });
      setUser(user);
      router.push("/profile");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.header}>
          <p className={css.eyebrow}>Welcome back</p>
          <h1 className={css.formTitle}>Sign in</h1>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            placeholder="Your password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error ? <p className={css.error}>{error}</p> : null}

        <p className={css.switchText}>
          New to NoteHub?{" "}
          <Link href="/sign-up" className={css.switchLink}>
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
