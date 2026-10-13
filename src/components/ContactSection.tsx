"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { Profile, SocialLink } from "@/types";
import SocialLinks from "./SocialLinks";
import { useT } from "./TextsProvider";

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const PhoneIcon = () => <Icon><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Icon>;
const ChatIcon = () => <Icon><path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M9 10c.5 2 2 3.5 4 4l1.2-1.2 2 .8-.4 1.4c-3.600.4-7.200-3.200-6.800-6.800l1.4-.4.8 2z" /></Icon>;
const MailIcon = () => <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Icon>;
const PinIcon = () => <Icon><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>;

/** Les numéros et l'adresse e-mail ne sont jamais affichés : seuls des boutons (appel, WhatsApp, e-mail) les utilisent. */
export default function ContactSection({ profile, links }: { profile: Profile | null; links: SocialLink[] }) {
  const t = useT();
  const [subject, setSubject] = useState("");
  useEffect(() => { setSubject((new URLSearchParams(window.location.search).get("sujet") || "").slice(0, 200)); }, []);
  const phone = profile?.phone?.trim(); const wa = profile?.whatsapp?.trim(); const mail = profile?.email?.trim(); const place = profile?.location?.trim();
  const digits = (s: string) => s.replace(/[^\d]/g, "");
  if (!phone && !wa && !mail && !place && !links.length) return <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">{t.contact_empty}</p>;

  const cards = [
    phone && { key: "call", icon: <PhoneIcon />, title: t.contact_phone_label, text: t.contact_call_text, label: t.contact_call, href: `tel:${phone.replace(/\s/g, "")}`, ext: false },
    wa && { key: "wa", icon: <ChatIcon />, title: t.contact_whatsapp, text: t.contact_whatsapp_text, label: t.contact_whatsapp, href: `https://wa.me/${digits(wa)}${subject ? `?text=${encodeURIComponent(subject)}` : ""}`, ext: true },
    mail && { key: "mail", icon: <MailIcon />, title: t.contact_email_label, text: t.contact_mail_text, label: t.contact_mail, href: `mailto:${mail}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`, ext: false },
  ].filter(Boolean) as { key: string; icon: ReactNode; title: string; text: string; label: string; href: string; ext: boolean }[];

  return (
    <div className="space-y-8">
      {subject && (
        <p className="rounded-xl border-l-4 border-gold bg-soft p-4 text-sm">Objet de votre message : <strong>{subject}</strong></p>
      )}
      {cards.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <li key={c.key} className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-sm transition-shadow hover:shadow-lg sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-gold">{c.icon}</span>
              <h3 className="mt-5 font-serif text-xl font-semibold">{c.title}</h3>
              <span className="mt-3 block h-0.5 w-10 bg-gold" aria-hidden="true" />
              <p className="mt-3 flex-1 text-sm leading-6 text-muted">{c.text}</p>
              <a href={c.href} className={`btn mt-6 w-full justify-center ${i === 0 ? "btn-primary" : ""}`} {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{c.label} <span aria-hidden="true" className="ml-1">→</span></a>
            </li>
          ))}
        </ul>
      )}
      {place && (
        <div className="flex items-start gap-4 rounded-2xl bg-soft p-5 sm:p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-gold"><PinIcon /></span>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-accent">{t.label_location}</p><p className="mt-1 leading-6">{place}</p></div>
        </div>
      )}
      <SocialLinks links={links} />
    </div>
  );
}
