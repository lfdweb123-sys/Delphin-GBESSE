import Link from "next/link";
import { getTexts } from "@/lib/data";

export default async function NotFound() {
  const t = await getTexts();
  return <div className="container-x py-24 text-center"><h1 className="font-serif text-4xl font-semibold">{t.nf_title}</h1><p className="mt-3 text-muted">{t.nf_text}</p><Link href="/" className="btn btn-primary mt-8">{t.nf_button}</Link></div>;
}
