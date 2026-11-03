import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | VTU Updates & Study Materials Management",
  description: "TechMiya EdTech Admin Portal to manage VTU subjects, schemes, and upload study notes directly to Google Drive.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

