import { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import Pagination from "@/components/Pagination";
import BackToTop from "@/components/BackToTop";
import { supabase } from "@/lib/supabase";

const ITEMS_PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    min?: string;
    max?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  if (params.category && params.category !== "All") {
    return { title: `${params.category} — NOCTURNE` };
  }
  if (params.q) {
    return { title: `Search: "${params.q}" — NOCTURNE` };
  }
  return { title: "Shop Collection — NOCTURNE" };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  // 1. Fetch distinct categories dynamically from Supabase
  const { data: catData } = await supabase.from("Product").select("category");
  const categories = Array.from(
    new Set((catData || []).map((c) => c.category).filter(Boolean))
  );

  // 2. Build Supabase query dynamically based on active filters with exact row count
  let query = supabase.from("Product").select("*", { count: "exact" });

  // Category filter
  if (params.category && params.category !== "All") {
    query = query.eq("category", params.category);
  }

  // Search query filter (Sanitized against PostgREST special characters)
  if (params.q) {
    const sanitizedQuery = params.q.replace(/[,()%_]/g, "").trim();
    if (sanitizedQuery) {
      query = query.or(
        `title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`
      );
    }
  }

  // Price range filters in PKR (direct integer comparison, no cents multiplication)
  if (params.min && !isNaN(Number(params.min))) {
    query = query.gte("price", Math.max(0, Math.floor(Number(params.min))));
  }
  if (params.max && !isNaN(Number(params.max))) {
    query = query.lte("price", Math.max(0, Math.floor(Number(params.max))));
  }

  // Sorting
  if (params.sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("createdAt", { ascending: false });
  }

  // 3. Slice database results by page range
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data: productsData, count, error } = await query;

  if (error) {
    console.error("Error fetching shop products:", error.message);
  }

  const products = productsData || [];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-24 relative">
      <div className="mb-6 sm:mb-8">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          {params.q ? `Results for "${params.q}"` : "Full Collection"}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-2 text-white">
          Shop
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        <ShopFilters categories={categories} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm text-muted font-mono">
              Showing {products.length > 0 ? from + 1 : 0}–{Math.min(to + 1, totalCount)} of {totalCount} items
            </p>
            {totalPages > 1 && (
              <span className="text-xs font-mono text-muted">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-obsidian-line py-20 sm:py-24 text-center text-muted text-sm bg-obsidian-raised/40">
              Nothing matches those filters yet. Try adjusting your search or clearing price filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </>
          )}
        </div>
      </div>

      <BackToTop />
    </div>
  );
}