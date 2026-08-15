"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Suspense } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function PaginationContent({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/shop?${params.toString()}`, { scroll: true });
  };

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="mt-14 pt-8 border-t border-obsidian-line flex flex-col sm:flex-row items-center justify-between gap-4 select-none"
    >
      {/* Index tracker */}
      <span className="font-mono text-xs text-muted tracking-wider order-2 sm:order-1">
        PAGE <span className="text-white font-semibold">{currentPage.toString().padStart(2, "0")}</span> OF{" "}
        <span className="text-white font-semibold">{totalPages.toString().padStart(2, "0")}</span>
      </span>

      {/* Control buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="flex items-center justify-center h-9 px-3 rounded-xl border border-obsidian-line bg-obsidian-raised text-xs font-mono text-white hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft size={15} className="sm:mr-1" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <div
                  key={`dots-${idx}`}
                  className="flex items-center justify-center w-8 h-9 text-muted"
                >
                  <MoreHorizontal size={14} />
                </div>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-xl font-mono text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-accent font-bold border border-accent/40 shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                    : "text-muted hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {pageNum.toString().padStart(2, "0")}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="flex items-center justify-center h-9 px-3 rounded-xl border border-obsidian-line bg-obsidian-raised text-xs font-mono text-white hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={15} className="sm:ml-1" />
        </button>
      </div>
    </nav>
  );
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <Suspense fallback={null}>
      <PaginationContent currentPage={currentPage} totalPages={totalPages} />
    </Suspense>
  );
}