"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  title: string;
  content: string;
  badge?: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="w-full divide-y divide-obsidian-line border-y border-obsidian-line">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div
            key={item.title}
            className={`group transition-colors duration-300 ${
              open ? "bg-obsidian-raised/40" : "hover:bg-obsidian-raised/20"
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between py-4 sm:py-5 px-2 text-left transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-lg cursor-pointer"
              >
                {/* Index Number & Title */}
                <div className="flex items-center gap-2.5 sm:gap-4 pr-2 min-w-0">
                  <span
                    className={`font-mono text-xs shrink-0 transition-colors duration-300 ${
                      open ? "text-accent font-bold" : "text-muted/60 group-hover:text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-xs sm:text-sm md:text-base font-medium transition-colors duration-300 truncate ${
                      open ? "text-white font-semibold" : "text-parchment group-hover:text-white"
                    }`}
                  >
                    {item.title}
                  </span>

                  {item.badge && (
                    <span className="hidden sm:inline-block shrink-0 rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-[10px] font-mono uppercase text-accent">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Animated Toggle Icon Badge */}
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    open
                      ? "border-accent/40 bg-accent/10 text-accent shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                      : "border-obsidian-line bg-obsidian text-muted group-hover:border-white/20 group-hover:text-parchment"
                  }`}
                >
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.25, ease: "linear" },
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 sm:pb-6 pt-1 px-2 pl-6 sm:pl-10 text-xs sm:text-sm text-muted leading-relaxed border-l-2 border-accent/30 ml-2 sm:ml-3 my-1">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}