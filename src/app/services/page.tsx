import PageShell from "@/components/PageShell";
import { Empty } from "@/components/Cards";
import { AchievementFeatures, ServiceList } from "@/components/FeatureList";
import { byOrder, getPublic, getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { Achievement, Activity } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("services", "/services");

/** Repère les conteplaqués dans la collection « achievements » (titre contenant « conteplaqué » ou « contreplaqué »). */
const isConteplaque = (a: Achievement) => /con(?:tre|te)plaqu/i.test(a.title);

export default async function Page() {
  const [t, services, materiels] = await Promise.all([
    getTexts(),
    getPublic<Activity>("activities"),
    getPublic<Achievement>("achievements"),
  ]);

  const vedettes = [...materiels].filter(isConteplaque).sort(byOrder).slice(0, 2);
  const hasServices = services.length > 0;

  return (
    <PageShell title={t.p_services_title} intro={t.p_services_intro} banner={t.p_services_banner}>
      {vedettes.length || hasServices ? (
        <div className="space-y-16">
          {vedettes.length > 0 && (
            <section>
              <h2 className="mb-8 font-serif text-2xl font-semibold sm:text-3xl">Les plus vendus</h2>
              <AchievementFeatures items={vedettes} />
            </section>
          )}
          {hasServices && (
            <section>
              <h2 className="mb-8 font-serif text-2xl font-semibold sm:text-3xl">{t.p_services_title}</h2>
              <ServiceList items={[...services].sort(byOrder)} />
            </section>
          )}
        </div>
      ) : (
        <Empty />
      )}
    </PageShell>
  );
}
