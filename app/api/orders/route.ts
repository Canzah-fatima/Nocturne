import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface CheckoutLine {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

// PKR Pricing Constants
const FREE_SHIPPING_THRESHOLD_PKR = 5000; // Free delivery over PKR 5,000
const FLAT_SHIPPING_FEE_PKR = 250;        // Flat delivery rate: PKR 250
const TAX_RATE = 0.05;                    // 5% standard sales tax

// GET: Retrieve authenticated user's order history
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from("Order")
    .select(`
      *,
      items:OrderItem(*)
    `)
    .eq("userId", session.id)
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: orders || [] });
}

// POST: Place order with server-side PKR calculations, stock verification, and rollback safety
export async function POST(req: NextRequest) {
  const session = await getSession();

  const body = await req.json().catch(() => null);
  const lines: CheckoutLine[] = body?.lines;
  const address = body?.address?.trim();
  const userId = session?.id || body?.userId || null;

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  if (!address || address.length < 5) {
    return NextResponse.json(
      { error: "A valid delivery address is required." },
      { status: 400 }
    );
  }

  // 1. Consolidate product quantities across variant lines
  const aggregatedQuantities = new Map<string, number>();
  for (const line of lines) {
    if (!line.productId || typeof line.quantity !== "number" || line.quantity < 1 || !Number.isInteger(line.quantity)) {
      return NextResponse.json(
        { error: "Invalid product quantity in cart." },
        { status: 400 }
      );
    }
    const current = aggregatedQuantities.get(line.productId) || 0;
    aggregatedQuantities.set(line.productId, current + line.quantity);
  }

  // 2. Fetch fresh product prices & stock directly from Supabase (Server-side trust)
  const productIds = Array.from(aggregatedQuantities.keys());
  const { data: products, error: productError } = await supabase
    .from("Product")
    .select("id, title, price, stockCount, images")
    .in("id", productIds);

  if (productError || !products || products.length !== productIds.length) {
    return NextResponse.json(
      { error: "One or more items in your cart are no longer available." },
      { status: 400 }
    );
  }

  // 3. Validate stock availability
  const productMap = new Map(products.map((p) => [p.id, p]));
  for (const [productId, requestedQty] of aggregatedQuantities.entries()) {
    const product = productMap.get(productId)!;
    if (product.stockCount !== null && requestedQty > product.stockCount) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.title}. Available: ${product.stockCount}` },
        { status: 400 }
      );
    }
  }

  // 4. Calculate Subtotal, Delivery Fee, Tax, and Grand Total in PKR
  let subtotal = 0;
  const orderItemsData = lines.map((line) => {
    const product = productMap.get(line.productId)!;
    const itemPrice = Math.round(product.price); // Price in PKR
    subtotal += itemPrice * line.quantity;

    return {
      productId: product.id,
      title: product.title,
      quantity: line.quantity,
      price: itemPrice,
      color: line.color || null,
      size: line.size || null,
      image: product.images?.[0] || null,
    };
  });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_PKR ? 0 : FLAT_SHIPPING_FEE_PKR;
  const tax = Math.round(subtotal * TAX_RATE);
  const totalAmount = subtotal + shipping + tax;

  // 5. Insert main Order record
  const { data: newOrder, error: orderInsertError } = await supabase
    .from("Order")
    .insert({
      userId,
      totalAmount,
      currency: "PKR",
      status: "PAID",
      address,
    })
    .select()
    .single();

  if (orderInsertError || !newOrder) {
    return NextResponse.json(
      { error: orderInsertError?.message || "Failed to create order." },
      { status: 500 }
    );
  }

  // 6. Insert OrderItems with Rollback on failure
  const itemsToInsert = orderItemsData.map((item) => ({
    ...item,
    orderId: newOrder.id,
  }));

  const { error: itemsInsertError } = await supabase
    .from("OrderItem")
    .insert(itemsToInsert);

  if (itemsInsertError) {
    console.error("Order items insert failed. Rolling back order:", itemsInsertError.message);
    await supabase.from("Order").delete().eq("id", newOrder.id);
    return NextResponse.json(
      { error: "Failed to save order items. Transaction rolled back." },
      { status: 500 }
    );
  }

  // 7. Decrement stock counts in database
  for (const [productId, quantityBought] of aggregatedQuantities.entries()) {
    const product = productMap.get(productId)!;
    if (product.stockCount !== null) {
      await supabase
        .from("Product")
        .update({ stockCount: Math.max(0, product.stockCount - quantityBought) })
        .eq("id", productId);
    }
  }

  return NextResponse.json(
    {
      order: newOrder,
      summary: {
        currency: "PKR",
        subtotal,
        shipping,
        tax,
        totalAmount,
      },
    },
    { status: 201 }
  );
}