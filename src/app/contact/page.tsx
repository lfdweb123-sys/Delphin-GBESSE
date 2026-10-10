import PageShell from "@/components/PageShell";
import ContactSection from "@/components/ContactSection";
import { getProfile, getPublic, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { SocialLink } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("contact", "/contact");

export default async function Page() {
  const [t, profile, links] = await Promise.all([getTexts(), getProfile(), getPublic<SocialLink>("socialLinks")]);
  return <PageShell title={t.p_contact_title} intro={t.p_contact_intro} banner={t.p_contact_banner}><ContactSection profile={profile} links={links} /></PageShell>;
}
