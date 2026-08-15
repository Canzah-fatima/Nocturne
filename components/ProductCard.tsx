"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, productImage } from "@/lib/format";
import Rating from "@/components/Rating";
import QuickAddModal from "@/components/QuickAddModal";
import { useState, MouseEvent } from "react";

export default function ProductCard({ product }: { product: Product }) {
  if (!product) return null;

  const [primary, secondary] = product.images || [];
  const [modalOpen, setModalOpen] = useState(false);

  const productUrl = `/product/${product.id}`;
  const outOfStock =
    product.stockCount !== null &&
    product.stockCount !== undefined &&
    product.stockCount <= 0;
  const hasSizes = Boolean(
    product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
  );

  const handleOpenModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex flex-col h-full w-full"
      >
        <Link
          href={productUrl}
          className="flex flex-col h-full rounded-xl sm:rounded-2xl overflow-hidden bg-obsidian-raised border border-obsidian-line transition-all duration-300 group-hover:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent outline-none cursor-pointer"
        >
          {/* Image Frame */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-obsidian-line shrink-0">
            {product.badge && (
              <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
                <span className="rounded-full bg-obsidian/85 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-accent border border-accent/30 shadow-md">
                  {product.badge}
                </span>
              </div>
            )}

            {primary ? (
              <Image
                src={productImage(primary, 640, 800)}
                alt={product.title || "Product"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-mono text-muted">
                No Image
              </div>
            )}

            {secondary && (
              <Image
                src={productImage(secondary, 640, 800)}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="hidden sm:block object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 absolute inset-0"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Quick Action Button */}
            <div className="absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-3 z-20 translate-y-0 sm:translate-y-4 opacity-100 sm:opacity-0 transition-all duration-300 ease-out sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
              <button
                type="button"
                onClick={handleOpenModal}
                disabled={outOfStock}
                className={`w-full flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl py-1.5 sm:py-2.5 px-2 text-[10px] sm:text-xs font-medium font-mono transition-all duration-200 backdrop-blur-md border ${
                  outOfStock
                    ? "bg-obsidian/60 text-muted border-white/5 cursor-not-allowed"
                    : "bg-obsidian/90 text-parchment border-white/10 hover:bg-accent hover:text-obsidian hover:border-accent cursor-pointer"
                }`}
              >
                <ShoppingBag size={13} className="shrink-0" />
                <span>{hasSizes ? "Select Size" : "Quick Add"}</span>
              </button>
            </div>
          </div>

          {/* Card Info */}
          <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1 space-y-1">
            <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono uppercase tracking-wider text-muted">
              <span className="truncate pr-1">{product.category}</span>
              <span className="font-bold text-accent shrink-0 text-[10px] sm:text-xs">
                {formatPrice(product.price)}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-medium text-white leading-snug line-clamp-1 group-hover:text-accent transition-colors duration-200">
              {product.title}
            </h3>

            <div className="pt-0.5 scale-90 origin-left sm:scale-100">
              <Rating
                value={product.rating || 0}
                count={product.reviewCount || 0}
              />
            </div>
          </div>
        </Link>
      </motion.div>

      <QuickAddModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}