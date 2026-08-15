import Link from "next/link";

const SOCIALS = [
  { label: "IG", name: "Instagram", href: "https://instagram.com" },
  { label: "X", name: "X (Twitter)", href: "https://x.com" },
  { label: "YT", name: "YouTube", href: "https://youtube.com" },
];

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Outerwear", href: "/shop?category=Outerwear" },
      { label: "Footwear", href: "/shop?category=Footwear" },
      { label: "Accessories", href: "/shop?category=Accessories" },
      { label: "Tech", href: "/shop?category=Tech" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "/" },
      { label: "Sustainability", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Order Status", href: "/profile" },
      { label: "Shipping & Returns", href: "/" },
      { label: "Size Guide", href: "/" },
      { label: "Contact Us", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-obsidian-line mt-20 sm:mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-white">
              NOCTURNE
            </span>
            <p className="text-xs sm:text-sm text-muted mt-2.5 max-w-sm leading-relaxed">
              Technical essentials for a city that doesn&apos;t slow down.
              Designed in-house, engineered for performance.
            </p>
            <div className="flex items-center gap-2.5 mt-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-obsidian-line text-[11px] font-mono text-muted hover:border-accent/60 hover:text-accent hover:bg-white/5 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links Navigation */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="col-span-1">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted">
                {col.heading}
              </h3>
              <ul className="mt-3.5 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-parchment/80 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Note */}
        <div className="mt-12 pt-6 border-t border-obsidian-line flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Nocturne Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-parchment transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-parchment transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}