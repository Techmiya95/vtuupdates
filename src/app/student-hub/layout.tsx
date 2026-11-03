import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VTU Study Hub | Free Engineering Notes, Syllabus & Question Papers 2026",
  description:
    "Access VTU notes, syllabus, model question papers, and study materials for CSE, ISE, ECE, EEE, ME, and CE across 2025, 2022, 2021, and 2018 schemes.",
  keywords: [
    "VTU Study Hub",
    "VTU Notes",
    "VTU Engineering Notes",
    "VTU Question Papers",
    "VTU Model Question Papers",
    "VTU CBCS Syllabus",
    "VTU CSE Notes",
    "VTU ECE Notes",
    "VTU Mechanical Notes",
    "VTU Civil Notes",
    "VTU 2025 Scheme",
    "VTU 2022 Scheme",
    "VTU Study Materials",
  ],
  alternates: {
    canonical: "https://vtuupdates.techmiyaedtech.com/student-hub/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vtuupdates.techmiyaedtech.com/student-hub/",
    siteName: "VTU Updates — TechMiya EdTech",
    title: "VTU Study Hub | Free Engineering Notes, Syllabus & Question Papers 2026",
    description:
      "Access VTU notes, syllabus, model question papers, and study materials for CSE, ISE, ECE, EEE, ME, and CE across 2025, 2022, 2021, and 2018 schemes.",
    images: [
      {
        url: "/images/techmiyaedtech_new_logo.png",
        width: 1200,
        height: 630,
        alt: "VTU Study Hub - Free Engineering Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VTU Study Hub | Free Engineering Notes, Syllabus & Question Papers 2026",
    description:
      "Access VTU notes, syllabus, model question papers, and study materials for engineering branches.",
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
      "name": "VTU Study Hub",
      "item": "https://vtuupdates.techmiyaedtech.com/student-hub/",
    },
  ],
};

const educationalSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalWebPage",
  name: "VTU Study Hub — Notes, Syllabus & Study Materials",
  description:
    "Curated VTU notes and module materials for engineering branches across all academic years and syllabus schemes.",
  url: "https://vtuupdates.techmiyaedtech.com/student-hub/",
  provider: {
    "@type": "Organization",
    name: "TechMiya EdTech",
    url: "https://techmiyaedtech.com/",
  },
};

export default function StudentHubLayout({
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
      />
      {children}
    </>
  );
}
