"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, productImage } from "@/lib/format";
import { useCart } from "@/store/cart";
import Rating from "@/components/Rating";
import { Accordion } from "@/components/Accordion";

export default function ProductDetail({ product }: { product?: Product }) {
  if (!product) return null;

  const hasSizes = Boolean(
    product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
  );
  const isFootwear = product.category?.toLowerCase() === "footwear";
  const sizeHeading = isFootwear ? "Shoe Size" : "Size";

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors?.[0] ?? "");
  const [size, setSize] = useState(hasSizes ? product.sizes?.[0] ?? "" : "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addItem = useCart((s) => s.addItem);
  const inStock = (product.stockCount ?? 0) > 0;
  const maxStock = product.stockCount ?? 99;

  useEffect(() => {
    const validSizes = Boolean(
      product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
    );
    setActiveImage(0);
    setColor(product.colors?.[0] ?? "");
    setSize(validSizes ? product.sizes?.[0] ?? "" : "");
    setQuantity(1);
  }, [product.id, product.colors, product.sizes]);

  function handleAddToCart() {
    if (!product || !inStock) return;

    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }

    addItem(
      {
        productId: product.id,
        title: product.title,
        price: Math.round(product.price),
        image: product.images?.[activeImage] ?? product.images?.[0] ?? "",
        color: color || undefined,
        size: hasSizes && size ? size : undefined,
        stockCount: maxStock,
      },
      quantity
    );

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setJustAdded(true);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1600);
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-100 antialiased">
      {/* Navigation Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400 hover:text-cyan-400 transition-colors duration-200 group cursor-pointer"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          <span>Back to Collection</span>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* ======================================================== */}
          {/* LEFT: Compact Main Stage & Horizontal Strip (MD: 6 COLS) */}
          {/* ======================================================== */}
          <div className="md:col-span-6 space-y-3">
            {/* Main Stage Image (Locked to original proportions) */}
            <div className="relative aspect-[4/5] max-h-[420px] sm:max-h-[520px] max-w-[440px] w-full mx-auto rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-xl">
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-full bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-cyan-400 border border-cyan-400/40">
                    {product.badge}
                  </span>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={productImage(galleryImages[activeImage], 800, 1000)}
                    alt={product.title}
                    fill
                    priority
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Horizontal Thumbnails Strip Below Main Image */}
            {galleryImages.length > 1 && (
              <div
                className="flex gap-2 overflow-x-auto pb-1 max-w-[440px] mx-auto scrollbar-none"
                role="tablist"
              >
                {galleryImages.map((img, i) => {
                  const isActive = activeImage === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveImage(i)}
                      className={`relative h-14 w-12 sm:h-16 sm:w-14 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border-2 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "border-cyan-400 ring-2 ring-cyan-400/30"
                          : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                      }`}
                    >
                      <Image
                        src={productImage(img, 120, 150)}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT: Typography, Sizing Matrix & Actions (MD: 6 COLS)  */}
          {/* ======================================================== */}
          <div className="md:col-span-6 space-y-5">
            {/* Header / Meta */}
            <div className="space-y-2.5 pb-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.25em] uppercase text-cyan-400 font-semibold">
                  {product.category}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  {inStock ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-rose-400">Sold Out</span>
                  )}
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Rating Proof */}
              <div className="flex items-center gap-2 pt-0.5">
                <Rating
                  value={product.rating || 0}
                  count={product.reviewCount || 0}
                />
                <span className="text-xs text-neutral-400 font-mono">
                  · {product.reviewCount || 0} verified customer ratings
                </span>
              </div>

              {/* Price */}
              <div className="pt-1">
                <p className="font-mono text-2xl sm:text-3xl font-bold text-cyan-400 tracking-tight">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            {/* Product Summary */}
            {product.description && (
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {product.description}
              </p>
            )}

            {/* Colors (if present) */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                  Color: <span className="text-white font-medium">{color}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-9 px-3.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        color === c
                          ? "bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                          : "bg-white/[0.03] border border-white/10 text-neutral-300 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizing Grid */}
            {hasSizes && product.sizes && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="uppercase tracking-wider text-neutral-400">
                    {sizeHeading}:{" "}
                    <span className="text-white font-medium">{size}</span>
                  </span>
                  {isFootwear && (
                    <span className="text-[10px] tracking-widest text-neutral-500 uppercase">
                      Standard US Sizing
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = size === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`min-w-[60px] h-10 px-3 rounded-xl font-mono text-xs font-medium transition-all duration-150 flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            : "bg-white/[0.03] border border-white/10 text-neutral-300 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center justify-between h-12 rounded-xl bg-white/[0.03] border border-white/10 px-3 w-28 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !inStock}
                    className="h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-mono text-xs font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(maxStock, q + 1))
                    }
                    disabled={quantity >= maxStock || !inStock}
                    className="h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Full-Height Primary Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 h-12 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    !inStock
                      ? "bg-white/5 text-neutral-500 border border-white/5 cursor-not-allowed"
                      : justAdded
                      ? "bg-emerald-400 text-black shadow-emerald-400/20"
                      : "bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_25px_rgba(34,211,238,0.25)] active:scale-[0.99]"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check size={16} className="stroke-[2.5]" />
                      <span>Added to Bag</span>
                    </>
                  ) : inStock ? (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add to Bag</span>
                    </>
                  ) : (
                    <span>Sold Out</span>
                  )}
                </button>
              </div>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-white/10 text-center text-[10px] sm:text-[11px] font-mono text-neutral-400">
              <div className="flex flex-col items-center gap-1">
                <Truck size={14} className="text-cyan-400" />
                <span className="leading-tight">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-white/10 px-1">
                <ShieldCheck size={14} className="text-cyan-400" />
                <span className="leading-tight">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={14} className="text-cyan-400" />
                <span className="leading-tight">Easy Returns</span>
              </div>
            </div>

            {/* Collapsible Accordions */}
            <div className="pt-1">
              <Accordion
                items={[
                  {
                    title: "Specifications & Details",
                    content: `${
                      product.title
                    } is made with premium materials. Available in ${
                      product.colors?.join(", ") ?? "standard colorways"
                    }.`,
                  },
                  {
                    title: "Shipping & Delivery",
                    content:
                      "Complimentary shipping across Pakistan on orders over PKR 5,000. Typical transit time is 2–4 business days.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}