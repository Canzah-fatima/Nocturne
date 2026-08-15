"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, useCartHydrated } from "@/store/cart";
import { supabase } from "@/lib/supabase";
import type { PublicUser } from "@/lib/types";

function NavbarContent({ user: initialUser }: { user: PublicUser | null }) {
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const openCart = useCart((s) => s.openCart);
  const isHydrated = useCartHydrated();
  const rawCount = useCart((s) => s.count?.() ?? 0);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
          role: (session.user.user_metadata?.role as any) || "CUSTOMER",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  const count = isHydrated ? rawCount : 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  }

  // Active status helpers
  const isAccessoriesActive = [
    "Jewelry",
    "Bags",
    "Glasses",
    "Caps & Headwear",
    "Belts & Ties",
  ].includes(activeCategory);

  const isBeautyActive = ["Makeup", "Skincare"].includes(activeCategory);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`mx-auto max-w-6xl rounded-3xl sm:rounded-full border border-obsidian-line/80 bg-obsidian/80 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_30px_rgba(0,0,0,0.5)]" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 md:px-6">
          {/* Brand Logo */}
          <Link
            href="/"
            className="font-display text-base sm:text-lg font-semibold tracking-tight shrink-0 text-white hover:text-accent transition-colors"
          >
            NOCTURNE
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 ml-2">
            <Link
              href="/shop?category=Apparel"
              className={`px-3 py-1.5 text-xs sm:text-sm font-mono rounded-full transition-colors ${
                activeCategory === "Apparel"
                  ? "text-accent bg-white/5 font-semibold"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              Apparel
            </Link>

            <Link
              href="/shop?category=Footwear"
              className={`px-3 py-1.5 text-xs sm:text-sm font-mono rounded-full transition-colors ${
                activeCategory === "Footwear"
                  ? "text-accent bg-white/5 font-semibold"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              Footwear
            </Link>

            {/* Accessories Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-mono rounded-full transition-colors group-hover:text-white cursor-pointer ${
                  isAccessoriesActive ? "text-accent font-semibold" : "text-muted"
                }`}
              >
                Accessories <ChevronDown size={13} className="transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl border border-obsidian-line bg-obsidian-raised/95 backdrop-blur-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl z-50">
                <Link
                  href="/shop?category=Jewelry"
                  className={`block px-4 py-2 text-xs font-mono transition-colors hover:bg-white/5 ${
                    activeCategory === "Jewelry" ? "text-accent font-semibold" : "text-muted hover:text-white"
                  }`}
                >
                  Jewelry
                </Link>
                <Link
                  href="/shop?category=Bags"
                  className={`block px-4 py-2 text-xs font-mono transition-colors hover:bg-white/5 ${
                    activeCategory === "Bags" ? "text-accent font-semibold" : "text-muted hover:text-white"
                  }`}
                >
                  Bags
                </Link>
                <Link
                  href="/shop?category=Glasses"
                  className={`block px-4 py-2 text-xs font-mono transition-colors hover:bg-white/5 ${
                    activeCategory === "Glasses" ? "text-accent font-semibold" : "text-muted hover:text-white"
                  }`}
                >
                  Glasses
                </Link>
                <Link
                  href="/shop?category=Belts%20%26%20Ties"
                  className={`block px-4 py-2 text-xs font-mono transition-colors hover:bg-white/5 ${
                    activeCategory === "Belts & Ties" ? "text-accent font-semibold" : "text-muted hover:text-white"
                  }`}
                >
                  Belts & Ties
                </Link>
                <Link
                  href="/shop?category=Caps%20%26%20Headwear"
                  className={`block px-4 py-2 text-xs font-mono transition-colors hover:bg-white/5 ${
                    activeCategory === "Caps & Headwear" ? "text-accent font-semibold" : "text-muted hover:text-white"
                  }`}
                >
                  Caps & Headwear
                </Link>
              </div>
            </div>

            {/* Beauty Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-mono rounded-full transition-colors group-hover:text-white cursor-pointer ${
                  isBeautyActive ? "text-accent font-semibold" : "text-muted"
                }`}
              >
                Beauty <ChevronDown size={13} className="transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-36 rounded-2xl border border-obsidian-line bg-obsidian-raised/95 backdrop-blur-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl z-50">
                <Link
                  href="/shop?category=Makeup"
                  className={`block px-4 py-2 text-xs font-mono transition-colors hover:bg-white/5 ${
                    activeCategory === "Makeup" ? "text-accent font-semibold" : "text-muted hover:text-white"
                  }`}
                >
                  Makeup
                </Link>
                <Link
                  href="/shop?category=Skincare"
                  className={`block px-4 py-2 text-xs font-mono transition-colors hover:bg-white/5 ${
                    activeCategory === "Skincare" ? "text-accent font-semibold" : "text-muted hover:text-white"
                  }`}
                >
                  Skincare
                </Link>
              </div>
            </div>

            <Link
              href="/shop?category=Fragrances"
              className={`px-3 py-1.5 text-xs sm:text-sm font-mono rounded-full transition-colors ${
                activeCategory === "Fragrances"
                  ? "text-accent bg-white/5 font-semibold"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              Fragrances
            </Link>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden md:flex items-center flex-1 max-w-xs ml-auto rounded-full bg-white/5 border border-obsidian-line px-3 py-1.5 focus-within:border-accent/60 transition-colors"
          >
            <Search size={15} className="text-muted shrink-0" aria-hidden="true" />
            <label htmlFor="nav-search" className="sr-only">
              Search products
            </label>
            <input
              id="nav-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-xs sm:text-sm px-2 outline-none text-white placeholder:text-muted/70 font-mono"
            />
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:ml-2">
            <Link
              href={user ? "/profile" : "/login"}
              aria-label={user ? "View profile" : "Log in"}
              className="p-2 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-flex cursor-pointer"
            >
              <User size={18} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
              className="relative p-2 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ShoppingBag size={18} />
              {isHydrated && count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-mono font-bold text-obsidian"
                >
                  {count}
                </motion.span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="p-2 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors md:hidden cursor-pointer"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-obsidian-line px-4 pb-4 sm:px-5 sm:pb-5 max-h-[80vh] overflow-y-auto"
            >
              <form
                onSubmit={handleSearch}
                role="search"
                className="flex items-center gap-2 mt-3.5 rounded-full bg-white/5 border border-obsidian-line px-3 py-2"
              >
                <Search size={15} className="text-muted shrink-0" aria-hidden="true" />
                <label htmlFor="nav-search-mobile" className="sr-only">
                  Search products
                </label>
                <input
                  id="nav-search-mobile"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-xs sm:text-sm outline-none text-white placeholder:text-muted/70 font-mono"
                />
              </form>

              <nav aria-label="Mobile Product categories" className="flex flex-col mt-3 divide-y divide-obsidian-line/30">
                <Link
                  href="/shop?category=Apparel"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Apparel" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Apparel
                </Link>
                <Link
                  href="/shop?category=Footwear"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Footwear" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Footwear
                </Link>
                <Link
                  href="/shop?category=Jewelry"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Jewelry" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Jewelry
                </Link>
                <Link
                  href="/shop?category=Bags"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Bags" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Bags
                </Link>
                <Link
                  href="/shop?category=Glasses"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Glasses" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Glasses
                </Link>
                <Link
                  href="/shop?category=Belts%20%26%20Ties"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Belts & Ties" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Belts & Ties
                </Link>
                <Link
                  href="/shop?category=Caps%20%26%20Headwear"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Caps & Headwear" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Caps & Headwear
                </Link>
                <Link
                  href="/shop?category=Makeup"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Makeup" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Makeup
                </Link>
                <Link
                  href="/shop?category=Skincare"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Skincare" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Skincare
                </Link>
                <Link
                  href="/shop?category=Fragrances"
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs sm:text-sm font-mono ${
                    activeCategory === "Fragrances" ? "text-accent font-semibold" : "text-muted hover:text-accent"
                  }`}
                >
                  Fragrances
                </Link>
                <Link
                  href={user ? "/profile" : "/login"}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-xs sm:text-sm text-muted hover:text-accent font-mono"
                >
                  {user ? "Profile" : "Log in"}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}

export default function Navbar({ user }: { user: PublicUser | null }) {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
          <div className="mx-auto max-w-6xl h-14 rounded-3xl sm:rounded-full border border-obsidian-line/80 bg-obsidian/80 backdrop-blur-xl" />
        </header>
      }
    >
      <NavbarContent user={user} />
    </Suspense>
  );
}