import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getTexts } from "@/lib/data";
import { pageMeta } from "@/lib/pagemeta";

export const revalidate = 60;
export const generateMetadata = () => pageMeta("collaboration", "/collaboration");

export default async function Page() {
  const t = await getTexts();
  const list = t.collab_list.split("\n").map((s) => s.trim()).filter(Boolean);
  return (
    <PageShell title={t.p_collaboration_title} intro={t.p_collaboration_intro} banner={t.p_collaboration_banner}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map((a) => <li key={a} className="card p-5 font-medium">{a}</li>)}</ul>
      <div className="mt-10"><Link href="/contact" className="btn btn-primary">{t.collab_contact_label}</Link></div>
    </PageShell>
  );
}
