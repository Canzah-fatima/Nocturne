"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";

export interface ReviewItem {
  id: string;
  name: string;
  text: string;
  rating: number;
  role: string;
  productTitle: string;
}

interface TestimonialsProps {
  reviews: ReviewItem[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  if (!reviews || reviews.length === 0) return null;

  const marqueeItems =
    reviews.length < 5
      ? [...reviews, ...reviews, ...reviews, ...reviews]
      : [...reviews, ...reviews];

  return (
    <section className="py-12 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Reviews
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-1.5 text-white">
          From people who wear it
        </h2>
      </div>

      <div className="flex select-none">
        <motion.div
          className="flex gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: Math.max(20, marqueeItems.length * 4),
            ease: "linear",
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {marqueeItems.map((review, idx) => {
            const rawRating = Number(review.rating) || 5;
            const formattedRating = rawRating.toFixed(1);

            return (
              <figure
                key={`${review.id}-${idx}`}
                className="w-[290px] sm:w-[360px] shrink-0 rounded-2xl border border-obsidian-line bg-obsidian-raised p-5 sm:p-6 flex flex-col justify-between hover:border-accent/40 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    {/* Decimal Score + Proportional Stars */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-white">
                        {formattedRating}
                      </span>
                      <div
                        className="flex gap-0.5 text-accent"
                        aria-label={`${formattedRating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => {
                          const fillPercent = Math.max(
                            0,
                            Math.min(100, (rawRating - (star - 1)) * 100)
                          );

                          return (
                            <div key={star} className="relative w-3.5 h-3.5">
                              {/* Background empty star */}
                              <Star
                                size={14}
                                className="absolute inset-0 text-white/20 fill-white/10"
                              />
                              {/* Foreground filled star with dynamic clip */}
                              <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillPercent}%` }}
                              >
                                <Star
                                  size={14}
                                  className="text-accent fill-accent shrink-0"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-medium">
                      <ShieldCheck size={12} /> {review.role}
                    </span>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-5 pt-4 border-t border-obsidian-line flex items-center justify-between gap-2">
                  <div>
                    <figcaption className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                      {review.name}
                    </figcaption>
                    <span className="font-mono text-[10px] text-muted tracking-wider uppercase">
                      Customer
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-accent/80 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 truncate max-w-[150px]">
                    {review.productTitle}
                  </span>
                </div>
              </figure>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}