"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Couldn't reach the server.");
      setStatus("error");
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24 md:mt-32">
      <div className="rounded-3xl sm:rounded-[2rem] border border-obsidian-line bg-obsidian-raised p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8">
        <div className="max-w-md">
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Stay in the loop
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1.5 text-white">
            Get early access to drops
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            One email a week. New arrivals, restocks, and exclusive releases. No spam.
          </p>
        </div>

        {status === "done" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-emerald-400 text-sm font-medium font-mono bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-full self-start md:self-auto"
          >
            <CheckCircle2 size={18} />
            <span>You&apos;re on the list.</span>
          </motion.div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5 sm:gap-3"
          >
            <div className="flex-1 min-w-0 sm:min-w-[280px]">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-full border bg-white/5 px-4 py-3 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-muted/60 ${
                  status === "error"
                    ? "border-red-500/60"
                    : "border-obsidian-line focus:border-accent/60"
                }`}
              />
              {error && (
                <p className="text-xs text-red-400 mt-1.5 ml-2 font-mono">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent text-obsidian font-mono text-xs sm:text-sm font-semibold px-6 py-3 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Joining…</span>
                </>
              ) : (
                <>
                  <span>Join</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}