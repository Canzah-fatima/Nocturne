"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CreditCard, Lock, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice, productImage } from "@/lib/format";
import { supabase } from "@/lib/supabase";

// PKR Pricing Constants aligned with backend logic
const TAX_RATE = 0.05;                   // 5% standard sales tax
const SHIPPING_FLAT = 250;           // PKR 250 flat delivery fee
const FREE_SHIPPING_THRESHOLD = 5000; // Free delivery over PKR 5,000

interface FormState {
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const initialForm: FormState = {
  fullName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear, subtotal } = useCart();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  // 1. Mark as hydrated and fetch current Supabase user session
  useEffect(() => {
    setHydrated(true);

    async function loadUserData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setForm((prev) => ({
          ...prev,
          fullName: session.user.user_metadata?.name || "",
          email: session.user.email || "",
        }));
      }
    }

    loadUserData();
  }, []);

  const currentSubtotal = hydrated ? subtotal() : 0;
  const shipping =
    currentSubtotal >= FREE_SHIPPING_THRESHOLD || currentSubtotal === 0
      ? 0
      : SHIPPING_FLAT;
  const tax = Math.round(currentSubtotal * TAX_RATE);
  const total = currentSubtotal + shipping + tax;

  // Format Credit Card input
  function formatCardNumber(val: string) {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    return raw.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  // Format Expiry input (MM/YY)
  function formatExpiry(val: string) {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      return `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    return raw;
  }

  function update<K extends keyof FormState>(key: K, value: string) {
    let formattedVal = value;
    if (key === "cardNumber") formattedVal = formatCardNumber(value);
    if (key === "expiry") formattedVal = formatExpiry(value);
    if (key === "cvc") formattedVal = value.replace(/\D/g, "").slice(0, 4);

    setForm((f) => ({ ...f, [key]: formattedVal }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      next.email = "Valid email is required";
    if (!form.street.trim()) next.street = "Street address is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.state.trim()) next.state = "State / Province is required";
    if (!form.zip.trim()) next.zip = "Postal code is required";
    if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, "")))
      next.cardNumber = "Enter a valid 16-digit card number";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry.trim()))
      next.expiry = "MM/YY";
    if (!/^\d{3,4}$/.test(form.cvc.trim())) next.cvc = "Invalid CVC";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Send order payload to server
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id || null,
          fullName: form.fullName,
          email: form.email,
          address: `${form.street}, ${form.city}, ${form.state} ${form.zip}`,
          lines: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            color: l.color || null,
            size: l.size || null,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?next=/checkout");
          return;
        }
        setSubmitError(data.error || "Something went wrong placing your order.");
        return;
      }

      clear();
      setSuccess(true);
    } catch {
      setSubmitError("Couldn't connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // --- Initial Hydration Loading Shield ---
  if (!hydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="animate-spin text-accent mb-4" />
        <p className="text-sm font-mono text-muted">Securing checkout session...</p>
      </div>
    );
  }

  // --- Success State ---
  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 pt-16 sm:pt-24 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-obsidian-line bg-obsidian-raised p-8"
        >
          <CheckCircle2 size={48} className="mx-auto text-emerald-400" />
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-4 text-white">
            Thank you for your order!
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-2 leading-relaxed">
            Your order has been placed successfully. A confirmation receipt has been sent to your email and saved to your account.
          </p>
          <div className="flex flex-col gap-3 mt-8">
            <Link
              href="/profile"
              className="w-full rounded-full bg-accent text-obsidian text-xs sm:text-sm font-semibold py-3.5 hover:brightness-110 transition text-center"
            >
              View Order History
            </Link>
            <Link
              href="/shop"
              className="w-full rounded-full border border-obsidian-line text-xs sm:text-sm py-3.5 hover:border-white/30 text-parchment transition text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Empty Bag State ---
  if (lines.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 pt-16 sm:pt-24 pb-24 text-center">
        <p className="text-muted text-sm sm:text-base">Your bag is currently empty.</p>
        <Link
          href="/shop"
          className="text-accent hover:underline text-xs sm:text-sm font-mono mt-3 inline-block"
        >
          Explore the collection →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-24">
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-6 sm:mb-8 text-white">
        Checkout
      </h1>

      {/* Mobile Collapsible Order Summary Toggle */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-obsidian-raised border border-obsidian-line text-xs font-mono cursor-pointer"
        >
          <span className="flex items-center gap-2 text-accent">
            <span>{summaryOpen ? "Hide order summary" : "Show order summary"}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${summaryOpen ? "rotate-180" : ""}`}
            />
          </span>
          <span className="font-bold text-white text-sm">{formatPrice(total)}</span>
        </button>

        {summaryOpen && (
          <div className="mt-3 p-4 rounded-2xl bg-obsidian-raised border border-obsidian-line space-y-4">
            <OrderItemsList lines={lines} />
            <CostSummary subtotal={currentSubtotal} shipping={shipping} tax={tax} total={total} />
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
        {/* Checkout Form */}
        <form onSubmit={onSubmit} noValidate className="space-y-8">
          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-300"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Contact Details */}
          <fieldset className="space-y-4">
            <legend className="font-display text-base sm:text-lg font-semibold text-white mb-2">
              Contact Information
            </legend>
            <Field
              label="Email Address"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(v) => update("email", v)}
              error={errors.email}
            />
          </fieldset>

          {/* Shipping Address */}
          <fieldset className="space-y-4">
            <legend className="font-display text-base sm:text-lg font-semibold text-white mb-2">
              Shipping Address
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <Field
                label="Full name"
                id="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={(v) => update("fullName", v)}
                error={errors.fullName}
                className="sm:col-span-2"
              />
              <Field
                label="Street address"
                id="street"
                autoComplete="street-address"
                value={form.street}
                onChange={(v) => update("street", v)}
                error={errors.street}
                className="sm:col-span-2"
              />
              <Field
                label="City"
                id="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={(v) => update("city", v)}
                error={errors.city}
              />
              <Field
                label="State / Province"
                id="state"
                autoComplete="address-level1"
                value={form.state}
                onChange={(v) => update("state", v)}
                error={errors.state}
              />
              <Field
                label="Postal Code"
                id="zip"
                autoComplete="postal-code"
                value={form.zip}
                onChange={(v) => update("zip", v)}
                error={errors.zip}
                className="sm:col-span-2"
              />
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset className="space-y-4">
            <legend className="font-display text-base sm:text-lg font-semibold text-white flex items-center gap-2 mb-1">
              <CreditCard size={18} className="text-accent" /> Payment Method
            </legend>
            <p className="text-[11px] sm:text-xs text-muted flex items-center gap-1.5 pb-1">
              <Lock size={12} className="text-accent" /> Simulated Checkout — no real charge made.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <Field
                label="Card number"
                id="cardNumber"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                autoComplete="cc-number"
                value={form.cardNumber}
                onChange={(v) => update("cardNumber", v)}
                error={errors.cardNumber}
                className="sm:col-span-2"
              />
              <Field
                label="Expiry date"
                id="expiry"
                placeholder="MM/YY"
                autoComplete="cc-exp"
                value={form.expiry}
                onChange={(v) => update("expiry", v)}
                error={errors.expiry}
              />
              <Field
                label="CVC Security Code"
                id="cvc"
                placeholder="123"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={form.cvc}
                onChange={(v) => update("cvc", v)}
                error={errors.cvc}
              />
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent text-obsidian font-semibold text-xs sm:text-sm py-4 hover:brightness-110 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-accent/10"
          >
            {loading ? "Processing order…" : `Place Order — ${formatPrice(total)}`}
          </button>
        </form>

        {/* Desktop Sticky Order Summary */}
        <div className="hidden lg:block rounded-3xl border border-obsidian-line bg-obsidian-raised p-6 sticky top-28 space-y-6">
          <h2 className="font-display text-lg font-semibold text-white">Order Summary</h2>
          <OrderItemsList lines={lines} />
          <CostSummary subtotal={currentSubtotal} shipping={shipping} tax={tax} total={total} />
        </div>
      </div>
    </div>
  );
}

