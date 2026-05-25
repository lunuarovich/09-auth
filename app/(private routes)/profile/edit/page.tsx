"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import css from "./EditProfilePage.module.css";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import getAvatarSrc from "@/lib/utils/getAvatarSrc";
import { getStoredAvatar, saveStoredAvatar } from "@/lib/utils/avatarStorage";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const AVATAR_OUTPUT_SIZE = 512;
const AVATAR_QUALITY = 0.82;
const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded"));
    image.src = src;
  });
}

async function compressAvatarFile(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not supported");
    }

    canvas.width = AVATAR_OUTPUT_SIZE;
    canvas.height = AVATAR_OUTPUT_SIZE;

    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = (image.naturalWidth - sourceSize) / 2;
    const sourceY = (image.naturalHeight - sourceSize) / 2;

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      AVATAR_OUTPUT_SIZE,
      AVATAR_OUTPUT_SIZE,
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", AVATAR_QUALITY);
    });

    if (!blob) {
      throw new Error("Image could not be compressed");
    }

    return readBlobAsDataUrl(blob);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [avatar, setAvatar] = useState<string>(user?.avatar ?? "");
  const [avatarFileName, setAvatarFileName] = useState<string>("");
  const [avatarError, setAvatarError] = useState<string>("");
  const [avatarChanged, setAvatarChanged] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function run() {
      setIsLoading(true);
      try {
        const me = await getMe();
        if (!isMounted) return;
        const storedAvatar = getStoredAvatar(me.email);
        const nextUser = storedAvatar ? { ...me, avatar: storedAvatar } : me;
        setUser(nextUser);
        setUsername(me.username);
        setEmail(me.email);
        setAvatar(nextUser.avatar);
        setAvatarFileName("");
        setAvatarError("");
        setAvatarChanged(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    run();

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setAvatarError("");
    setSubmitError("");

    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setAvatarError("Please choose a PNG, JPG, GIF or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("Avatar must be 2 MB or smaller.");
      e.target.value = "";
      return;
    }

    try {
      const nextAvatar = await compressAvatarFile(file);
      setAvatar(nextAvatar);
      setAvatarFileName(file.name);
      setAvatarChanged(true);
    } catch {
      setAvatarError("Could not prepare this image. Try another file.");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setIsSaving(true);

    try {
      const updated = await updateMe({ username: username.trim() });
      let nextAvatar = getStoredAvatar(updated.email) ?? updated.avatar;

      if (avatarChanged) {
        try {
          saveStoredAvatar(updated.email, avatar);
          nextAvatar = avatar;
        } catch {
          setUser({ ...updated, avatar });
          setSubmitError("Username saved, but avatar could not be stored.");
          return;
        }
      }

      setUser({ ...updated, avatar: nextAvatar });
      router.push("/profile");
    } catch {
      setSubmitError("Could not save profile changes. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <div>
            <p className={css.eyebrow}>Account settings</p>
            <h1 className={css.formTitle}>Edit Profile</h1>
          </div>
        </div>

        <div className={css.profileHero}>
          <div className={css.avatarWrapper}>
            <Image
              src={getAvatarSrc(avatar)}
              alt="User Avatar"
              width={128}
              height={128}
              className={css.avatar}
              unoptimized={avatar.startsWith("data:image/")}
            />
          </div>

          <div className={css.identity}>
            <p className={css.name}>{username}</p>
            <p className={css.email}>{email}</p>
          </div>
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={css.avatarField}>
            <span className={css.fieldLabel}>Avatar</span>
            <label htmlFor="avatar" className={css.fileButton}>
              Upload image
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className={css.fileInput}
              onChange={handleAvatarChange}
            />
            <p className={css.fileHint}>PNG, JPG, GIF or WebP, up to 2 MB.</p>
            {avatarFileName && (
              <p className={css.fileName}>{avatarFileName}</p>
            )}
            {avatarError && <p className={css.error}>{avatarError}</p>}
          </div>

          <div className={css.emailRow}>
            <span className={css.infoLabel}>Email</span>
            <span className={css.infoValue}>{email}</span>
          </div>

          <div className={css.actions}>
            {submitError && <p className={css.error}>{submitError}</p>}
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSaving || Boolean(avatarError)}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
