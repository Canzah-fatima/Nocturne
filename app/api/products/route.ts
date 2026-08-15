import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const q = searchParams.get("q");

  let query = supabase.from("Product").select("*");

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("createdAt", { ascending: false });
  }

  const { data: products, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: products || [] });
}