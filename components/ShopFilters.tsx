"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, FormEvent, Suspense } from "react";
import { Check, SlidersHorizontal, RotateCcw, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_HIERARCHY = [
  "All",
  "Apparel",
  "Footwear",
  "Bags",
  "Jewelry",
  "Glasses",
  "Belts & Ties",
  "Caps & Headwear",
  "Makeup",
  "Skincare",
  "Fragrances",
];

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "latest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

interface ShopFiltersProps {
  categories: string[];
}

function ShopFiltersContent({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = searchParams.get("category") || "All";
  const currentSort = searchParams.get("sort") || "latest";
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

  // Sync state with URL if search parameters change
  useEffect(() => {
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  // Click outside listener to close the sort dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // Order categories according to predefined hierarchy
  const orderedCategories = CATEGORY_HIERARCHY.filter(
    (cat) => cat === "All" || categories.includes(cat)
  );
  categories.forEach((cat) => {
    if (!orderedCategories.includes(cat)) {
      orderedCategories.push(cat);
    }
  });

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
    setMobileOpen(false);
    setSortDropdownOpen(false);
  };

  const applyPriceFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    const cleanMin = minPrice.trim();
    const cleanMax = maxPrice.trim();

    if (cleanMin && !isNaN(Number(cleanMin)) && Number(cleanMin) >= 0) {
      params.set("min", cleanMin);
    } else {
      params.delete("min");
    }

    if (cleanMax && !isNaN(Number(cleanMax)) && Number(cleanMax) >= 0) {
      params.set("max", cleanMax);
    } else {
      params.delete("max");
    }

    params.delete("page");
    router.push(`/shop?${params.toString()}`);
    setMobileOpen(false);
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/shop");
    setMobileOpen(false);
    setSortDropdownOpen(false);
  };

  const hasActiveFilters = Boolean(
    searchParams.get("category") ||
      (searchParams.get("sort") && searchParams.get("sort") !== "latest") ||
      searchParams.get("min") ||
      searchParams.get("max") ||
      searchParams.get("q")
  );

  const selectedSortOption =
    SORT_OPTIONS.find((s) => s.value === currentSort) || SORT_OPTIONS[0];

  const FilterContent = (
    <div className="space-y-6">
      {/* Category List */}
      <div>
        <p className="font-mono text-xs tracking-wider uppercase text-neutral-400 mb-2.5">
          Category
        </p>
        <div className="space-y-1">
          {orderedCategories.map((cat) => {
            const isSelected =
              cat === "All"
                ? !searchParams.get("category") || currentCategory === "All"
                : currentCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateFilter("category", cat === "All" ? null : cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-white/10 text-accent font-semibold border border-accent/30 shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                    : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check size={14} className="text-accent" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter in PKR */}
      <div>
        <p className="font-mono text-xs tracking-wider uppercase text-neutral-400 mb-2.5">
          Price Range (PKR)
        </p>
        <form onSubmit={applyPriceFilter} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min PKR"
              min="0"
              step="100"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-white/5 border border-obsidian-line text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent"
            />
            <span className="text-neutral-600 font-mono text-xs">–</span>
            <input
              type="number"
              placeholder="Max PKR"
              min="0"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-white/5 border border-obsidian-line text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full h-8 rounded-lg border border-obsidian-line bg-white/5 hover:border-accent hover:text-accent text-xs font-mono text-white transition-colors cursor-pointer"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Sort Filter as an Interactive Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <p className="font-mono text-xs tracking-wider uppercase text-neutral-400 mb-2.5">
          Sort By
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortDropdownOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-obsidian-line bg-obsidian-raised text-xs font-mono text-white hover:border-accent/40 focus:border-accent transition-all cursor-pointer shadow-sm"
            aria-haspopup="listbox"
            aria-expanded={sortDropdownOpen}
          >
            <span className="truncate text-accent font-medium">
              {selectedSortOption.label}
            </span>
            <ChevronDown
              size={14}
              className={`text-muted transition-transform duration-200 shrink-0 ml-2 ${
                sortDropdownOpen ? "rotate-180 text-accent" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {sortDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-xl border border-obsidian-line bg-obsidian-raised/95 backdrop-blur-md shadow-2xl z-30 space-y-1"
                role="listbox"
              >
                {SORT_OPTIONS.map((s) => {
                  const isSelected = currentSort === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() =>
                        updateFilter("sort", s.value === "latest" ? null : s.value)
                      }
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                        isSelected
                          ? "bg-white/10 text-accent font-semibold"
                          : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{s.label}</span>
                      {isSelected && <Check size={13} className="text-accent" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-obsidian-line bg-obsidian-raised text-xs font-mono text-white hover:border-accent transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={14} className="text-accent" />
          <span>Filters & Sort</span>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-accent" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-mono text-muted hover:text-accent cursor-pointer"
          >
            <RotateCcw size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-56 shrink-0 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-obsidian-line">
          <span className="flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-neutral-400">
            <SlidersHorizontal size={14} className="text-accent" /> Filters
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 font-mono text-[11px] text-muted hover:text-accent transition-colors cursor-pointer"
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}
        </div>
        {FilterContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-obsidian-raised border-r border-obsidian-line p-6 overflow-y-auto z-50 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-line">
                  <span className="flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-white font-semibold">
                    <SlidersHorizontal size={14} className="text-accent" /> Filters & Sort
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close filters"
                    className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {FilterContent}
              </div>

              {hasActiveFilters && (
                <div className="pt-6 mt-6 border-t border-obsidian-line">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-obsidian-line bg-white/5 text-xs font-mono text-muted hover:text-accent hover:border-accent transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} /> Reset All Filters
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ShopFilters({ categories }: ShopFiltersProps) {
  return (
    <Suspense
      fallback={
        <aside className="hidden md:block w-56 shrink-0 h-96 rounded-2xl bg-white/[0.02] border border-obsidian-line animate-pulse" />
      }
    >
      <ShopFiltersContent categories={categories} />
    </Suspense>
  );
}