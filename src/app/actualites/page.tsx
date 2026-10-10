import PageShell from "@/components/PageShell";
import { NewsList } from "@/components/Lists";
import { byDateDesc, getPublic, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { NewsItem } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("actualites", "/actualites");

export default async function Page() {
  const [t, items] = await Promise.all([getTexts(), getPublic<NewsItem>("news")]);
  return <PageShell title={t.p_actualites_title} intro={t.p_actualites_intro} banner={t.p_actualites_banner}><NewsList items={items.sort(byDateDesc)} /></PageShell>;
}
