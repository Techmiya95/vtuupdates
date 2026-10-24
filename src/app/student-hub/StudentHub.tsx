"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SCHEMES, YEARS, BRANCHES, getSemesters, getSubjects } from "@/data/vtu-subjects";
import { getDriveLink } from "@/data/drive-links";
import { APP_CONFIG } from "@/config/app-config";
import RegistrationModal, { StudentData } from "./RegistrationModal";
import NotesPanel, { NoteLink } from "./NotesPanel";

interface Props {
  embedded?: boolean;
}

const BRANCH_ICONS: Record<string, string> = {
  "Computer Science and Engineering (CSE)": "💻",
  "Information Science and Engineering (ISE)": "🖥️",
  "Electronics and Communication Engineering (ECE)": "📡",
  "Electrical and Electronics Engineering (EEE)": "⚡",
  "Mechanical Engineering (ME)": "⚙️",
  "Civil Engineering (CE)": "🏗️",
  "Artificial Intelligence and Machine Learning (AIML)": "🤖",
  "Computer Science and Business Systems (CSBS)": "📊",
  "Electronics and Telecommunication Engineering (ETE)": "📶",
  "Industrial Engineering and Management (IEM)": "🏭",
};

const BRANCH_SHORT: Record<string, string> = {
  "Computer Science and Engineering (CSE)": "CSE",
  "Information Science and Engineering (ISE)": "ISE",
  "Electronics and Communication Engineering (ECE)": "ECE",
  "Electrical and Electronics Engineering (EEE)": "EEE",
  "Mechanical Engineering (ME)": "ME",
  "Civil Engineering (CE)": "CE",
  "Artificial Intelligence and Machine Learning (AIML)": "AIML",
  "Computer Science and Business Systems (CSBS)": "CSBS",
  "Electronics and Telecommunication Engineering (ETE)": "ETE",
  "Industrial Engineering and Management (IEM)": "IEM",
};

const YEAR_META: Record<string, { sems: string; color: string; bg: string }> = {
  "First Year":  { sems: "Sem 1 & 2", color: "#16a34a", bg: "#f0fdf4" },
  "Second Year": { sems: "Sem 3 & 4", color: "#1d4ed8", bg: "#eff6ff" },
  "Third Year":  { sems: "Sem 5 & 6", color: "#7c3aed", bg: "#f5f3ff" },
  "Fourth Year": { sems: "Sem 7 & 8", color: "#b45309", bg: "#fffbeb" },
};

