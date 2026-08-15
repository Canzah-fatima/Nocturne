"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function BentoGrid({ products }: { products: Product[] }) {
  // Take top 4 items for a balanced showcase section
  const featuredProducts = (products || []).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 md:mt-24">
      {/* Header Bar */}
      <div className="flex items-end justify-between mb-6 sm:mb-8 border-b border-obsidian-line pb-4 sm:pb-5 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-accent uppercase mb-1">
            <Sparkles size={13} className="shrink-0" />
            <span>Curated Selection</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white">
            This week&apos;s edit
          </h2>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono text-muted hover:text-accent transition-colors group shrink-0"
        >
          <span>VIEW CATALOG</span>
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      {/* Structured High-Contrast Grid: 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
        {featuredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="h-full"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}