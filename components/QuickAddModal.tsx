// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Check, ShoppingBag, ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";
// import type { Product } from "@/lib/types";
// import { formatPrice, productImage } from "@/lib/format";
// import { useCart } from "@/store/cart";
// import Rating from "@/components/Rating";

// interface QuickAddModalProps {
//   product: Product | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function QuickAddModal({ product, isOpen, onClose }: QuickAddModalProps) {
//   const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
//   const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
//   const [isAdded, setIsAdded] = useState(false);
//   const addItem = useCart((state) => state.addItem);

//   const hasSizes = Boolean(
//     product?.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
//   );
//   const isFootwear = product?.category?.toLowerCase() === "footwear";
//   const sizeHeading = isFootwear ? "Select Shoe Size" : "Select Size";
//   const outOfStock =
//     product?.stockCount !== null &&
//     product?.stockCount !== undefined &&
//     product?.stockCount <= 0;

//   useEffect(() => {
//     if (product) {
//       setSelectedSize(hasSizes ? product.sizes?.[0] : undefined);
//       setSelectedColor(product.colors?.[0] || undefined);
//       setIsAdded(false);
//     }
//   }, [product, hasSizes]);

//   // Lock body scroll when modal is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   if (!product) return null;

//   const handleAdd = () => {
//     if (outOfStock) return;

//     if (typeof window !== "undefined" && window.navigator?.vibrate) {
//       window.navigator.vibrate(50);
//     }

//     addItem({
//       productId: product.id,
//       title: product.title,
//       price: Math.round(product.price),
//       image: product.images?.[0] ? productImage(product.images[0], 640, 800) : "",
//       size: hasSizes ? selectedSize : undefined,
//       color: selectedColor,
//       stockCount: product.stockCount ?? 99,
//     });

//     setIsAdded(true);
//     setTimeout(() => {
//       setIsAdded(false);
//       onClose();
//     }, 1100);
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
//           {/* Ambient Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.25 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/80 backdrop-blur-md"
//           />

//           {/* Luxury Modal Container */}
//           <motion.div
//             initial={{ opacity: 0, y: 24, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 24, scale: 0.98 }}
//             transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//             className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] border border-white/10 bg-[#0c0c0e]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_32px_96px_-12px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)] z-10 text-neutral-200 scrollbar-none antialiased"
//           >
//             {/* Subtle Top Specular Glow */}
//             <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-32 bg-accent/15 blur-[60px] rounded-full" />

//             {/* Mobile Sheet Drag Handle */}
//             <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4 sm:hidden" />

//             {/* Close Button */}
//             <button
//               type="button"
//               onClick={onClose}
//               className="absolute top-5 right-5 z-20 text-neutral-400 hover:text-white p-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer group active:scale-95"
//               aria-label="Close modal"
//             >
//               <X size={15} className="transition-transform group-hover:rotate-90 duration-200" />
//             </button>

//             {/* Product Header Showcase */}
//             <div className="flex gap-4 sm:gap-6 items-start relative">
//               <div className="relative aspect-[4/5] w-24 sm:w-28 shrink-0 rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/10 shadow-2xl group ring-1 ring-white/5">
//                 {product.badge && (
//                   <div className="absolute top-2 left-2 z-10">
//                     <span className="inline-flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase text-accent border border-accent/30 shadow-sm">
//                       <Sparkles size={8} className="text-accent" />
//                       {product.badge}
//                     </span>
//                   </div>
//                 )}

//                 {product.images?.[0] ? (
//                   <Image
//                     src={productImage(product.images[0], 280, 350)}
//                     alt={product.title}
//                     fill
//                     sizes="112px"
//                     className="object-cover transition-transform duration-500 group-hover:scale-105"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center text-[10px] font-mono text-neutral-500">
//                     No Image
//                   </div>
//                 )}
//               </div>

//               <div className="flex-1 min-w-0 pr-6 space-y-1.5">
//                 <div className="flex items-center gap-2">
//                   <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-accent font-semibold">
//                     {product.category}
//                   </span>
//                   <span className="text-white/20 font-mono text-xs">/</span>
//                   <span className={`text-[10px] font-mono uppercase tracking-wider ${outOfStock ? "text-rose-400/80" : "text-neutral-400"}`}>
//                     {outOfStock ? "Sold Out" : "In Stock"}
//                   </span>
//                 </div>

//                 <h3 className="font-display text-lg font-medium text-white leading-snug line-clamp-2 tracking-tight">
//                   {product.title}
//                 </h3>

