"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import StudentHub from "./student-hub/StudentHub";

interface VtuNotice {
  title: string;
  url: string;
  date: string;
  category: string;
}

// Category → accent colour mapping
const CATEGORY_COLOURS: Record<string, string> = {
  RESULTS: "text-green-300",
  EXAMINATIONS: "text-yellow-300",
  ADMISSIONS: "text-cyan-300",
  SCHOLARSHIPS: "text-pink-300",
  TENDERS: "text-orange-300",
  CIRCULARS: "text-amber-300",
  NOTIFICATIONS: "text-amber-300",
  RESEARCH: "text-purple-300",
  "ACADEMIC CALENDAR": "text-sky-300",
  SYLLABUS: "text-indigo-300",
  AFFILIATION: "text-teal-300",
  PLACEMENTS: "text-lime-300",
  CONVOCATION: "text-rose-300",
  HOLIDAY: "text-red-300",
  ADMINISTRATION: "text-blue-200",
};

const FALLBACK_NOTICES: VtuNotice[] = [
  {
    title: "Academic calendar notification",
    url: "https://vtu.ac.in/en/category/administration/",
    category: "ACADEMICS",
    date: "Official notice",
  },
  {
    title: "Examination timetable updates",
    url: "https://vtu.ac.in/en/category/administration/",
    category: "EXAMINATIONS",
    date: "Official notice",
  },
  {
    title: "Results and revaluation announcements",
    url: "https://vtu.ac.in/en/category/administration/",
    category: "RESULTS",
    date: "Official notice",
  },
  {
    title: "Important student circulars",
    url: "https://vtu.ac.in/en/category/administration/",
    category: "CIRCULARS",
    date: "Official notice",
  },
  {
    title: "Research & PhD notifications",
    url: "https://vtu.ac.in/en/category/administration/",
    category: "RESEARCH",
    date: "Official notice",
  },
  {
    title: "Affiliation & admission notices",
    url: "https://vtu.ac.in/en/category/administration/",
    category: "ADMISSIONS",
    date: "Official notice",
  },
];

const CORS_PROXY = "https://api.allorigins.win/get?url=";
const VTU_ADMIN_URL = "https://vtu.ac.in/en/category/administration/";
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function categorise(title: string): string {
  const t = title.toUpperCase();
  if (t.includes("RESULT") || t.includes("REVALUATION") || t.includes("MARKS")) return "RESULTS";
  if (t.includes("EXAM") || t.includes("TIME TABLE") || t.includes("TIMETABLE") || t.includes("HALL TICKET")) return "EXAMINATIONS";
  if (t.includes("ADMISSION") || t.includes("COUNSELLING")) return "ADMISSIONS";
  if (t.includes("SCHOLARSHIP") || t.includes("FELLOWSHIP")) return "SCHOLARSHIPS";
  if (t.includes("TENDER")) return "TENDERS";
  if (t.includes("CIRCULAR")) return "CIRCULARS";
  if (t.includes("NOTIFICATION")) return "NOTIFICATIONS";
  if (t.includes("PH.D") || t.includes("PHD") || t.includes("RESEARCH")) return "RESEARCH";
  if (t.includes("CALENDAR") || t.includes("SCHEDULE")) return "ACADEMIC CALENDAR";
  if (t.includes("SYLLABUS") || t.includes("SCHEME")) return "SYLLABUS";
  if (t.includes("AFFILIATION")) return "AFFILIATION";
  if (t.includes("PLACEMENT") || t.includes("INTERNSHIP")) return "PLACEMENTS";
  if (t.includes("CONVOCATION")) return "CONVOCATION";
  if (t.includes("HOLIDAY") || t.includes("VACATION")) return "HOLIDAY";
  return "ADMINISTRATION";
}

