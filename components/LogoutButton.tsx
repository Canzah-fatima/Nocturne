"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, AlertTriangle, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoutButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-obsidian-line bg-obsidian-raised px-4 py-2 text-xs font-mono text-muted hover:text-white hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
      >
        <LogOut size={14} />
        <span>Sign out</span>
      </button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              aria-describedby="logout-description"
              className="relative w-full max-w-sm rounded-2xl border border-obsidian-line bg-obsidian-raised p-6 shadow-2xl z-10"
            >
              <button
                type="button"
                onClick={() => !loading && setIsOpen(false)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 id="logout-title" className="font-display text-base font-semibold text-white">
                    Confirm Sign Out
                  </h3>
                  <p id="logout-description" className="text-xs text-muted mt-0.5">
                    Are you sure you want to sign out of your account?
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="rounded-full border border-obsidian-line px-4 py-2 text-xs font-mono text-muted hover:text-white hover:border-white/20 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500/90 hover:bg-red-500 text-white font-mono text-xs px-4 py-2 transition cursor-pointer disabled:opacity-50 shadow-md shadow-red-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <span>Sign Out</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}