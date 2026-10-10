import PageShell from "@/components/PageShell";
import { EventCard, Empty } from "@/components/Cards";
import { byDateAsc, byDateDesc, eventPhase, getPublic, getTexts, siteUrl } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";
import type { EventItem } from "@/types";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("evenements", "/evenements");

export default async function Page() {
  const [t, all] = await Promise.all([getTexts(), getPublic<EventItem>("events")]);
  const groups = [
    { label: t.ev_upcoming, items: all.filter((e) => eventPhase(e) === "upcoming").sort(byDateAsc) },
    { label: t.ev_current, items: all.filter((e) => eventPhase(e) === "current").sort(byDateAsc) },
    { label: t.ev_past, items: all.filter((e) => eventPhase(e) === "past").sort(byDateDesc) },
  ].filter((g) => g.items.length);
  const ld = all.map((e) => ({
    "@context": "https://schema.org", "@type": "Event", name: e.title, startDate: e.date, ...(e.endDate ? { endDate: e.endDate } : {}),
    ...(e.description ? { description: e.description } : {}), ...(e.image ? { image: e.image } : {}),
    ...(e.location ? { location: { "@type": "Place", name: e.location } } : {}), url: `${siteUrl()}/evenements`,
  }));
  return (
    <PageShell title={t.p_evenements_title} intro={t.p_evenements_intro} banner={t.p_evenements_banner}>
      {ld.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
      {groups.length ? groups.map((g) => (
        <section key={g.label} className="mb-12">
          <h2 className="mb-5 font-serif text-2xl font-semibold">{g.label}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{g.items.map((e) => <EventCard key={e.id} e={e} />)}</div>
        </section>
      )) : <Empty />}
    </PageShell>
  );
}
