import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import RegistrationPopup from "@/components/RegistrationPopup";
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
  title: "VTUConnect — TechMiya EdTech | VTU Student Updates & Study Materials Portal",
  description:
    "Stay updated with real-time VTU notifications. Access notes, question papers and study materials for CSE, ISE, ECE, EEE, ME and CE — organised by year, scheme and semester.",
  keywords: "VTU, VTU notes, VTU updates, VTU results, engineering study materials, VTU portal, TechMiya EdTech",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "VTUConnect — TechMiya EdTech",
    description: "Real-time VTU notifications and semester-wise study materials",
    type: "website",
    images: ["/images/techmiyaedtech_new_logo.png"],
  },
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
      <body className="min-h-full flex flex-col">
        {children}
        <RegistrationPopup />
      </body>
    </html>
  );
}
