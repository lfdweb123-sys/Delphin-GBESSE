import Link from "next/link";
import type { NavItem } from "@/lib/nav";
import { tpl, type Texts } from "@/lib/texts";
import type { SocialLink } from "@/types";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

export default function Footer({ name, logoUrl, links, nav, t }: { name: string; logoUrl?: string; links: SocialLink[]; nav: NavItem[]; t: Texts }) {
  return (
    <footer className="mt-24 border-t border-line bg-soft">
      <div className="container-x grid gap-10 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <Logo logoUrl={logoUrl} name={name} />
          {t.footer_text && <p className="max-w-md whitespace-pre-line text-sm leading-6 text-muted">{t.footer_text}</p>}
          <SocialLinks links={links} />
        </div>
        <nav aria-label="Pied de page" className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted sm:grid-cols-3">
          {nav.map((n) => <Link key={n.key} href={n.href} className="py-1.5 hover:text-ink">{n.label}</Link>)}
        </nav>
      </div>
      <div className="border-t border-line px-4 py-5 text-center text-xs text-muted">{tpl(t.footer_copyright, { year: new Date().getFullYear(), name })}</div>
    </footer>
  );
}
