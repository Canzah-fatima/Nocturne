/**
 * Formats a numeric value into Pakistani Rupee (PKR) currency format.
 * E.g., 2500 -> "PKR 2,500" or "Rs 2,500"
 */
export function formatPrice(amount: number = 0): string {
  const numericAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Returns the direct URL if provided with an external link (Unsplash/Supabase/Cloudinary),
 * a local public asset path, or falls back to a high-res deterministic placeholder.
 */
export function productImage(seed?: string | null, w = 800, h = 1000): string {
  if (!seed || typeof seed !== "string") {
    return `https://picsum.photos/${w}/${h}?blur=2`;
  }

  const cleanSeed = seed.trim();

  // If it's already a full image URL or a local Next.js static asset path
  if (
    cleanSeed.startsWith("http://") ||
    cleanSeed.startsWith("https://") ||
    cleanSeed.startsWith("/") ||
    cleanSeed.startsWith("data:image/")
  ) {
    return cleanSeed;
  }

  // Fallback for plain string seeds / category identifiers
  return `https://picsum.photos/seed/${encodeURIComponent(cleanSeed)}/${w}/${h}`;
}

/**
 * Formats ISO timestamps into readable localized dates (e.g., for Order History and Reviews).
 */
export function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return "N/A";

  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}