//                 <div className="pt-0.5">
//                   <Rating value={product.rating || 0} count={product.reviewCount || 0} />
//                 </div>

//                 <div className="pt-1">
//                   <p className="font-mono text-xl font-bold tracking-tight text-accent">
//                     {formatPrice(product.price)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Gradient Hairline Divider */}
//             <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-5" />

//             {/* Color Palette Section */}
//             {product.colors && product.colors.length > 0 && (
//               <div className="space-y-2.5">
//                 <div className="flex items-center justify-between text-xs font-mono">
//                   <span className="uppercase tracking-widest text-neutral-400">Color</span>
//                   <span className="text-white font-medium capitalize bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/5">
//                     {selectedColor}
//                   </span>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {product.colors.map((col) => {
//                     const isActive = selectedColor === col;
//                     return (
//                       <button
//                         key={col}
//                         type="button"
//                         onClick={() => setSelectedColor(col)}
//                         className={`h-9 px-4 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
//                           isActive
//                             ? "bg-accent text-obsidian font-bold shadow-[0_0_20px_rgba(0,240,255,0.35)] ring-1 ring-accent scale-[1.02]"
//                             : "bg-white/[0.03] border border-white/10 text-neutral-300 hover:border-white/25 hover:text-white hover:bg-white/[0.06] active:scale-[0.98]"
//                         }`}
//                       >
//                         {col}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Sizing Grid Section */}
//             {hasSizes && product.sizes && (
//               <div className="mt-5 space-y-2.5">
//                 <div className="flex items-center justify-between text-xs font-mono">
//                   <span className="uppercase tracking-widest text-neutral-400">{sizeHeading}</span>
//                   {isFootwear && (
//                     <span className="text-[10px] tracking-widest text-neutral-500 uppercase">
//                       Standard US
//                     </span>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
//                   {product.sizes.map((sz) => {
//                     const isSelected = selectedSize === sz;
//                     return (
//                       <button
//                         key={sz}
//                         type="button"
//                         onClick={() => setSelectedSize(sz)}
//                         className={`h-11 rounded-xl font-mono text-xs transition-all duration-200 cursor-pointer flex items-center justify-center ${
//                           isSelected
//                             ? "bg-accent text-obsidian font-bold shadow-[0_0_20px_rgba(0,240,255,0.35)] ring-1 ring-accent scale-[1.02]"
//                             : "bg-white/[0.03] border border-white/10 text-neutral-300 hover:border-white/25 hover:text-white hover:bg-white/[0.06] active:scale-[0.98]"
//                         }`}
//                       >
//                         {sz}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Trust Micro-Pill */}
//             <div className="mt-5 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-neutral-400">
//               <ShieldCheck size={14} className="text-accent shrink-0" />
//               <span>Complimentary insured shipping on all orders</span>
//             </div>

//             {/* Action Bar */}
//             <div className="mt-6 space-y-3">
//               <button
//                 type="button"
//                 onClick={handleAdd}
//                 disabled={outOfStock}
//                 className={`w-full h-12 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer select-none ${
//                   outOfStock
//                     ? "bg-white/5 text-neutral-500 border border-white/5 cursor-not-allowed"
//                     : isAdded
//                     ? "bg-emerald-400 text-obsidian shadow-[0_0_25px_rgba(52,211,153,0.4)]"
//                     : "bg-accent hover:bg-accent/90 text-obsidian shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.45)] active:scale-[0.99]"
//                 }`}
//               >
//                 {outOfStock ? (
//                   "Sold Out"
//                 ) : isAdded ? (
//                   <>
//                     <Check size={16} className="stroke-[2.5]" />
//                     <span>Added to Bag</span>
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingBag size={16} />
//                     <span>Add to Bag</span>
//                   </>
//                 )}
//               </button>

//               <Link
//                 href={`/product/${product.id}`}
//                 onClick={onClose}
//                 className="w-full py-2 inline-flex items-center justify-center gap-1.5 font-mono text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer group"
//               >
//                 <span>View Complete Specifications</span>
//                 <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// }





"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShoppingBag, ArrowUpRight, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, productImage } from "@/lib/format";
import { useCart } from "@/store/cart";
import Rating from "@/components/Rating";

