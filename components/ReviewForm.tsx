"use client";

import { useState } from "react";
import { Star, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ReviewFormProps {
  productId: string;
  userName?: string;
  userId?: string;
  onReviewAdded?: () => void;
}

export default function ReviewForm({
  productId,
  userName = "",
  userId,
  onReviewAdded,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState(userName);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId,
          authorName: authorName.trim() || "Verified Buyer",
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post review.");

      setSubmitted(true);
      if (onReviewAdded) onReviewAdded();
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong submitting your review.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
        <CheckCircle2 className="mx-auto text-emerald-400 mb-2" size={24} />
        <h4 className="text-sm font-medium text-white">Review Submitted</h4>
        <p className="text-xs text-muted mt-1">
          Thank you. Your feedback has been recorded and the aggregate product score has been updated.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-obsidian-line bg-obsidian-raised p-5 sm:p-6 text-left"
    >
      <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
        Write a Review
      </h3>

      {/* Star Selector */}
      <div>
        <label className="text-[11px] font-mono text-muted block mb-1.5">
          Your Rating
        </label>
        <div className="flex gap-1 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 hover:scale-110 transition-transform cursor-pointer"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                size={18}
                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                className={(hoverRating || rating) >= star ? "text-amber-400" : "text-white/20"}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Author Name */}
      <div>
        <label htmlFor="review-name" className="text-[11px] font-mono text-muted block mb-1">
          Your Name
        </label>
        <input
          id="review-name"
          type="text"
          required
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="e.g. Fatima K."
          className="w-full rounded-xl border border-obsidian-line bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-muted/50 focus:border-accent outline-none"
        />
      </div>

      {/* Review Headline */}
      <div>
        <label htmlFor="review-headline" className="text-[11px] font-mono text-muted block mb-1">
          Headline
        </label>
        <input
          id="review-headline"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Exceptional tailoring and fabric"
          className="w-full rounded-xl border border-obsidian-line bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-muted/50 focus:border-accent outline-none"
        />
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="review-comment" className="text-[11px] font-mono text-muted block mb-1">
          Review Details
        </label>
        <textarea
          id="review-comment"
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience on material quality, sizing, and comfort..."
          className="w-full rounded-xl border border-obsidian-line bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-muted/50 focus:border-accent outline-none resize-none"
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-mono font-semibold text-obsidian hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Submitting...
          </>
        ) : (
          "SUBMIT REVIEW"
        )}
      </button>
    </form>
  );
}