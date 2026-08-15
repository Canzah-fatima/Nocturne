import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const isUuid = UUID_REGEX.test(id);

  let query = supabase.from("Product").select("*");
  if (isUuid) {
    query = query.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    query = query.eq("slug", id);
  }

  const { data: product, error } = await query.maybeSingle();

  if (error || !product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product });
}