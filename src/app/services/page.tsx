import PageShell from "@/components/PageShell";
import { Empty, ServiceCard } from "@/components/Cards";
import { byOrder, getPublic, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { Activity } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("services", "/services");

export default async function Page() {
  const [t, items] = await Promise.all([getTexts(), getPublic<Activity>("activities")]);
  return (
    <PageShell title={t.p_services_title} intro={t.p_services_intro} banner={t.p_services_banner}>
      {items.length ? <div className="grid gap-6">{[...items].sort(byOrder).map((s) => <ServiceCard key={s.id} s={s} />)}</div> : <Empty />}
    </PageShell>
  );
}
