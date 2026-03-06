"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";

import Loader from "@/components/Loader/Loader";

function isPrivatePath(pathname: string) {
  return pathname.startsWith("/profile") || pathname.startsWith("/notes");
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function run() {
      setIsLoading(true);
      try {
        const session = await checkSession();
        if (!session.success) {
          if (isPrivatePath(pathname)) {
            await logout().catch(() => {});
            clearIsAuthenticated();
            router.replace("/sign-in");
          } else {
            clearIsAuthenticated();
          }
          return;
        }

        const me = await getMe();
        setUser(me);
      } catch {
        clearIsAuthenticated();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    run();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isLoading) return <Loader />;

  return children;
}
