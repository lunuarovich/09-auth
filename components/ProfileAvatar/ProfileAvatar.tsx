"use client";

import { useCallback, useSyncExternalStore } from "react";
import Image from "next/image";

import getAvatarSrc from "@/lib/utils/getAvatarSrc";
import { getStoredAvatar } from "@/lib/utils/avatarStorage";

type ProfileAvatarProps = {
  email: string;
  avatar: string;
  className: string;
};

export default function ProfileAvatar({
  email,
  avatar,
  className,
}: ProfileAvatarProps) {
  const subscribe = useCallback(() => {
    return () => {};
  }, []);

  const getSnapshot = useCallback(() => {
    return getAvatarSrc(getStoredAvatar(email) ?? avatar);
  }, [avatar, email]);

  const getServerSnapshot = useCallback(() => {
    return getAvatarSrc(avatar);
  }, [avatar]);

  const src = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Image
      src={src}
      alt="User Avatar"
      width={128}
      height={128}
      className={className}
      unoptimized={src.startsWith("data:image/")}
    />
  );
}
