import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import RegistrationPopup from "@/components/RegistrationPopup";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vtuupdates.techmiyaedtech.com"),
  title: {
    default: "VTU Updates 2026 | Results, Time Table, Syllabus & Notifications",
    template: "%s | VTU Updates 2026",
  },
  description:
    "Get the latest VTU updates, Visvesvaraya Technological University results, exam timetables, syllabus, question papers, notifications, academic updates, and student resources.",
  keywords: [
    "VTU Updates",
    "VTU Results 2026",
    "VTU Notifications",
    "VTU Time Table 2026",
    "VTU Exam Updates",
    "VTU Syllabus",
    "VTU Question Papers",
    "Visvesvaraya Technological University Updates",
    "VTU Results Latest News",
    "VTU Exam Time Table",
    "VTU Circulars and Notifications",
    "VTU Academic Calendar",
    "VTU Previous Year Question Papers",
    "VTU CBCS Syllabus",
    "VTU Engineering Results",
    "VTU Revaluation Results",
    "VTU Results Karnataka",
    "VTU Exam Notifications",
    "VTU Student Updates",
    "VTU Important Questions",
    "VTU Model Question Papers",
    "VTU Semester Results",
    "VTU Exam Preparation Resources",
    "Latest VTU updates for engineering students",
    "How to check VTU results online",
    "VTU semester exam timetable 2026",
    "Latest VTU exam notifications and circulars",
    "VTU previous year question papers with answers",
    "VTU engineering syllabus and study materials",
    "Visvesvaraya Technological University latest updates",
    "VTU results and academic notifications for students",
    "TechMiya EdTech",
    "VTUConnect",
  ],
  authors: [{ name: "TechMiya EdTech", url: "https://techmiyaedtech.com" }],
  creator: "TechMiya EdTech",
  publisher: "TechMiya EdTech",
  alternates: {
    canonical: "https://vtuupdates.techmiyaedtech.com/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vtuupdates.techmiyaedtech.com/",
    siteName: "VTU Updates — TechMiya EdTech",
    title: "VTU Updates 2026 | Results, Time Table, Syllabus & Notifications",
    description:
      "Get the latest VTU updates, Visvesvaraya Technological University results, exam timetables, syllabus, question papers, notifications, academic updates, and student resources.",
    images: [
      {
        url: "/images/techmiyaedtech_new_logo.png",
        width: 1200,
        height: 630,
        alt: "VTU Updates 2026 - Visvesvaraya Technological University Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VTU Updates 2026 | Results, Time Table, Syllabus & Notifications",
    description:
      "Get the latest VTU updates, Visvesvaraya Technological University results, exam timetables, syllabus, question papers, notifications, academic updates, and student resources.",
    images: ["/images/techmiyaedtech_new_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VTU Updates",
  alternateName: [
    "VTUConnect",
    "VTU Student Portal",
    "VTU Updates 2026",
    "Visvesvaraya Technological University Updates",
  ],
  url: "https://vtuupdates.techmiyaedtech.com/",
  description:
    "Get the latest VTU updates, Visvesvaraya Technological University results, exam timetables, syllabus, question papers, notifications, academic updates, and student resources.",
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    name: "TechMiya EdTech",
    url: "https://techmiyaedtech.com/",
    logo: "https://vtuupdates.techmiyaedtech.com/images/techmiyaedtech_new_logo.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechMiya EdTech",
  url: "https://techmiyaedtech.com/",
  logo: "https://vtuupdates.techmiyaedtech.com/images/techmiyaedtech_new_logo.png",
  description:
    "Educational technology platform providing academic updates, student resources, internships, and curriculum notes.",
  sameAs: [
    "https://techmiyaedtech.com/",
    "https://vtu.internyet.in/companies/techmiya-solutions-private-limited",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AnalyticsProvider />
        {children}
        <RegistrationPopup />
      </body>
    </html>
  );
}
