"use client";
import type { Profile, SocialLink } from "@/types";
import SocialLinks from "./SocialLinks";
import { useT } from "./TextsProvider";

/** Aucun formulaire : uniquement les coordonnées publiques saisies dans le dashboard. */
export default function ContactSection({ profile, links }: { profile: Profile | null; links: SocialLink[] }) {
  const t = useT();
  const phone = profile?.phone?.trim(); const wa = profile?.whatsapp?.trim(); const mail = profile?.email?.trim();
  const digits = (s: string) => s.replace(/[^\d]/g, "");
  if (!phone && !wa && !mail && !links.length) return <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">{t.contact_empty}</p>;
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {phone && <a className="btn btn-primary" href={`tel:${phone.replace(/\s/g, "")}`}>{t.contact_call}</a>}
        {wa && <a className="btn" href={`https://wa.me/${digits(wa)}`} target="_blank" rel="noopener noreferrer">{t.contact_whatsapp}</a>}
        {mail && <a className="btn" href={`mailto:${mail}`}>{t.contact_mail}</a>}
      </div>
      <dl className="grid gap-4 text-sm sm:grid-cols-3">
        {phone && <div><dt className="text-muted">{t.contact_phone_label}</dt><dd className="mt-1 break-words font-medium">{phone}</dd></div>}
        {wa && <div><dt className="text-muted">{t.contact_whatsapp}</dt><dd className="mt-1 break-words font-medium">{wa}</dd></div>}
        {mail && <div><dt className="text-muted">{t.contact_email_label}</dt><dd className="mt-1 break-all font-medium">{mail}</dd></div>}
      </dl>
      <SocialLinks links={links} />
    </div>
  );
}
