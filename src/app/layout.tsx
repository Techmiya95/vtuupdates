import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "VTUConnect — VTU Student Updates & Study Materials Portal",
  description:
    "Stay updated with real-time VTU notifications. Access notes, question papers and study materials for CSE, ISE, ECE, EEE, ME and CE — organised by year, scheme and semester.",
  keywords: "VTU, VTU notes, VTU updates, VTU results, engineering study materials, VTU portal",
  openGraph: {
    title: "VTUConnect — VTU Student Portal",
    description: "Real-time VTU notifications and semester-wise study materials",
    type: "website",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
