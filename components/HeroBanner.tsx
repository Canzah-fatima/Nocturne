"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const BRAND_LIST = [
  "DIOR",
  "YVES SAINT LAURENT",
  "NIKE",
  "RALPH LAUREN",
  "CHARLOTTE TILBURY",
  "NEW BALANCE",
];

const CATEGORIES = [
  { label: "Apparel", href: "/shop?category=Apparel" },
  { label: "Footwear", href: "/shop?category=Footwear" },
  { label: "Beauty", href: "/shop?category=Skincare%20%26%20Beauty" },
  { label: "Fragrances", href: "/shop?category=Fragrances" },
  { label: "Jewelry", href: "/shop?category=Jewelry" },
];

export default function HeroBanner() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-10 md:pt-16 pb-4 sm:pb-6">
      {/* Editorial Hero Container */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-5 sm:p-10 md:p-14 lg:p-16 overflow-hidden">
        {/* Architectural Background Grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:2rem_2rem] md:bg-[size:2.5rem_2.5rem]"
        />

        {/* Ambient Radial Lighting */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-24 sm:-top-40 right-0 sm:right-1/4 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-white/[0.02] blur-3xl z-0" 
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center lg:items-end">
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left">
            <div className="space-y-2.5 sm:space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted block"
              >
                Autumn / Winter 2026
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.08] sm:leading-[1.05]"
              >
                Curated form.
                <br />
                <span className="font-normal italic text-muted/90 font-serif">
                  Timeless substance.
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-xl text-xs sm:text-sm md:text-base text-muted/80 leading-relaxed font-light"
            >
              An exacting edit of designer garments, luxury fragrances, and pure beauty formulations. 
              Authenticity guaranteed on every piece.
            </motion.p>

            {/* Clean Category Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 pt-1 font-mono text-[11px] sm:text-xs"
            >
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="text-muted/70 hover:text-white transition-colors duration-200"
                >
                  {cat.label}
                </Link>
              ))}
            </motion.div>

            {/* Primary Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="pt-2 sm:pt-3"
            >
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 sm:px-7 py-3.5 text-xs font-mono font-medium text-black transition-all duration-300 hover:bg-white/90 hover:gap-4 active:scale-[0.98]"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Editorial Image Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 w-full flex justify-center lg:justify-end"
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full max-w-xs sm:max-w-sm overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85"
                alt="Editorial Lookbook"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 380px, 400px"
                className="object-cover grayscale contrast-125 opacity-90 transition-all duration-700 hover:scale-105 hover:grayscale-0"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-5 sm:left-5 sm:right-5 flex justify-between items-end">
                <div>
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted block">
                    Nocturne Studio
                  </span>
                  <span className="text-xs sm:text-sm font-light text-white">
                    Edition Nº 04
                  </span>
                </div>
                <span className="font-mono text-[10px] sm:text-xs text-muted/60">
                  2026
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive Brand Ledger */}
      <div className="mt-5 sm:mt-8 border-b border-white/5 pb-3.5 sm:pb-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[500px] sm:min-w-0 gap-6 sm:gap-4 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.2em] text-muted/40 uppercase whitespace-nowrap">
          {BRAND_LIST.map((brand) => (
            <span key={brand} className="hover:text-muted/80 transition-colors">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}