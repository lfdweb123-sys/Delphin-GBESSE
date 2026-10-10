import PageShell from "@/components/PageShell";
import Timeline from "@/components/Timeline";
import { Empty } from "@/components/Cards";
import { byDateAsc, getPublic, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { TimelineEntry } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("parcours", "/parcours");

export default async function Page() {
  const [t, items] = await Promise.all([getTexts(), getPublic<TimelineEntry>("timeline")]);
  return <PageShell title={t.p_parcours_title} intro={t.p_parcours_intro} banner={t.p_parcours_banner}>{items.length ? <Timeline items={items.sort(byDateAsc)} /> : <Empty />}</PageShell>;
}
