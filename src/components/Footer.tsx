import Link from "next/link";
import type { NavItem } from "@/lib/nav";
import { tpl, type Texts } from "@/lib/texts";
import type { Profile, SocialLink } from "@/types";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

interface Props { name: string; logoUrl?: string; links: SocialLink[]; nav: NavItem[]; t: Texts; profile: Profile | null }

const gold = "transition-colors duration-200 hover:text-gold focus-visible:text-gold focus-visible:outline-gold";

export default function Footer({ name, logoUrl, links, nav, t, profile }: Props) {
  const phone = profile?.phone?.trim();
  const wa = profile?.whatsapp?.trim();
  const mail = profile?.email?.trim();
  const location = profile?.location?.trim();
  const digits = (s: string) => s.replace(/[^\d]/g, "");
  const hasContact = Boolean(phone || wa || mail || location);

  // Navigation répartie en deux colonnes (5 + 5 pour 10 pages)
  const half = Math.ceil(nav.length / 2);
  const navColumns = [nav.slice(0, half), nav.slice(half)].filter((col) => col.length > 0);

  return (
    <footer className="mt-24 bg-black text-white">
      <div className="h-0.5 bg-gold" aria-hidden="true" />
      <div className="container-x grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.4fr_1.6fr_1fr]">
        <div className="space-y-5">
          <Logo logoUrl={logoUrl} name={name} light />
          {t.footer_text && <p className="max-w-sm whitespace-pre-line text-sm leading-6 text-white/70">{t.footer_text}</p>}
          <SocialLinks links={links} dark />
        </div>

        <nav aria-label="Pied de page">
          <h2 className="text-sm font-semibold text-white">{t.footer_nav_title}</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-6">
            {navColumns.map((col, i) => (
              <ul key={i} className="space-y-1 text-sm text-white/70">
                {col.map((n) => (
                  <li key={n.key}>
                    <Link href={n.href} className={`inline-block py-1.5 ${gold}`}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>

        {hasContact && (
          <div>
            <h2 className="text-sm font-semibold text-white">{t.footer_contact_title}</h2>
            <ul className="mt-4 space-y-1 text-sm text-white/70">
              {phone && <li><a href={`tel:${phone.replace(/\s/g, "")}`} className={`inline-block py-1.5 ${gold}`}>{phone}</a></li>}
              {wa && <li><a href={`https://wa.me/${digits(wa)}`} target="_blank" rel="noopener noreferrer" className={`inline-block py-1.5 ${gold}`}>{t.contact_whatsapp} : {wa}</a></li>}
              {mail && <li><a href={`mailto:${mail}`} className={`inline-block break-all py-1.5 ${gold}`}>{mail}</a></li>}
              {location && <li className="py-1.5">{location}</li>}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/60">
        {tpl(t.footer_copyright, { year: new Date().getFullYear(), name })}
      </div>
    </footer>
  );
}
