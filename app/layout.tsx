import "modern-normalize/modern-normalize.css";
import "@/app/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const OG_IMAGE_URL =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NoteHub",
    template: "%s | NoteHub",
  },
  description: "NoteHub — a simple notes manager built with Next.js.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NoteHub",
    description: "NoteHub — a simple notes manager built with Next.js.",
    url: "/",
    images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
