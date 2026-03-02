import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/serverApi";

const OG_IMAGE_URL =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your NoteHub profile page.",
  alternates: { canonical: "/profile" },
  openGraph: {
    title: "Profile",
    description: "Your NoteHub profile page.",
    url: "/profile",
    images: [OG_IMAGE_URL],
  },
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const user = await getMe(cookieStore.toString());

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || OG_IMAGE_URL}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