function OrderItemsList({ lines }: { lines: any[] }) {
  return (
    <ul className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
      {lines.map((line) => (
        <li
          key={`${line.productId}-${line.color}-${line.size}`}
          className="flex gap-3 items-center"
        >
          <div className="relative h-14 w-12 shrink-0 rounded-lg overflow-hidden bg-obsidian-line border border-white/5">
            <Image
              src={productImage(line.image, 120, 150)}
              alt={line.title || ""}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-white truncate leading-snug">
              {line.title}
            </p>
            <p className="text-[11px] font-mono text-muted mt-0.5">
              {[line.color, line.size].filter(Boolean).join(" / ") || "Standard"} · Qty {line.quantity}
            </p>
          </div>
          <span className="font-mono text-xs sm:text-sm shrink-0 text-accent font-medium">
            {formatPrice(line.price * line.quantity)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function CostSummary({
  subtotal,
  shipping,
  tax,
  total,
}: {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  return (
    <div className="border-t border-obsidian-line pt-4 space-y-2 text-xs sm:text-sm">
      <div className="flex justify-between text-muted">
        <span>Subtotal</span>
        <span className="font-mono text-white">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-muted">
        <span>Shipping</span>
        <span className="font-mono text-white">
          {shipping === 0 ? "Free" : formatPrice(shipping)}
        </span>
      </div>
      <div className="flex justify-between text-muted">
        <span>Estimated tax (5%)</span>
        <span className="font-mono text-white">{formatPrice(tax)}</span>
      </div>
      <div className="flex justify-between text-sm sm:text-base font-semibold pt-3 border-t border-obsidian-line text-white">
        <span>Total</span>
        <span className="font-mono text-accent">{formatPrice(total)}</span>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  className,
  ...rest
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange" | "className">) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-muted">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1.5 w-full rounded-xl border bg-white/5 px-3.5 py-3 text-base sm:text-sm outline-none transition-colors text-white ${
          error ? "border-red-500/60" : "border-obsidian-line focus:border-accent/60"
        }`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="text-[11px] text-red-400 mt-1 font-mono">
          {error}
        </p>
      )}
    </div>
  );
}