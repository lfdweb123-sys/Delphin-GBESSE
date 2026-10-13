import type { Profile } from "@/types";
import type { Texts } from "./texts";
import type { FeatureItem } from "@/components/FeatureList";

/** Bloc « À propos » (accueil et page /a-propos), affiché avec le même design que les services. */
export function aboutItems(profile: Profile | null, t: Texts, name: string): FeatureItem[] {
  const text = (profile?.presentation || profile?.fullBio || "").trim();
  const responsibilities = profile?.responsibilities?.trim();
  const image = t.about_image || profile?.photo;
  const facts = [
    profile?.domains && { label: t.label_domains, value: profile.domains },
    profile?.location && { label: t.label_location, value: profile.location },
    responsibilities && { label: t.label_responsibilities, value: responsibilities },
  ].filter(Boolean) as { label: string; value: string }[];
  if (!text && !image && !facts.length) return [];
  return [{ id: "about", title: name, description: text || undefined, image, kicker: profile?.roles, facts, href: `/contact?sujet=${encodeURIComponent(`Prise de contact : ${name}`)}` }];
}
