import PageShell from "@/components/PageShell";
import { AchievementList } from "@/components/Lists";
import { byDateDesc, getPublic, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { Achievement, Activity } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("activites", "/activites");

export default async function Page() {
  const [t, items] = await Promise.all([getTexts(), getPublic<Activity>("activities")]);
  return <PageShell title={t.p_activites_title} intro={t.p_activites_intro} banner={t.p_activites_banner}><AchievementList items={items.sort(byDateDesc) as unknown as Achievement[]} /></PageShell>;
}
