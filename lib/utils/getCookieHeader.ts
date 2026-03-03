import { cookies } from "next/headers";

export default async function getCookieHeader(): Promise<string> {
  return (await cookies()).toString();
}