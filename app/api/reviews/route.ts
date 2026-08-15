import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => null);

    const { productId, authorName, rating, title, comment } = body || {};

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "A valid Product ID is required." },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 4) {
      return NextResponse.json(
        { error: "Please provide a review comment with at least 4 characters." },
        { status: 400 }
      );
    }

    const cleanAuthor =
      (typeof authorName === "string" && authorName.trim()) ||
      session?.name ||
      "Verified Customer";

    const cleanTitle =
      (typeof title === "string" && title.trim()) || "Customer Review";

    // 1. Insert review into Supabase using server-trusted session ID
    const { data: newReview, error: reviewError } = await supabaseAdmin
      .from("Review")
      .insert([
        {
          productId,
          userId: session?.id || null,
          authorName: cleanAuthor,
          rating: numRating,
          title: cleanTitle,
          comment: comment.trim(),
          verifiedPurchase: Boolean(session?.id),
        },
      ])
      .select()
      .single();

    if (reviewError || !newReview) {
      return NextResponse.json(
        { error: reviewError?.message || "Failed to submit review." },
        { status: 500 }
      );
    }

    // 2. Fetch all reviews for this product to recalculate new aggregate score
    const { data: allReviews } = await supabaseAdmin
      .from("Review")
      .select("rating")
      .eq("productId", productId);

    if (allReviews && allReviews.length > 0) {
      const totalScore = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      const averageRating = Number((totalScore / allReviews.length).toFixed(1));

      // 3. Update parent product rating & review count in background
      await supabaseAdmin
        .from("Product")
        .update({
          rating: averageRating,
          reviewCount: allReviews.length,
        })
        .eq("id", productId);
    }

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error submitting review." },
      { status: 500 }
    );
  }
}