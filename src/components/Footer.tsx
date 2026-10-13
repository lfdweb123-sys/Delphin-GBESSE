import Image from "next/image";
import Link from "next/link";
import type { NavItem } from "@/lib/nav";
import { tpl, type Texts } from "@/lib/texts";
import type { Profile, SocialLink } from "@/types";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

/** `logoUrl` = logo du pied de page (version pour fond noir). `imageUrl` = image 400 × 400 sous le logo. */
interface Props { name: string; logoUrl?: string; imageUrl?: string; links: SocialLink[]; nav: NavItem[]; t: Texts; profile: Profile | null }

const gold = "transition-colors duration-200 hover:text-gold focus-visible:text-gold focus-visible:outline-gold";
const labelCls = "block text-xs font-medium uppercase tracking-wide text-gold";

export default function Footer({ name, logoUrl, imageUrl, links, nav, t, profile }: Props) {
  const phone = profile?.phone?.trim();
  const wa = profile?.whatsapp?.trim();
  const mail = profile?.email?.trim();
  const location = profile?.location?.trim();
  const digits = (s: string) => s.replace(/[^\d]/g, "");
  const hasContact = Boolean(phone || wa || mail || location);

  // Navigation répartie en deux colonnes (5 + 5 pour 10 pages)
  const half = Math.ceil(nav.length / 2);
  const navColumns = [
    { id: "nav1", title: t.footer_nav_title, items: nav.slice(0, half) },
    { id: "nav2", title: t.footer_nav2_title, items: nav.slice(half) },
  ].filter((col) => col.items.length > 0);

  return (
    <footer className="mt-24 bg-black text-white">
      <div className="h-0.5 bg-gold" aria-hidden="true" />
      <div className="container-x grid gap-12 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="space-y-5">
          <Logo logoUrl={logoUrl} name={name} light size="footer" />
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={name}
              width={160}
              height={160}
              sizes="120px"
              className="aspect-square w-full max-w-[120px] rounded-xl object-cover object-top"
            />
          )}
          {t.footer_text && <p className="max-w-sm whitespace-pre-line text-sm leading-6 text-white/70">{t.footer_text}</p>}
          <SocialLinks links={links} dark />
        </div>

        {navColumns.map((col) => (
          <nav key={col.id} aria-label={col.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">{col.title}</h2>
            <ul className="mt-4 space-y-1 text-sm text-white/70">
              {col.items.map((n) => (
                <li key={n.key}>
                  <Link href={n.href} className={`inline-block py-1.5 ${gold}`}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">{t.footer_contact_title}</h2>
          {hasContact && (
            <ul className="mt-4 space-y-4 text-sm text-white/70">
              {phone && (
                <li>
                  <span className={labelCls}>{t.contact_phone_label}</span>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className={`mt-1 inline-block ${gold}`}>{t.contact_call} →</a>
                </li>
              )}
              {wa && (
                <li>
                  <span className={labelCls}>{t.contact_whatsapp}</span>
                  <a href={`https://wa.me/${digits(wa)}`} target="_blank" rel="noopener noreferrer" className={`mt-1 inline-block ${gold}`}>{t.contact_whatsapp} →</a>
                </li>
              )}
              {mail && (
                <li>
                  <span className={labelCls}>{t.contact_email_label}</span>
                  <a href={`mailto:${mail}`} className={`mt-1 inline-block ${gold}`}>{t.contact_mail} →</a>
                </li>
              )}
              {location && (
                <li>
                  <span className={labelCls}>{t.label_location}</span>
                  <span className="mt-1 block leading-6">{location}</span>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/60">
        {tpl(t.footer_copyright, { year: new Date().getFullYear(), name })}
      </div>
    </footer>
  );
}
