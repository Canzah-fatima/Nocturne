"use client";

import { Star } from "lucide-react";

interface RatingProps {
  value: number; // e.g. 4.7
  count?: number; // e.g. 128
  className?: string;
}

export default function Rating({
  value = 0,
  count = 0,
  className = "",
}: RatingProps) {
  const numericValue = Number(value || 0);
  const formattedScore = numericValue.toFixed(1);

  return (
    <div className={`flex items-center gap-1.5 shrink-0 ${className}`}>
      {/* 5-Star Row with Proportional Fills */}
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => {
          // Calculate exact fill percentage (0% to 100%) for each star
          const fillPercent = Math.max(
            0,
            Math.min(100, (numericValue - (star - 1)) * 100)
          );

          return (
            <div key={star} className="relative w-3 h-3 sm:w-3.5 sm:h-3.5">
              {/* Background Unfilled Star */}
              <Star
                size={14}
                className="absolute inset-0 w-full h-full text-obsidian-line fill-white/10"
              />
              {/* Foreground Filled Star with Dynamic Width Clip */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  size={14}
                  className="w-full h-full text-accent fill-accent shrink-0"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Screen Reader Label */}
      <span className="sr-only">
        {formattedScore} out of 5 stars ({count} reviews)
      </span>

      {/* Responsive Score & Count Text */}
      <span className="text-[11px] sm:text-xs text-muted font-mono whitespace-nowrap">
        <span className="text-white font-medium">{formattedScore}</span>{" "}
        {count > 0 && <span>({count})</span>}
      </span>
    </div>
  );
}