import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VTU Second Year Updates 2026 | Semester 3 & 4 Syllabus, Time Table & Notes",
  description:
    "Find VTU second year updates for Semester 3 and Semester 4. Download engineering notes, syllabus, exam timetables, circulars, and branch notifications.",
  keywords: [
    "VTU Second Year",
    "VTU 2nd Year Updates",
    "VTU Semester 3",
    "VTU Semester 4",
    "VTU Engineering Results",
    "VTU Time Table 2026",
    "VTU CBCS Syllabus",
    "VTU Circulars",
    "VTU Question Papers",
    "VTU Model Question Papers",
  ],
  alternates: {
    canonical: "https://vtuupdates.techmiyaedtech.com/second-year/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vtuupdates.techmiyaedtech.com/second-year/",
    siteName: "VTU Updates — TechMiya EdTech",
    title: "VTU Second Year Updates 2026 | Semester 3 & 4 Syllabus, Time Table & Notes",
    description:
      "Find VTU second year updates for Semester 3 and Semester 4. Download engineering notes, syllabus, exam timetables, circulars, and branch notifications.",
    images: [
      {
        url: "/images/techmiyaedtech_new_logo.png",
        width: 1200,
        height: 630,
        alt: "VTU Second Year Updates - TechMiya EdTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VTU Second Year Updates 2026 | Semester 3 & 4 Syllabus, Time Table & Notes",
    description:
      "Find VTU second year updates for Semester 3 and Semester 4. Download engineering notes, syllabus, and exam timetables.",
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
      "name": "Second Year Updates",
      "item": "https://vtuupdates.techmiyaedtech.com/second-year/",
    },
  ],
};

export default function SecondYearLayout({
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
