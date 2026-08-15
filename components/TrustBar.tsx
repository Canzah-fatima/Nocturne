"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Free shipping over $200" },
  { icon: RotateCcw, label: "30-day easy returns" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: Sparkles, label: "New drops every Friday" },
];

export default function TrustBar() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="border-y border-obsidian-line bg-obsidian-raised/60 overflow-hidden py-0.5">
      <motion.div
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex w-max items-center"
      >
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 px-6 sm:px-8 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-muted whitespace-nowrap"
          >
            <item.icon size={13} className="text-accent shrink-0" />
            {item.label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}