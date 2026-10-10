import type { Metadata } from "next";
import AuthGuard from "@/components/admin/AuthGuard";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard><AdminShell>{children}</AdminShell></AuthGuard>;
}
