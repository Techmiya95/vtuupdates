
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const notices = [
  {
    id: 1,
    title: "Welcome to the Third Year Updates Portal",
    category: "General",
    semester: "All semesters",
    date: "Portal information",
    description:
      "Find academic announcements relevant to Third Year students. Official notices will be listed after their sources are checked.",
    source: "https://vtu.ac.in/",
  },
  {
    id: 2,
    title: "Check official examination announcements",
    category: "Examinations",
    semester: "Semester 5",
    date: "Official source",
    description:
      "Check the official VTU website for examination timetables, application instructions and circulars applicable to your semester.",
    source: "https://vtu.ac.in/",
  },
  {
    id: 3,
    title: "Review academic circulars for Semester 6",
    category: "Academics",
    semester: "Semester 6",
    date: "Official source",
    description:
      "Review official academic circulars for relevant schedules, instructions and student announcements.",
    source: "https://vtu.ac.in/",
  },
];

const categories = ["All", "Examinations", "Academics", "General"];
const semesters = ["All semesters", "Semester 5", "Semester 6"];

export default function SecondYearPage() {
  const [category, setCategory] = useState("All");
  const [semester, setSemester] = useState("All semesters");
  const [search, setSearch] = useState("");

  const filteredNotices = useMemo(() => {
    const term = search.trim().toLowerCase();

    return notices.filter((notice) => {
      const matchesCategory =
        category === "All" || notice.category === category;

      const matchesSemester =
        semester === "All semesters" ||
        notice.semester === "All semesters" ||
        notice.semester === semester;

      const matchesSearch =
        !term ||
        `${notice.title} ${notice.description} ${notice.category}`
          .toLowerCase()
          .includes(term);

      return matchesCategory && matchesSemester && matchesSearch;
    });
  }, [category, semester, search]);

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <a
              href="https://techmiyaedtech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black p-1 shadow-sm transition hover:scale-105 hover:ring-2 hover:ring-amber-400 cursor-pointer"
              title="Visit TechMiya EdTech"
            >
              <img
                src="/images/techmiyaedtech_new_logo.png"
                alt="TechMiya EdTech"
                className="h-full w-full object-contain"
              />
            </a>
            <div>
              <Link
                href="/"
                className="text-lg font-extrabold text-slate-900 hover:text-blue-900 transition block"
              >
                VTUConnect
              </Link>
              <a
                href="https://techmiyaedtech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-900 hover:underline hover:text-amber-600 transition inline-flex items-center gap-1"
                title="Visit TechMiya EdTech"
              >
                TechMiya EdTech <span className="text-[9px]">↗</span>
              </a>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
          >
            ← Home
          </Link>
        </div>
      </header>

      <section className="bg-[#102a56] text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
            Student updates
          </p>
          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
            Third Year
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-blue-100/80">
            Find relevant academic announcements for Semesters 5 and 6.
            Filter notices to focus on the information you need.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              Semester 5
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              Semester 6
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-800">
              Notice board
            </p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
              Third year announcements
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              These are demonstration entries, not confirmed current VTU
              announcements.
            </p>
          </div>
          <a
            href="https://vtu.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-blue-800 hover:text-blue-600"
          >
            Visit official VTU website ↗
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_200px]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Search notices
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search examinations, academics..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Filter by semester
            </span>
            <select
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              {semesters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-[#102a56] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Showing {filteredNotices.length}{" "}
          {filteredNotices.length === 1 ? "notice" : "notices"}
        </p>

        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          {filteredNotices.map((notice) => (
            <article
              key={notice.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                  {notice.category}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {notice.semester}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold leading-snug">
                {notice.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {notice.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500">{notice.date}</span>
                <a
                  href={notice.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-blue-800 hover:text-blue-600"
                >
                  Check official source ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-lg font-bold">No matching notices</h3>
            <p className="mt-2 text-sm text-slate-600">
              Try a different search term or change the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSemester("All semesters");
              }}
              className="mt-4 rounded-lg bg-[#102a56] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h3 className="font-bold text-[#102a56]">
            Important: verify every announcement
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This page currently uses sample entries to demonstrate the layout
            and filters. Check the original official circular for confirmed
            dates, eligibility and instructions.
          </p>
          <a
            href="https://vtu.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-bold text-blue-800 hover:text-blue-600"
          >
            Open VTU official website ↗
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold text-slate-800">VTUConnect</span>
          <span>
            Independent student information portal · Not an official VTU website
          </span>
        </div>
      </footer>
    </main>
  );
}
