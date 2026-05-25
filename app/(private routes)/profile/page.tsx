import type { Metadata } from "next";
import Link from "next/link";

import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/serverApi";
import getCookieHeader from "@/lib/utils/getCookieHeader";
import { FALLBACK_AVATAR_URL } from "@/lib/utils/getAvatarSrc";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your NoteHub profile page.",
  alternates: { canonical: "/profile" },
  openGraph: {
    title: "Profile",
    description: "Your NoteHub profile page.",
    url: "/profile",
    images: [FALLBACK_AVATAR_URL],
  },
};

export default async function ProfilePage() {
  const cookieHeader = await getCookieHeader();
  const user = await getMe(cookieHeader);

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <div>
            <p className={css.eyebrow}>Account</p>
            <h1 className={css.formTitle}>Profile</h1>
          </div>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.profileHero}>
          <div className={css.avatarWrapper}>
            <ProfileAvatar
              email={user.email}
              avatar={user.avatar}
              className={css.avatar}
            />
          </div>

          <div className={css.identity}>
            <p className={css.name}>{user.username}</p>
            <p className={css.email}>{user.email}</p>
          </div>
        </div>

        <div className={css.profileInfo}>
          <div className={css.infoRow}>
            <span className={css.infoLabel}>Username</span>
            <span className={css.infoValue}>{user.username}</span>
          </div>
          <div className={css.infoRow}>
            <span className={css.infoLabel}>Email</span>
            <span className={css.infoValue}>{user.email}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
