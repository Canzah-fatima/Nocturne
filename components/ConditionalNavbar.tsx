// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "@/components/Navbar";

// export default function ConditionalNavbar({ user }: { user: any }) {
//   const pathname = usePathname();
//   if (["/login", "/register", "/auth/callback"].includes(pathname)) return null;
//   return <Navbar user={user} />;
// }



"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar({ user }: { user: any }) {
  const pathname = usePathname();

  // ONLY render Navbar if the user is directly on the Home page ("/")
  if (pathname !== "/") {
    return null;
  }

  return <Navbar user={user} />;
}