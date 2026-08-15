"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, useCartHydrated } from "@/store/cart";
import { formatPrice, productImage } from "@/lib/format";

// PKR Pricing Constants matching backend rules
const TAX_RATE = 0.05;                   // 5% standard sales tax
const FLAT_SHIPPING_PKR = 250;           // PKR 250 delivery
const FREE_SHIPPING_THRESHOLD_PKR = 5000; // Free delivery over PKR 5,000

export default function CartDrawer() {
  const isHydrated = useCartHydrated();
  const { lines, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const subtotal = useCart((s) => s.subtotal());

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD_PKR
      ? 0
      : FLAT_SHIPPING_PKR;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD_PKR - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed top-0 right-0 h-dvh w-full sm:max-w-md z-50 bg-obsidian-raised border-l border-obsidian-line flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-obsidian-line shrink-0">
              <h2 className="font-display text-base sm:text-lg font-semibold flex items-center gap-2 text-white">
                <ShoppingBag size={18} className="text-accent" /> Your Bag
                {isHydrated && lines.length > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-muted">
                    {lines.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close bag"
                className="p-2 -mr-2 rounded-full hover:bg-white/5 text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {isHydrated && lines.length > 0 && (
              <div className="bg-obsidian/60 px-4 sm:px-6 py-2.5 border-b border-obsidian-line text-xs">
                {freeShippingRemaining > 0 ? (
                  <p className="text-muted">
                    Add <span className="font-mono text-accent font-semibold">{formatPrice(freeShippingRemaining)}</span> more for <span className="text-white font-medium">Free Delivery</span>
                  </p>
                ) : (
                  <p className="text-emerald-400 font-medium">
                    You have unlocked Free Standard Delivery!
                  </p>
                )}
              </div>
            )}

            {/* Cart Content */}
            {!isHydrated || lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-obsidian-line/40 flex items-center justify-center">
                  <ShoppingBag size={26} className="text-muted/60" />
                </div>
                <p className="text-white font-medium text-sm mt-1">Your bag is empty</p>
                <p className="text-muted text-xs max-w-[200px]">
                  Explore our catalog and find something tailored for you.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
                >
                  Browse catalog <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <>
                {/* Item List */}
                <ul className="flex-1 overflow-y-auto px-4 sm:px-6 divide-y divide-obsidian-line">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => {
                      const itemKey = `${line.productId}-${line.color || "default"}-${line.size || "default"}`;
                      const isMaxStock = Boolean(line.stockCount && line.quantity >= line.stockCount);

                      return (
                        <motion.li
                          key={itemKey}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, x: 40, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-3 sm:gap-4 py-4 sm:py-5"
                        >
                          <div className="relative h-20 w-16 shrink-0 rounded-lg overflow-hidden bg-obsidian-line">
                            <Image
                              src={productImage(line.image, 160, 200)}
                              alt={line.title || "Product image"}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs sm:text-sm font-medium leading-snug text-white truncate">
                                  {line.title}
                                </p>
                                <button
                                  onClick={() => removeItem(line.productId, line.color, line.size)}
                                  aria-label={`Remove ${line.title} from bag`}
                                  className="text-muted hover:text-white shrink-0 p-0.5 transition-colors cursor-pointer"
                                >
                                  <X size={15} />
                                </button>
                              </div>

                              <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                                {[line.color, line.size].filter(Boolean).join(" / ") || "Standard"}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity Stepper */}
                              <div className="flex items-center gap-1.5 rounded-full border border-obsidian-line px-1.5 py-0.5 bg-obsidian/40">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      line.productId,
                                      line.quantity - 1,
                                      line.color,
                                      line.size
                                    )
                                  }
                                  aria-label="Decrease quantity"
                                  className="p-1 text-muted hover:text-accent disabled:opacity-30 cursor-pointer"
                                  disabled={line.quantity <= 1}
                                >
                                  <Minus size={12} />
                                </button>

                                <span className="text-xs font-mono w-4 text-center text-white" aria-live="polite">
                                  {line.quantity}
                                </span>

                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      line.productId,
                                      line.quantity + 1,
                                      line.color,
                                      line.size
                                    )
                                  }
                                  aria-label="Increase quantity"
                                  className="p-1 text-muted hover:text-accent disabled:opacity-30 cursor-pointer"
                                  disabled={isMaxStock}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* Price Calculation */}
                              <span className="font-mono text-xs sm:text-sm text-accent font-semibold">
                                {formatPrice(line.price * line.quantity)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                {/* Bag Summary Footer */}
                <div className="border-t border-obsidian-line px-4 sm:px-6 py-4 sm:py-5 space-y-2.5 bg-obsidian-raised shrink-0">
                  <div className="flex justify-between text-xs sm:text-sm text-muted">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm text-muted">
                    <span>Shipping Fee</span>
                    <span className="font-mono text-white">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm text-muted">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-mono text-white">{formatPrice(tax)}</span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base font-medium pt-2.5 border-t border-obsidian-line mt-2 text-white">
                    <span>Grand Total</span>
                    <span className="font-mono text-accent text-base sm:text-lg font-semibold">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-4 flex items-center justify-center rounded-full bg-accent text-obsidian font-semibold text-xs sm:text-sm py-3.5 hover:brightness-110 active:scale-[0.99] transition cursor-pointer"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}