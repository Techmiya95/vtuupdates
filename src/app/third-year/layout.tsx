import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VTU Third Year Updates 2026 | Semester 5 & 6 Notes, Time Table & Results",
  description:
    "Stay informed with VTU third year announcements for Semester 5 and Semester 6. Access branch notes, exam schedules, circulars, and internship updates.",
  keywords: [
    "VTU Third Year",
    "VTU 3rd Year Updates",
    "VTU Semester 5",
    "VTU Semester 6",
    "VTU Results 2026",
    "VTU Time Table 2026",
    "VTU CBCS Syllabus",
    "VTU Internships",
    "VTU Question Papers",
    "VTU Engineering Notes",
  ],
  alternates: {
    canonical: "https://vtuupdates.techmiyaedtech.com/third-year/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vtuupdates.techmiyaedtech.com/third-year/",
    siteName: "VTU Updates — TechMiya EdTech",
    title: "VTU Third Year Updates 2026 | Semester 5 & 6 Notes, Time Table & Results",
    description:
      "Stay informed with VTU third year announcements for Semester 5 and Semester 6. Access branch notes, exam schedules, circulars, and internship updates.",
    images: [
      {
        url: "/images/techmiyaedtech_new_logo.png",
        width: 1200,
        height: 630,
        alt: "VTU Third Year Updates - TechMiya EdTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VTU Third Year Updates 2026 | Semester 5 & 6 Notes, Time Table & Results",
    description:
      "Stay informed with VTU third year announcements for Semester 5 and Semester 6.",
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
      "name": "Third Year Updates",
      "item": "https://vtuupdates.techmiyaedtech.com/third-year/",
    },
  ],
};

export default function ThirdYearLayout({
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
