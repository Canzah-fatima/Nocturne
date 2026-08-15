"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || searchParams.get("redirect") || "/profile";
  // Guard against open redirect attacks: only allow relative application paths
  const nextTarget = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        return;
      }

      if (data.session) {
        router.push(nextTarget);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Welcome back
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-2 text-white">
          Log in
        </h1>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-300"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="text-xs font-mono uppercase tracking-wider text-muted">
              Email Address
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-obsidian-line bg-white/5 px-3.5 py-3 focus-within:border-accent/60 transition-colors">
              <Mail size={15} className="text-muted shrink-0" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-muted/60 focus:ring-0 font-mono"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="text-xs font-mono uppercase tracking-wider text-muted">
              Password
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-obsidian-line bg-white/5 px-3.5 py-3 focus-within:border-accent/60 transition-colors">
              <Lock size={15} className="text-muted shrink-0" aria-hidden="true" />
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-white focus:ring-0 font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-accent text-obsidian font-semibold text-xs sm:text-sm py-3.5 hover:brightness-110 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-accent/10"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        <p className="text-xs sm:text-sm text-muted mt-6 text-center">
          New here?{" "}
          <Link
            href={`/register${nextTarget !== "/profile" ? `?next=${encodeURIComponent(nextTarget)}` : ""}`}
            className="text-accent hover:underline font-mono"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-muted font-mono text-xs">
          <Loader2 size={20} className="animate-spin text-accent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}