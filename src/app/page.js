import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

export default function RootPage() {
  // This redirects localhost:3000 to localhost:3000/en (or your default)
  redirect(`/${defaultLocale}`);
}
