import PageShell from "@/components/PageShell";
import FeatureList from "@/components/FeatureList";
import { Empty } from "@/components/Cards";
import { aboutItems } from "@/lib/about";
import { getProfile, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("apropos", "/a-propos");

export default async function Page() {
  const [t, profile] = await Promise.all([getTexts(), getProfile()]);
  const items = aboutItems(profile, t, profile?.name || "Delphin GBESSE");
  return <PageShell title={t.p_apropos_title} intro={t.p_apropos_intro} banner={t.p_apropos_banner}>{items.length ? <FeatureList items={items} /> : <Empty />}</PageShell>;
}
