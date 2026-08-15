import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs font-mono text-muted uppercase tracking-wide">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-parchment transition-colors">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-parchment/80">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