interface QuickAddModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ product, isOpen, onClose }: QuickAddModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const hasSizes = Boolean(
    product?.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
  );
  const isFootwear = product?.category?.toLowerCase() === "footwear";
  const sizeHeading = isFootwear ? "Shoe Size" : "Size";
  const outOfStock =
    product?.stockCount !== null &&
    product?.stockCount !== undefined &&
    product?.stockCount <= 0;

  useEffect(() => {
    if (product) {
      setSelectedSize(hasSizes ? product.sizes?.[0] : undefined);
      setSelectedColor(product.colors?.[0] || undefined);
      setActiveImageIndex(0);
      setIsAdded(false);
    }
  }, [product, hasSizes]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!product) return null;

  const handleAdd = () => {
    if (outOfStock) return;

    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }

    addItem({
      productId: product.id,
      title: product.title,
      price: Math.round(product.price),
      image:
        product.images?.[activeImageIndex] || product.images?.[0]
          ? productImage(product.images[activeImageIndex] || product.images[0], 640, 800)
          : "",
      size: hasSizes ? selectedSize : undefined,
      color: selectedColor,
      stockCount: product.stockCount ?? 99,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1100);
  };

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 md:p-6">
          {/* Smooth Frosted Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Responsive Aesthetic Poster Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[375px] sm:max-w-[400px] h-[85vh] max-h-[720px] min-h-[520px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0e1014] text-white flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-10 select-none antialiased"
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
              {images.length > 0 ? (
                <Image
                  src={productImage(images[activeImageIndex], 800, 1200)}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full bg-[#121316] flex items-center justify-center font-mono text-xs text-neutral-500">
                  No Image Available
                </div>
              )}

              {/* Seamless Scrim Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-[#090a0d]/85 via-55% to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent h-28" />
            </div>

            {/* Top Floating Controls */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer group active:scale-90"
                aria-label="Close modal"
              >
                <X size={15} className="transition-transform group-hover:rotate-90 duration-200" />
              </button>

              <div className="flex items-center gap-2">
                {product.badge ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-accent/40 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase text-accent font-semibold">
                    <Sparkles size={8} className="text-accent" />
                    {product.badge}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-300 font-medium">
                    {product.category}
                  </span>
                )}
              </div>
            </div>

            {/* Pagination Indicators */}
            {images.length > 1 && (
              <div className="relative z-10 flex items-center justify-center gap-1.5 my-auto">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeImageIndex === i
                        ? "w-5 h-1 bg-accent"
                        : "w-1 h-1 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Bottom Content Area */}
            <div className="relative z-10 p-4 sm:p-6 pt-0 space-y-3 sm:space-y-3.5 overflow-y-auto scrollbar-none">
              {/* Title & Price */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold block">
                    {product.category}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug tracking-tight line-clamp-2">
                    {product.title}
                  </h3>
                </div>

                <div className="shrink-0 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-accent font-mono text-sm sm:text-base font-bold">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Rating & Availability */}
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center">
                  <Rating value={product.rating || 0} count={product.reviewCount || 0} />
                </div>
                <span
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider ${
                    outOfStock ? "text-rose-400" : "text-neutral-300"
                  }`}
                >
                  {outOfStock
                    ? "0 Left"
                    : product.stockCount
                    ? `${product.stockCount} Left`
                    : "In Stock"}
                </span>
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-400">
                    <span>Color</span>
                    <span className="text-white capitalize">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((col) => {
                      const isActive = selectedColor === col;
                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setSelectedColor(col)}
                          className={`h-6 sm:h-7 px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer ${
                            isActive
                              ? "bg-accent text-obsidian font-bold ring-1 ring-accent"
                              : "bg-black/40 backdrop-blur-sm border border-white/15 text-neutral-300 hover:text-white hover:border-white/30"
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {hasSizes && product.sizes && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-400">
                    <span>{sizeHeading}</span>
                    <span className="text-white font-mono">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`h-7 sm:h-8 min-w-[34px] sm:min-w-[38px] px-2 sm:px-2.5 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? "bg-accent text-obsidian font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                              : "bg-black/40 backdrop-blur-sm border border-white/15 text-neutral-300 hover:text-white hover:border-white/30"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 sm:pt-2 space-y-1.5">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className={`w-full h-11 sm:h-12 rounded-full font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    outOfStock
                      ? "bg-white/10 text-neutral-500 border border-white/10 cursor-not-allowed"
                      : isAdded
                      ? "bg-emerald-400 text-obsidian"
                      : "bg-accent hover:bg-accent/90 text-obsidian active:scale-[0.98]"
                  }`}
                >
                  {outOfStock ? (
                    "Sold Out"
                  ) : isAdded ? (
                    <>
                      <Check size={15} className="stroke-[2.5]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="w-full py-1 inline-flex items-center justify-center gap-1 font-mono text-[10px] sm:text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer group"
                >
                  <span>View Full Details</span>
                  <ArrowUpRight
                    size={11}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}