import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "@/components/ConditionalFooter";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import CartDrawer from "@/components/CartDrawer";
import { getSession } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOCTURNE — Contemporary Luxury & Curated Goods",
  description: "Explore curated collections of luxury footwear, apparel, and bespoke accessories.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-obsidian text-parchment antialiased selection:bg-accent selection:text-obsidian"
      >
        <ConditionalNavbar user={session} />
        <main className="flex-1 w-full">{children}</main>
        <CartDrawer />
        <ConditionalFooter />
      </body>
    </html>
  );
}