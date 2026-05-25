const FALLBACK_AVATAR_URL =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export default function getAvatarSrc(value?: string | null) {
  const src = value?.trim();

  if (!src) {
    return FALLBACK_AVATAR_URL;
  }

  if (
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("data:image/")
  ) {
    return src;
  }

  return FALLBACK_AVATAR_URL;
}

export { FALLBACK_AVATAR_URL };
