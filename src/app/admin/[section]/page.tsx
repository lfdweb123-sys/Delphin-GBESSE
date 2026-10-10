"use client";
import { notFound } from "next/navigation";
import { CollectionManager, SingleEditor } from "@/components/admin/Manager";
import { SECTIONS } from "@/lib/admin-config";

export default function AdminSection({ params }: { params: { section: string } }) {
  const section = SECTIONS.find((s) => s.slug === params.section);
  if (!section) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl font-semibold">{section.label}</h1>
      {section.single ? <SingleEditor key={section.slug} section={section} /> : <CollectionManager key={section.slug} section={section} />}
    </div>
  );
}
