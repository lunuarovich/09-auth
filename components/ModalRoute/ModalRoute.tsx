"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";

export default function ModalRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  return <Modal onClose={() => router.back()}>{children}</Modal>;
}