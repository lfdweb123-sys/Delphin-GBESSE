import PageShell from "@/components/PageShell";
import Gallery from "@/components/Gallery";
import { Empty } from "@/components/Cards";
import { getPublic, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { GalleryItem } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("galerie", "/galerie");

export default async function Page() {
  const [t, items] = await Promise.all([getTexts(), getPublic<GalleryItem>("gallery")]);
  return <PageShell title={t.p_galerie_title} intro={t.p_galerie_intro} banner={t.p_galerie_banner}>{items.length ? <Gallery items={items} /> : <Empty />}</PageShell>;
}