export default function StudentHub({ embedded = false }: Props) {
  /* ── State ─────────────────────────────────────────────────────────── */
  const [selectedYear,     setSelectedYear]     = useState("Second Year");
  const [selectedScheme,   setSelectedScheme]   = useState("2025 Scheme");
  const [selectedBranch,   setSelectedBranch]   = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [isRegistered,     setIsRegistered]     = useState(false);

  const branchRef   = useRef<HTMLDivElement>(null);
  const semesterRef = useRef<HTMLDivElement>(null);
  const notesRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem("vtu_registered") === "true") setIsRegistered(true);
  }, []);

  /* ── Helpers ───────────────────────────────────────────────────────── */
  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  }

  /* ── Handlers ──────────────────────────────────────────────────────── */
  function pickYear(yr: string) {
    setSelectedYear(yr);
    setSelectedBranch("");
    setSelectedSemester("");
    scrollTo(branchRef);
  }

  function pickScheme(sc: string) {
    setSelectedScheme(sc);
    setSelectedSemester("");
  }

  function pickBranch(br: string) {
    setSelectedBranch(br);
    setSelectedSemester("");
    scrollTo(semesterRef);
  }

  function pickSemester(sem: string) {
    setSelectedSemester(sem);
    scrollTo(notesRef);
  }

  function handleRegistrationSuccess(_data: StudentData) {
    setIsRegistered(true);
    setShowRegistration(false);
  }

  /* ── Derived values ────────────────────────────────────────────────── */
  const semesters = selectedYear && selectedBranch
    ? getSemesters(
        selectedYear as Parameters<typeof getSemesters>[0],
        selectedBranch as Parameters<typeof getSemesters>[1],
      )
    : [];

  const subjects = selectedSemester
    ? getSubjects(selectedScheme, selectedYear, selectedBranch, selectedSemester)
    : [];

  /**
   * Build noteLinks by reading drive-links.ts directly (no Google Sheet fetch).
   * Each entry maps a subject code to its Google Drive subject folder URL.
   */
  const noteLinks: NoteLink[] = subjects
    .map((s) => {
      const link = getDriveLink(
        selectedScheme,
        selectedYear,
        selectedBranch,
        selectedSemester,
        s.code,
      );
      return link ? { subjectCode: s.code, folderLink: link } : null;
    })
    .filter((n): n is NoteLink => n !== null);

  /* ─────────────────────────────────────────────────────────────────── */
  return (
    <section
      id="student-hub"
      className={embedded ? "bg-[#f8f9fa]" : "min-h-screen bg-[#f8f9fa]"}
    >
      {!embedded && (
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black p-1 shadow-sm">
                <img
                  src="/images/techmiyaedtech_new_logo.png"
                  alt="TechMiya EdTech"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900">VTUConnect</p>
                <p className="text-xs font-semibold text-blue-900">TechMiya EdTech</p>
              </div>
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 text-slate-700"
            >
              ← Home
            </Link>
          </div>
        </header>
      )}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        style={{ background: "linear-gradient(135deg, #102c59 0%, #1a3d7a 100%)" }}
        className="px-5 py-5 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-[1500px] flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-blue-300 uppercase">VTU Study Hub</p>
            <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">Study Materials &amp; Notes</h2>
            <p className="mt-0.5 text-xs text-blue-200">Select your year → scheme → branch → semester → access notes</p>
          </div>
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-blue-200">
            {selectedYear && (
              <><span className="rounded bg-white/10 px-2 py-1">{selectedYear}</span><span className="text-blue-400">›</span></>
            )}
            {selectedScheme && (
              <span className="rounded bg-white/10 px-2 py-1">{selectedScheme}</span>
            )}
            {selectedBranch && (
              <><span className="text-blue-400">›</span><span className="rounded bg-white/10 px-2 py-1">{BRANCH_SHORT[selectedBranch] ?? selectedBranch}</span></>
            )}
            {selectedSemester && (
              <><span className="text-blue-400">›</span><span className="rounded bg-white/20 px-2 py-1 text-white">{selectedSemester}</span></>
            )}
          </div>
        </div>
      </div>

      {/* ── 3-Column Layout ────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1500px] flex gap-0 min-h-[calc(100vh-80px)]">

        {/* ══ LEFT SIDEBAR ══ */}
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-gray-200 bg-white"
          style={{ width: "220px", minWidth: "220px" }}
        >
          <div className="sticky top-0 h-screen overflow-y-auto">

            {/* Year section */}
            <div>
              <div className="bg-[#102c59] px-4 py-3">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">Engineering Year</p>
              </div>
              <nav>
                {YEARS.map((yr) => {
                  const meta     = YEAR_META[yr];
                  const isActive = selectedYear === yr;
                  return (
                    <button
                      key={yr}
                      id={`year-link-${yr.replace(/\s+/g, "-").toLowerCase()}`}
                      onClick={() => pickYear(yr)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-150 border-b border-gray-100"
                      style={{
                        background:  isActive ? meta.bg : "white",
                        borderLeft:  isActive ? `4px solid ${meta.color}` : "4px solid transparent",
                      }}
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold"
                        style={{ background: isActive ? meta.color : "#cbd5e1" }}
                      >
                        {isActive ? "●" : YEARS.indexOf(yr) + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold leading-tight truncate" style={{ color: isActive ? meta.color : "#374151" }}>
                          {yr}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight">{meta.sems}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Scheme section */}
            <div>
              <div className="bg-[#102c59] px-4 py-3 mt-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">Scheme / Curriculum</p>
              </div>
              <div className="p-3 space-y-1.5">
                {SCHEMES.map((sc) => {
                  const isActive = selectedScheme === sc;
                  return (
                    <button
                      key={sc}
                      id={`scheme-link-${sc.replace(/\s+/g, "-").toLowerCase()}`}
                      onClick={() => pickScheme(sc)}
                      className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-all duration-150"
                      style={{
                        background: isActive ? "#103a7c" : "#f1f5f9",
                        color:      isActive ? "white" : "#475569",
                      }}
                    >
                      <span className="text-base">📋</span>
                      <span>{sc}</span>
                      {isActive && <span className="ml-auto text-green-300 text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="bg-gray-100 px-4 py-2 mt-2 border-t border-gray-200">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Quick Links</p>
              </div>
              <div className="py-1">
                {[
                  { label: "VTU Results",  url: "https://results.vtu.ac.in/",    icon: "📊" },
                  { label: "VTU Official", url: "https://vtu.ac.in/",            icon: "🏛️" },
                  { label: "Syllabus",     url: "https://vtu.ac.in/en/category/syllabus-courses/", icon: "📚" },
                  { label: "Internships",  url: "https://vtu.internyet.in/companies/techmiya-solutions-private-limited", icon: "💼" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50"
                  >
                    <span>{l.icon}</span>
                    <span className="font-medium">{l.label}</span>
                    <span className="ml-auto text-gray-300 text-[10px]">↗</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ══ CENTRE COLUMN ══ */}
        <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 lg:px-8">

          {/* Mobile controls */}
          <div className="flex flex-wrap gap-3 mb-5 lg:hidden">
            <div className="flex gap-1.5 flex-wrap">
              {YEARS.map((yr) => {
                const meta = YEAR_META[yr];
                return (
                  <button
                    key={yr}
                    onClick={() => pickYear(yr)}
                    className="rounded-full border px-3 py-1.5 text-xs font-bold transition"
                    style={{
                      background:  selectedYear === yr ? meta.color : "white",
                      borderColor: selectedYear === yr ? meta.color : "#e2e8f0",
                      color:       selectedYear === yr ? "white" : "#475569",
                    }}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
            <select
              value={selectedScheme}
              onChange={(e) => pickScheme(e.target.value)}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              {SCHEMES.map((sc) => <option key={sc}>{sc}</option>)}
            </select>
          </div>

          {/* Branch list */}
          <div ref={branchRef}>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#102c59]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102c59] text-white text-sm font-bold">●</div>
              <div>
                <h3 className="text-base font-extrabold text-[#102c59]">Engineering Branches</h3>
                <p className="text-xs text-gray-400">{selectedYear} — {selectedScheme} — Click a branch to see semesters</p>
              </div>
            </div>

            <div className="space-y-1">
              {BRANCHES.map((br) => {
                const isActive = selectedBranch === br;
                return (
                  <button
                    key={br}
                    id={`branch-link-${BRANCH_SHORT[br]?.toLowerCase()}`}
                    onClick={() => pickBranch(br)}
                    className="w-full flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-150"
                    style={{
                      background:  isActive ? "#102c59" : "white",
                      borderColor: isActive ? "#102c59" : "#e5e7eb",
                      boxShadow:   isActive ? "0 4px 12px rgba(16,44,89,0.2)" : "none",
                    }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl transition-all duration-150"
                      style={{ background: isActive ? "rgba(255,255,255,0.15)" : "#f1f5f9" }}
                    >
                      {BRANCH_ICONS[br] ?? "🎓"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-tight truncate" style={{ color: isActive ? "white" : "#111827" }}>
                        {br.replace(/\(.*?\)/, "").trim()}
                      </p>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: isActive ? "#93c5fd" : "#6b7280" }}>
                        {BRANCH_SHORT[br]}
                      </p>
                    </div>
                    <span className="shrink-0 text-lg" style={{ color: isActive ? "white" : "#d1d5db" }}>
                      {isActive ? "✓" : "›"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Semester selection */}
          {selectedBranch && (
            <div ref={semesterRef} className="mt-8">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">◉</div>
                <div>
                  <h3 className="text-base font-extrabold text-blue-800">
                    Select Semester — <span className="text-blue-600">{BRANCH_SHORT[selectedBranch]}</span>
                  </h3>
                  <p className="text-xs text-gray-400">{selectedBranch} · {selectedYear}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {semesters.map((sem) => {
                  const isActive = selectedSemester === sem;
                  const isCycle  = sem.includes("Cycle");
                  return (
                    <button
                      key={sem}
                      id={`sem-btn-${sem.replace(/\s+/g, "-").toLowerCase()}`}
                      onClick={() => pickSemester(sem)}
                      className="flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[160px]"
                      style={{
                        background:  isActive ? "#1d4ed8" : "white",
                        borderColor: isActive ? "#1d4ed8" : "#e5e7eb",
                        color:       isActive ? "white" : "#374151",
                        boxShadow:   isActive ? "0 4px 14px rgba(29,78,216,0.3)" : "none",
                      }}
                    >
                      <span className="text-2xl">
                        {sem.includes("Physics") ? "⚛️" : sem.includes("Chemistry") ? "🧪" : "📖"}
                      </span>
                      <div className="text-left">
                        <p className="leading-tight">{sem}</p>
                        {!isCycle && (
                          <p className="text-[10px] mt-0.5" style={{ color: isActive ? "#93c5fd" : "#9ca3af" }}>
                            {selectedYear}
                          </p>
                        )}
                      </div>
                      {isActive && <span className="ml-auto text-blue-200">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes panel */}
          {selectedSemester && (
            <div ref={notesRef} className="mt-8">
              {/* Notes header */}
              <div
                className="rounded-t-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-3"
                style={{ background: "linear-gradient(135deg, #102c59 0%, #1a3d7a 100%)" }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Study Materials</p>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">
                    {selectedSemester}
                    <span className="mx-2 text-blue-400">—</span>
                    {BRANCH_SHORT[selectedBranch] ?? selectedBranch}
                  </h3>
                  <p className="text-xs text-blue-200">{selectedYear} · {selectedScheme}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isRegistered ? (
                    <span className="flex items-center gap-1.5 rounded-full border border-green-400/40 bg-green-500/20 px-3 py-1.5 text-xs font-semibold text-green-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Access Granted
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowRegistration(true)}
                      className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#102c59] hover:bg-blue-50 transition-colors"
                    >
                      🔓 Unlock All Notes
                    </button>
                  )}
                </div>
              </div>

              {/* Notes body */}
              <div className="rounded-b-2xl border border-t-0 border-gray-200 bg-white p-5">
                <NotesPanel
                  year={selectedYear}
                  scheme={selectedScheme}
                  branch={selectedBranch}
                  semester={selectedSemester}
                  subjects={subjects}
                  noteLinks={noteLinks}
                  isRegistered={isRegistered}
                  onNotesAccessRequest={() => {
                    if (!isRegistered) setShowRegistration(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!selectedBranch && (
            <div className="mt-10 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-lg font-bold text-gray-700">Select a branch above to get started</p>
              <p className="mt-1 text-sm text-gray-400">
                Choose your engineering branch to see semester options and study materials.
              </p>
            </div>
          )}

        </main>

        {/* ══ RIGHT SIDEBAR ══ */}
        <aside
          className="hidden xl:flex flex-col shrink-0 border-l border-gray-200 bg-white"
          style={{ width: "260px", minWidth: "260px" }}
        >
          <div className="sticky top-0 h-screen overflow-y-auto p-4 space-y-4">

            {/* CTA ad */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100">
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Advertisement</span>
                <span className="text-[9px] text-gray-300">ⓘ</span>
              </div>
              <div className="p-4 text-center bg-gradient-to-br from-blue-600 to-[#102c59]">
                <p className="text-xl mb-2">🎓</p>
                <p className="text-sm font-bold text-white leading-tight">Unlock Full<br />Study Materials</p>
                <p className="mt-1.5 text-[10px] text-blue-200 leading-4">Register free to access all notes &amp; module PDFs</p>
                <button
                  onClick={() => setShowRegistration(true)}
                  className="mt-3 w-full rounded-lg bg-white py-2 text-xs font-bold text-[#102c59] hover:bg-blue-50 transition"
                >
                  Get Free Access →
                </button>
              </div>
            </div>

            {/* VTU Results */}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 bg-white">
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Sponsored</span>
              </div>
              <a href="https://results.vtu.ac.in/" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white hover:bg-gray-50 transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">Check VTU Results</p>
                    <p className="mt-1 text-[10px] text-gray-500">View semester exam results on the official VTU portal</p>
                    <p className="mt-2 text-[11px] font-bold text-blue-600">results.vtu.ac.in →</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Internships */}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 bg-white">
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Sponsored</span>
              </div>
              <a href="https://vtu.internyet.in/companies/techmiya-solutions-private-limited" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white hover:bg-gray-50 transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💼</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">VTU Internships</p>
                    <p className="mt-1 text-[10px] text-gray-500">Find internship opportunities for VTU students</p>
                    <p className="mt-2 text-[11px] font-bold text-blue-600">Apply Now →</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Ad placeholder 1 */}
            <div className="rounded-xl border-2 border-dashed border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-dashed border-gray-200">
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Advertisement</span>
              </div>
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span className="text-3xl mb-2">📢</span>
                <p className="text-xs font-semibold text-gray-500">Ad Space Available</p>
                <p className="mt-1 text-[10px] text-gray-400 leading-4">Contact us to reach VTU students.</p>
              </div>
            </div>

            {/* Ad placeholder 2 */}
            <div className="rounded-xl border-2 border-dashed border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-dashed border-gray-200">
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Advertisement</span>
              </div>
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span className="text-3xl mb-2">📢</span>
                <p className="text-xs font-semibold text-gray-500">Ad Space Available</p>
                <p className="mt-1 text-[10px] text-gray-400 leading-4">Contact us to reach VTU students.</p>
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <RegistrationModal
          onSuccess={handleRegistrationSuccess}
          onClose={() => setShowRegistration(false)}
          appsScriptUrl={APP_CONFIG.APPS_SCRIPT_URL}
        />
      )}
    </section>
  );
}