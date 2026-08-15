import HeroBanner from "@/components/HeroBanner";
import TrustBar from "@/components/TrustBar";
import BentoGrid from "@/components/BentoGrid";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 60; // Cache and revalidate data every 60 seconds

export default async function Home() {
  // 1. Fetch products from Supabase
  const { data: productsData, error: productError } = await supabase
    .from("Product")
    .select("*")
    .order("createdAt", { ascending: false });

  if (productError) {
    console.error("Error fetching homepage products:", productError.message);
  }

  // 2. Fetch live customer reviews with linked product titles directly from Supabase
  const { data: reviewsData, error: reviewError } = await supabase
    .from("Review")
    .select(`
      id,
      name,
      text,
      rating,
      role,
      product:Product(title)
    `)
    .order("createdAt", { ascending: false })
    .limit(10);

  if (reviewError) {
    console.error("Error fetching homepage reviews:", reviewError.message);
  }

  const products = productsData || [];
  const bestsellers = products.filter((p) => p.badge === "Bestseller");

  const reviews = (reviewsData || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    text: r.text,
    rating: r.rating || 5,
    role: r.role || "Verified Buyer",
    productTitle: r.product?.title || "Nocturne Essential",
  }));

  return (
    <div className="pb-24">
      {/* Renders TrustBar exclusively on the homepage */}
      <TrustBar />

      <HeroBanner />

      <BentoGrid products={products} />

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-accent-emerald uppercase">
              Bestsellers
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mt-2 text-white">
              What everyone&apos;s wearing
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-muted hover:text-parchment transition-colors font-mono"
          >
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Render Testimonials with database reviews */}
      {reviews.length > 0 && <Testimonials reviews={reviews} />}

      <Newsletter />
    </div>
  );
}