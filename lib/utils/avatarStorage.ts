const AVATAR_STORAGE_PREFIX = "notehub:avatar:";

function getAvatarStorageKey(email: string) {
  return `${AVATAR_STORAGE_PREFIX}${email.toLowerCase()}`;
}

export function getStoredAvatar(email: string) {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(getAvatarStorageKey(email));
  } catch {
    return null;
  }
}

export function saveStoredAvatar(email: string, avatar: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(getAvatarStorageKey(email), avatar);
  } catch {
    throw new Error("Avatar could not be saved in this browser.");
  }
}
