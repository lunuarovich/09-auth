import { cookies } from "next/headers";

export default function getCookieHeader(): string {
  return cookies()
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}