import PageShell from "@/components/PageShell";
import { AchievementList } from "@/components/Lists";
import { byDateDesc, getPublic, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { Achievement } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("realisations", "/realisations");

export default async function Page() {
  const [t, items] = await Promise.all([getTexts(), getPublic<Achievement>("achievements")]);
  return <PageShell title={t.p_realisations_title} intro={t.p_realisations_intro} banner={t.p_realisations_banner}><AchievementList items={items.sort(byDateDesc)} /></PageShell>;
}
