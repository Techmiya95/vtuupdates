import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VTU First Year Updates 2026 | Semester 1 & 2 Syllabus, Notes & Circulars",
  description:
    "Get latest VTU first year updates for Semester 1 and Semester 2 (Physics & Chemistry cycles). Access syllabus, exam timetables, circulars, and study resources.",
  keywords: [
    "VTU First Year",
    "VTU 1st Year Updates",
    "VTU Semester 1",
    "VTU Semester 2",
    "VTU Physics Cycle",
    "VTU Chemistry Cycle",
    "VTU Syllabus",
    "VTU Time Table 2026",
    "VTU Circulars",
    "VTU Engineering Results",
    "VTU Question Papers",
  ],
  alternates: {
    canonical: "https://vtuupdates.techmiyaedtech.com/first-year/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vtuupdates.techmiyaedtech.com/first-year/",
    siteName: "VTU Updates — TechMiya EdTech",
    title: "VTU First Year Updates 2026 | Semester 1 & 2 Syllabus, Notes & Circulars",
    description:
      "Get latest VTU first year updates for Semester 1 and Semester 2 (Physics & Chemistry cycles). Access syllabus, exam timetables, circulars, and study resources.",
    images: [
      {
        url: "/images/techmiyaedtech_new_logo.png",
        width: 1200,
        height: 630,
        alt: "VTU First Year Updates - TechMiya EdTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VTU First Year Updates 2026 | Semester 1 & 2 Syllabus, Notes & Circulars",
    description:
      "Get latest VTU first year updates for Semester 1 and Semester 2. Access syllabus, exam timetables, circulars, and study resources.",
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
      "name": "First Year Updates",
      "item": "https://vtuupdates.techmiyaedtech.com/first-year/",
    },
  ],
};

export default function FirstYearLayout({
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
