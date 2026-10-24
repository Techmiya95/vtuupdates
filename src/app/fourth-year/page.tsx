
"use client";

import { useMemo, useState } from "react";

const notices = [
  {
    id: 1,
    title: "Welcome to the Fourth Year Updates Portal",
    category: "General",
    semester: "All semesters",
    date: "Portal information",
    description:
      "Find academic announcements relevant to Fourth Year students. Official notices should be checked against their original sources.",
    source: "https://vtu.ac.in/",
  },
  {
    id: 2,
    title: "Check official examination announcements",
    category: "Examinations",
    semester: "Semester 7",
    date: "Official source",
    description:
      "Visit the official VTU website for examination timetables, circulars, application instructions, and updates relevant to Semester 7.",
    source: "https://vtu.ac.in/",
  },
  {
    id: 3,
    title: "Review academic circulars for Semester 8",
    category: "Academics",
    semester: "Semester 8",
    date: "Official source",
    description:
      "Check official academic circulars for final-semester schedules, instructions, and student announcements.",
    source: "https://vtu.ac.in/",
  },
];

const categories = [
  "All",
  "Examinations",
  "Academics",
  "General",
];

const semesters = [
  "All semesters",
  "Semester 7",
  "Semester 8",
];

export default function FourthYearPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [semester, setSemester] = useState("All semesters");

  const filteredNotices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notices.filter((notice) => {
      const matchesCategory =
        category === "All" || notice.category === category;

      const matchesSemester =
        semester === "All semesters" ||
        notice.semester === "All semesters" ||
        notice.semester === semester;

      const matchesSearch =
        !query ||
        notice.title.toLowerCase().includes(query) ||
        notice.description.toLowerCase().includes(query) ||
        notice.category.toLowerCase().includes(query) ||
        notice.semester.toLowerCase().includes(query);

      return (
        matchesCategory &&
        matchesSemester &&
        matchesSearch
      );
    });
  }, [search, category, semester]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f7f8fc] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#102a56] font-extrabold text-white">
              VTU
            </div>

            <div>
              <p className="text-xl font-extrabold">VTUConnect</p>
              <p className="text-sm text-slate-500">
                Student Updates Portal
              </p>
            </div>
          </a>

          <a
            href="/"
            className="shrink-0 rounded-xl border border-slate-200 px-4 py-3 font-semibold transition hover:bg-blue-50"
          >
            ← Home
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#102a56] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
            Student updates
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Fourth Year
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-blue-100 sm:text-lg">
            Find relevant academic announcements for Semesters 7 and 8.
            Filter notices to focus on the information you need.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Semester 7", "Semester 8"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSemester(item);
                  document
                    .getElementById("notice-board")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`rounded-full border px-5 py-2.5 font-medium transition ${
                  semester === item
                    ? "border-white bg-white text-[#102a56]"
                    : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notice board */}
      <section
        id="notice-board"
        className="mx-auto max-w-7xl scroll-mt-6 px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-800">
              Notice board
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Fourth-year announcements
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Demonstration entries only. These are not verified current VTU notices.
            </p>
          </div>

          <a
            href="https://vtu.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-bold text-blue-800 hover:text-blue-600"
          >
            Visit official VTU website ↗
          </a>
        </div>

        {/* Search and semester filter */}
        <div className="mt-8 grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <label
              htmlFor="notice-search"
              className="mb-2 block text-sm font-semibold"
            >
              Search notices
            </label>

            <input
              id="notice-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search examinations, academics..."
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-4 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="min-w-0">
            <label
              htmlFor="semester-filter"
              className="mb-2 block text-sm font-semibold"
            >
              Filter by semester
            </label>

            <select
              id="semester-filter"
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {semesters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full border px-5 py-2.5 font-semibold transition ${
                category === item
                  ? "border-[#102a56] bg-[#102a56] text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-7 text-sm text-slate-500" aria-live="polite">
          Showing {filteredNotices.length}{" "}
          {filteredNotices.length === 1 ? "notice" : "notices"}
        </p>

        {/* Notice cards */}
        {filteredNotices.length > 0 ? (
          <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-2">
            {filteredNotices.map((notice) => (
              <article
                key={notice.id}
                className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-800">
                    {notice.category}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
                    {notice.semester}
                  </span>
                </div>

                <h3 className="mt-6 break-words text-xl font-bold leading-8">
                  {notice.title}
                </h3>

                <p className="mt-3 break-words leading-7 text-slate-600">
                  {notice.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <span className="text-sm text-slate-500">
                    {notice.date}
                  </span>

                  <a
                    href={notice.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-800 hover:text-blue-600"
                  >
                    Check official source ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h3 className="text-lg font-bold">
              No notices found
            </h3>

            <p className="mt-2 text-slate-600">
              Try another search term or change your filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSemester("All semesters");
              }}
              className="mt-5 rounded-xl bg-[#102a56] px-5 py-3 font-semibold text-white hover:bg-blue-900"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span className="font-bold text-slate-800">VTUConnect</span>

          <span>
            Independent student information portal. Not an official VTU website.
          </span>

          <a
            href="https://vtu.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-800 hover:text-blue-600"
          >
            Official VTU website ↗
          </a>
        </div>
      </footer>
    </main>
  );
}
