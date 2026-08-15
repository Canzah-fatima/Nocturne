"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatPrice, productImage, formatDate } from "@/lib/format";
import LogoutButton from "@/components/LogoutButton";
import { Package, Loader2, MapPin, ArrowRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface OrderItemRecord {
  id: string;
  productId: string;
  title: string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
  image?: string | null;
}

interface OrderRecord {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  address?: string | null;
  items: OrderItemRecord[];
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "border-amber-500/40 text-amber-300 bg-amber-500/10",
  PAID: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  SHIPPED: "border-accent/40 text-accent bg-accent/10",
  DELIVERED: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  CANCELLED: "border-rose-500/40 text-rose-300 bg-rose-500/10",
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push("/login?next=/profile");
        return;
      }

      setUser(currentUser);

      const { data: ordersData, error } = await supabase
        .from("Order")
        .select(`
          id,
          createdAt,
          totalAmount,
          status,
          address,
          items:OrderItem(
            id,
            productId,
            title,
            quantity,
            price,
            color,
            size,
            image
          )
        `)
        .eq("userId", currentUser.id)
        .order("createdAt", { ascending: false });

      if (!error && ordersData) {
        setOrders(ordersData as unknown as OrderRecord[]);
      }

      setLoading(false);
    }

    loadUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-muted font-mono text-xs gap-3">
        <Loader2 size={24} className="animate-spin text-accent" />
        <span>Loading account details...</span>
      </div>
    );
  }

  if (!user) return null;

  const userName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-24">
      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-obsidian-line bg-obsidian-raised mb-8 sm:mb-10">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase font-semibold">
            Customer Profile
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1 text-white">
            {userName}
          </h1>
          <p className="text-xs sm:text-sm text-muted font-mono mt-0.5">{user.email}</p>
        </div>
        <div className="shrink-0 self-start sm:self-center">
          <LogoutButton />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg sm:text-xl font-semibold text-white">
          Order History
        </h2>
        {orders.length > 0 && (
          <span className="text-xs font-mono text-muted">
            {orders.length} order{orders.length === 1 ? "" : "s"} placed
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-obsidian-line bg-obsidian-raised/40 py-16 text-center text-muted flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-obsidian-line/50 flex items-center justify-center">
            <Package size={24} className="text-muted/60" />
          </div>
          <p className="text-sm text-white font-medium">No order history found</p>
          <p className="text-xs text-muted max-w-xs">
            When you complete an order, your receipts and order tracking updates will appear here.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
          >
            Start shopping <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-obsidian-line bg-obsidian-raised p-5 sm:p-6 transition-all"
            >
              {/* Order Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-obsidian-line">
                <div>
                  <p className="text-xs sm:text-sm font-semibold font-mono text-white">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted font-mono mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-mono uppercase font-semibold tracking-wider rounded-full border px-3 py-1 ${
                    STATUS_STYLES[order.status] || STATUS_STYLES.PENDING
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <ul className="space-y-3.5 divide-y divide-obsidian-line/40">
                {(order.items || []).map((item) => (
                  <li key={item.id} className="flex gap-3.5 items-center pt-3.5 first:pt-0">
                    <div className="relative h-14 w-12 shrink-0 rounded-lg overflow-hidden bg-obsidian-line border border-white/5">
                      <Image
                        src={productImage(item.image, 120, 150)}
                        alt={item.title || "Ordered item"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white truncate leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted font-mono mt-0.5">
                        {[item.color, item.size].filter(Boolean).join(" / ") || "Standard"} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-xs sm:text-sm shrink-0 text-accent font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Shipping Address & Order Total */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-obsidian-line text-xs sm:text-sm">
                {order.address ? (
                  <div className="flex items-center gap-1.5 text-muted text-[11px] sm:text-xs font-mono truncate max-w-sm">
                    <MapPin size={13} className="text-accent shrink-0" />
                    <span className="truncate">{order.address}</span>
                  </div>
                ) : (
                  <div />
                )}

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-muted">Total Amount:</span>
                  <span className="font-mono text-accent text-sm sm:text-base font-bold">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}