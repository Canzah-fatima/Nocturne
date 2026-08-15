// import { notFound } from "next/navigation";
// import type { Metadata } from "next";
// import { supabase } from "@/lib/supabase";
// import ProductDetail from "@/components/ProductDetail";
// import ProductCard from "@/components/ProductCard";

// // Helper to test if string is a valid UUID
// const UUID_REGEX =
//   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// // 1. Dynamic SEO Metadata
// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const { id } = await params;
//   const isUuid = UUID_REGEX.test(id);

//   let query = supabase.from("Product").select("title, description");
//   if (isUuid) {
//     query = query.or(`id.eq.${id},slug.eq.${id}`);
//   } else {
//     query = query.eq("slug", id);
//   }

//   const { data: product } = await query.maybeSingle();

//   if (!product) {
//     return { title: "Product Not Found — NOCTURNE" };
//   }

//   return {
//     title: `${product.title} — NOCTURNE`,
//     description: product.description,
//   };
// }

// // 2. Main Page Component
// export default async function ProductPage({ params }: PageProps) {
//   const { id } = await params;
//   const isUuid = UUID_REGEX.test(id);

//   // Safe fallback lookup to prevent invalid UUID cast errors in Postgres
//   let query = supabase.from("Product").select("*");
//   if (isUuid) {
//     query = query.or(`id.eq.${id},slug.eq.${id}`);
//   } else {
//     query = query.eq("slug", id);
//   }

//   const { data: product, error } = await query.maybeSingle();

//   if (error || !product) {
//     notFound();
//   }

//   // Fetch related products in the same category
//   const { data: relatedData } = await supabase
//     .from("Product")
//     .select("*")
//     .eq("category", product.category)
//     .neq("id", product.id)
//     .limit(4);

//   const related = relatedData || [];

//   return (
//     <div className="min-h-screen">
//       {/* Standalone Product Detail View */}
//       <ProductDetail product={product} />

//       {/* Related Products Showcase */}
//       {related.length > 0 && (
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 border-t border-obsidian-line pt-12 sm:pt-16">
//           <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase mb-1">
//             Complete the look
//           </p>
//           <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight mb-6 text-white">
//             You may also like
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
//             {related.map((p) => (
//               <ProductCard key={p.id} product={p} />
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }



















import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const isUuid = UUID_REGEX.test(id);

  let query = supabase.from("Product").select("title, description");
  if (isUuid) {
    query = query.eq("id", id);
  } else {
    query = query.eq("slug", id);
  }

  const { data: product } = await query.maybeSingle();

  if (!product) {
    return { title: "Product Not Found — NOCTURNE" };
  }

  return {
    title: `${product.title} — NOCTURNE`,
    description: product.description ?? "",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const isUuid = UUID_REGEX.test(id);

  let query = supabase.from("Product").select("*");
  if (isUuid) {
    query = query.eq("id", id);
  } else {
    query = query.eq("slug", id);
  }

  const { data: product, error } = await query.maybeSingle();

  if (error || !product) {
    notFound();
  }

  const { data: relatedData } = await supabase
    .from("Product")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  const related = relatedData ?? [];

  return (
    <div className="min-h-screen bg-obsidian text-parchment">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 border-t border-obsidian-line pt-12 sm:pt-16">
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase mb-1">
            Complete the look
          </p>
          <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight mb-6 text-white">
            You may also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}