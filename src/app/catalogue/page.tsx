import PageShell from "@/components/PageShell";
import CatalogueViewer from "@/components/CatalogueViewer";
import { getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("catalogue", "/catalogue");

export default async function Page() {
  const t = await getTexts();
  return (
    <PageShell title={t.p_catalogue_title} intro={t.p_catalogue_intro} banner={t.p_catalogue_banner}>
      <CatalogueViewer />
    </PageShell>
  );
}
