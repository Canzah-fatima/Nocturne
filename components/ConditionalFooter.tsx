"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // ONLY render Footer if the user is directly on the Home page ("/")
  if (pathname !== "/") {
    return null;
  }

  return <Footer />;
}