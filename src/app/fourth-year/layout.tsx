import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VTU Fourth Year Updates 2026 | Semester 7 & 8 Notes, Placement & Exam Alerts",
  description:
    "Latest VTU fourth year updates for Semester 7 and Semester 8 engineering students. Access final year circulars, exam notifications, project guidelines, and results.",
  keywords: [
    "VTU Fourth Year",
    "VTU 4th Year Updates",
    "VTU Semester 7",
    "VTU Semester 8",
    "VTU Final Year Project",
    "VTU Results 2026",
    "VTU Placements",
    "VTU Circulars",
    "VTU Engineering Results",
    "VTU Exam Time Table",
  ],
  alternates: {
    canonical: "https://vtuupdates.techmiyaedtech.com/fourth-year/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vtuupdates.techmiyaedtech.com/fourth-year/",
    siteName: "VTU Updates — TechMiya EdTech",
    title: "VTU Fourth Year Updates 2026 | Semester 7 & 8 Notes, Placement & Exam Alerts",
    description:
      "Latest VTU fourth year updates for Semester 7 and Semester 8 engineering students. Access final year circulars, exam notifications, project guidelines, and results.",
    images: [
      {
        url: "/images/techmiyaedtech_new_logo.png",
        width: 1200,
        height: 630,
        alt: "VTU Fourth Year Updates - TechMiya EdTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VTU Fourth Year Updates 2026 | Semester 7 & 8 Notes, Placement & Exam Alerts",
    description:
      "Latest VTU fourth year updates for Semester 7 and Semester 8 engineering students.",
    images: ["/images/techmiyaedtech_new_logo.png"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://vtuupdates.techmiyaedtech.com/",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Fourth Year Updates",
      "item": "https://vtuupdates.techmiyaedtech.com/fourth-year/",
    },
  ],
};

export default function FourthYearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