function parseNotices(html: string): VtuNotice[] {
  const notices: VtuNotice[] = [];
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const h2Re = /<h2[^>]*>\s*<a\s+href="(https:\/\/vtu\.ac\.in\/en\/(\d{4})\/(\d{2})\/[^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h2>/gi;
  let match: RegExpExecArray | null;
  while ((match = h2Re.exec(html)) !== null) {
    const rawTitle = match[4].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#8211;/g, "–").replace(/&#8230;/g, "…").replace(/\s+/g, " ").trim();
    if (!rawTitle || rawTitle.length < 5) continue;
    const monthIdx = parseInt(match[3], 10) - 1;
    notices.push({ title: rawTitle, url: match[1], date: `${monthNames[monthIdx] ?? match[3]} ${match[2]}`, category: categorise(rawTitle) });
  }

  // De-duplicate
  const seen = new Set<string>();
  return notices.filter((n) => { if (seen.has(n.url)) return false; seen.add(n.url); return true; });
}

export default function Home() {
  const [notices, setNotices] = useState<VtuNotice[]>(FALLBACK_NOTICES);
  const [isLive, setIsLive] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadUpdates = useCallback(async () => {
    try {
      const res = await fetch(
        `${CORS_PROXY}${encodeURIComponent(VTU_ADMIN_URL)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Proxy error");
      const data = await res.json();
      const html: string = data.contents ?? "";
      if (!html) throw new Error("Empty HTML");

      const parsed = parseNotices(html);
      if (parsed.length > 0) {
        setNotices(parsed.slice(0, 20));
        setIsLive(true);
        setFetchError(false);
        setLastFetched(new Date());
      } else {
        throw new Error("No notices parsed");
      }
    } catch {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUpdates();
    const timer = setInterval(loadUpdates, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [loadUpdates]);


  // Duplicate for seamless ticker loop
  const tickerItems = [...notices, ...notices];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* NAVIGATION */}
      <header className="relative z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[86px] max-w-[1500px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 sm:gap-4"
            aria-label="VTUConnect homepage"
          >
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 border border-slate-200 shadow-sm">
              <img
                src="/logos/vtu-logo.png"
                alt="Visvesvaraya Technological University logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black p-1 shadow-sm">
              <img
                src="/images/techmiyaedtech_new_logo.png"
                alt="TechMiya EdTech logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight sm:text-2xl text-slate-900">
                VTUConnect
              </div>
              <div className="text-xs font-semibold text-blue-900 sm:text-sm">
                TechMiya EdTech
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-6 lg:gap-10">
            <a
              href="https://results.vtu.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold transition hover:text-blue-700 sm:text-lg"
            >
              Results
            </a>
            <a
              href="https://vtu.internyet.in/companies/techmiya-solutions-private-limited"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold transition hover:text-blue-700 sm:text-lg"
            >
              Internship
            </a>
            <a
              href="https://vtu.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold shadow-sm transition hover:border-blue-300 hover:bg-slate-50 sm:inline-flex"
            >
              Official VTU <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>

      {/* NAVY BLUE HERO */}
      <section className="relative overflow-hidden bg-[#102c59] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 h-[440px] w-[440px] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-[310px] w-[310px] rounded-full border border-white/10"
        />

        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 pb-20 pt-8 sm:px-8 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-10">
          {/* LEFT */}
          <div className="relative z-10 flex flex-col items-start">
            <p className="mb-8 text-xs font-extrabold tracking-[0.22em] text-blue-200 sm:text-sm">
              YOUR ACADEMIC COMPANION
            </p>
            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Stay updated.
              <br />
              Stay ahead.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg sm:leading-9">
              Welcome to VTUConnect, a student information portal designed to
              help you find academic announcements, examination updates, and
              important information according to your engineering year.
            </p>
            <div className="mt-8 flex flex-col gap-2">
              <p className="flex items-center gap-3 text-base font-semibold text-white sm:text-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-300 text-blue-200">
                  ↓
                </span>
                Scroll down to explore your year
              </p>
              <p className="pl-[52px] text-sm leading-6 text-blue-200 sm:text-base">
                Find academic updates, exam notices, results and more.
              </p>
            </div>
            <p className="mt-6 text-xs leading-6 text-blue-200 sm:text-sm">
              An independent student portal, not an official VTU website.
            </p>
          </div>

          {/* RIGHT: LIVE NOTICE TICKER */}
          <div className="relative z-10 min-w-0" aria-label="Live VTU notices">
            {/* Header row */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-blue-200">
                  STAY INFORMED
                </p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Latest updates
                </h2>
              </div>

              {/* Live / loading / error badge */}
              {isLoading ? (
                <span className="flex shrink-0 animate-pulse items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-100">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Loading…
                </span>
              ) : isLive ? (
                <span className="flex shrink-0 items-center gap-2 rounded-full border border-green-400/40 bg-green-500/20 px-3 py-2 text-xs font-semibold text-green-200">
                  <span className="live-dot h-2 w-2 rounded-full bg-green-400" />
                  LIVE from VTU
                </span>
              ) : (
                <span className="flex shrink-0 items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Preview mode
                </span>
              )}
            </div>

            {/* Ticker window */}
            <div className="ticker-window relative h-[390px] overflow-hidden rounded-2xl">
              <div
                className="ticker-track flex flex-col gap-4"
                style={{ animationDuration: `${Math.max(notices.length * 3, 32)}s` }}
              >
                {tickerItems.map((notice, index) => (
                  <article key={`${notice.url}-${index}`}>
                    <a
                      href={notice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl border border-white/15 bg-white/[0.08] p-5 shadow-lg backdrop-blur-sm transition hover:bg-white/[0.15] hover:border-white/30 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base transition group-hover:bg-white/20">
                          ↗
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[10px] font-extrabold tracking-[0.16em] ${
                              CATEGORY_COLOURS[notice.category] ??
                              "text-amber-300"
                            }`}
                          >
                            {notice.category}
                          </p>
                          <h3 className="mt-2 text-sm font-semibold leading-6 text-white line-clamp-2 sm:text-base">
                            {notice.title}
                          </h3>
                          <p className="mt-2 text-xs text-blue-300">
                            {notice.date}
                          </p>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </div>

            {/* Footer meta */}
            <div className="mt-4 flex items-center justify-between gap-3">
              {isLive && lastFetched ? (
                <p className="text-xs text-blue-300">
                  ✓ Live data from{" "}
                  <a
                    href="https://vtu.ac.in/en/category/administration/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    vtu.ac.in
                  </a>{" "}
                  · updated{" "}
                  {lastFetched.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              ) : fetchError ? (
                <p className="text-xs text-amber-300">
                  ⚠ Could not reach VTU. Showing preview cards.{" "}
                  <button
                    onClick={loadUpdates}
                    className="ml-1 underline hover:text-white"
                  >
                    Retry
                  </button>
                </p>
              ) : (
                <p className="text-xs text-blue-200">
                  Auto-refreshes every 5 minutes.
                </p>
              )}

              <a
                href="https://vtu.ac.in/en/category/administration/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-blue-100 transition hover:border-white/40 hover:bg-white/10"
              >
                View all ↗
              </a>
            </div>

            {/* Logo collaboration row */}
            <div className="mt-6 flex flex-col items-center justify-center py-4">
              <div className="mt-4 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
                <div className="flex h-36 w-50 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-3">
                  <img
                    src="/logos/vtu-logo.png"
                    alt="Visvesvaraya Technological University logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-2xl font-light text-blue-200">×</span>
                <div className="flex h-36 w-72 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black p-3 shadow-md">
                  <img
                    src="/images/techmiyaedtech_new_logo.png"
                    alt="TechMiya EdTech — Tech for People"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-slate-800">VTUConnect</p>
          <p>An independent student portal, not an official VTU website.</p>
          <a
            href="https://vtu.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-blue-800 hover:underline"
          >
            Visit official VTU ↗
          </a>
        </div>
      </footer>

      {/* TICKER + LIVE ANIMATION */}
      <style jsx>{`
        .ticker-track {
          animation: scroll-notices var(--ticker-dur, 40s) linear infinite;
        }
        .ticker-window:hover .ticker-track {
          animation-play-state: paused;
        }
        @keyframes scroll-notices {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .live-dot {
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
          .live-dot     { animation: none; }
        }
      `}</style>

      <StudentHub embedded />
    </main>
  );
}
