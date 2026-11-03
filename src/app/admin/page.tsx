"use client";

import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { SCHEMES, YEARS, BRANCHES, getSemesters } from "@/data/vtu-subjects";
import {
  getMergedSubjects,
  getEffectiveDriveLink,
  setSubjectDriveLink,
  removeSubjectDriveLink,
  addCustomSubject,
  getCustomSubjects,
  deleteCustomSubject,
  uploadNoteToGoogleDrive,
  triggerDriveStructureCreation,
  getActiveAppsScriptUrl,
  saveActiveAppsScriptUrl,
  CustomSubject,
} from "@/lib/notes-store";

const ADMIN_EMAIL = "techmiyaedtech@gmail.com";
const ADMIN_PASS = "Techmiya@786";
const AUTH_KEY = "vtu_admin_auth_session";

export default function AdminPage() {
  /* ── Authentication State ─────────────────────────────────────────── */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ── Tab Navigation ────────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<"upload" | "subjects" | "links" | "settings">("upload");

  /* ── Notification / Status Message ─────────────────────────────────── */
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  /* ── Common Filter State ───────────────────────────────────────────── */
  const [selectedScheme, setSelectedScheme] = useState("2025 Scheme");
  const [selectedYear, setSelectedYear] = useState("Second Year");
  const [selectedBranch, setSelectedBranch] = useState("Computer Science and Engineering (CSE)");
  const [selectedSemester, setSelectedSemester] = useState("Semester 3");

  /* ── Upload Tab State ──────────────────────────────────────────────── */
  const [uploadSubjectCode, setUploadSubjectCode] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState("");

  /* ── Add Subject Tab State ─────────────────────────────────────────── */
  const [newSubCode, setNewSubCode] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubType, setNewSubType] = useState<"theory" | "lab" | "project">("theory");
  const [newSubDriveLink, setNewSubDriveLink] = useState("");
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  /* ── Settings & Cloud State ────────────────────────────────────────── */
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isGeneratingDrive, setIsGeneratingDrive] = useState(false);

  /* ── Refresh Counter ───────────────────────────────────────────────── */
  const [refreshTick, setRefreshTick] = useState(0);

  // Initialize auth & configuration
  useEffect(() => {
    const savedAuth = sessionStorage.getItem(AUTH_KEY);
    if (savedAuth === "authenticated") {
      setIsAuthenticated(true);
    }
    setAppsScriptUrlInput(getActiveAppsScriptUrl());
    setAuthChecking(false);
  }, []);

  function triggerRefresh() {
    setRefreshTick((v) => v + 1);
  }

  function showToast(message: string, type: "success" | "error" | "info" = "success") {
    setToast({ message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.message === message ? null : cur));
    }, 4500);
  }

  /* ── Auth Handlers ─────────────────────────────────────────────────── */
  function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");

    const cleanUser = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (cleanUser === ADMIN_EMAIL.toLowerCase() && cleanPass === ADMIN_PASS) {
      sessionStorage.setItem(AUTH_KEY, "authenticated");
      setIsAuthenticated(true);
      showToast("Signed in successfully as TechMiya EdTech Admin!", "success");
    } else {
      setLoginError("Invalid username or password. Please check your credentials.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setLoginPassword("");
    showToast("Logged out successfully.", "info");
  }

  /* ── Available Semesters & Subjects ────────────────────────────────── */
  const availableSemesters = useMemo(() => {
    return getSemesters(
      selectedYear as Parameters<typeof getSemesters>[0],
      selectedBranch as Parameters<typeof getSemesters>[1]
    );
  }, [selectedYear, selectedBranch]);

  // Keep semester in sync if selection changes
  useEffect(() => {
    if (availableSemesters.length > 0 && !availableSemesters.includes(selectedSemester)) {
      setSelectedSemester(availableSemesters[0]);
    }
  }, [availableSemesters, selectedSemester]);

  const currentSubjects = useMemo(() => {
    return getMergedSubjects(selectedScheme, selectedYear, selectedBranch, selectedSemester);
  }, [selectedScheme, selectedYear, selectedBranch, selectedSemester, refreshTick]);

  // Sync selected subject for upload
  useEffect(() => {
    if (currentSubjects.length > 0 && !currentSubjects.some((s) => s.code === uploadSubjectCode)) {
      setUploadSubjectCode(currentSubjects[0].code);
    }
  }, [currentSubjects, uploadSubjectCode]);

  /* ── Upload Handler ────────────────────────────────────────────────── */
  async function handleFileUploadSubmit(e: FormEvent) {
    e.preventDefault();
    if (!uploadFile) {
      showToast("Please choose a file to upload.", "error");
      return;
    }
    if (!uploadSubjectCode) {
      showToast("Please select a subject.", "error");
      return;
    }

    const currentSub = currentSubjects.find((s) => s.code === uploadSubjectCode);
    const subName = currentSub ? currentSub.name : uploadSubjectCode;

    setIsUploading(true);
    setUploadProgressMsg("Connecting to Google Drive...");

    try {
      setUploadProgressMsg(`Uploading "${uploadFile.name}" to Google Drive folder for ${uploadSubjectCode}...`);
      const res = await uploadNoteToGoogleDrive({
        scheme: selectedScheme,
        year: selectedYear,
        branch: selectedBranch,
        semester: selectedSemester,
        subjectCode: uploadSubjectCode,
        subjectName: subName,
        file: uploadFile,
      });

      if (res.status === "success") {
        showToast(`Notes successfully uploaded to Google Drive for ${uploadSubjectCode}!`, "success");
        setUploadFile(null);
        // Reset file input element
        const fileInput = document.getElementById("note-file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        triggerRefresh();
      } else {
        showToast(res.message || "Failed to upload note to Google Drive.", "error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast("Upload error: " + msg, "error");
    } finally {
      setIsUploading(false);
      setUploadProgressMsg("");
    }
  }

  /* ── Add Subject Handler ───────────────────────────────────────────── */
  async function handleAddSubjectSubmit(e: FormEvent) {
    e.preventDefault();
    const code = newSubCode.trim().toUpperCase();
    const name = newSubName.trim();

    if (!code || !name) {
      showToast("Subject code and name are required.", "error");
      return;
    }

    setIsAddingSubject(true);
    try {
      const customSub: CustomSubject = {
        scheme: selectedScheme,
        year: selectedYear,
        branch: selectedYear === "First Year" ? "First Year" : selectedBranch,
        semester: selectedSemester,
        code,
        name,
        type: newSubType,
      };

      addCustomSubject(customSub);

      if (newSubDriveLink.trim()) {
        setSubjectDriveLink(
          selectedScheme,
          selectedYear,
          selectedBranch,
          selectedSemester,
          code,
          newSubDriveLink.trim()
        );
      }

      showToast(`Subject ${code} - ${name} added successfully!`, "success");
      setNewSubCode("");
      setNewSubName("");
      setNewSubDriveLink("");
      triggerRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast("Error adding subject: " + msg, "error");
    } finally {
      setIsAddingSubject(false);
    }
  }

  /* ── Link Updating ─────────────────────────────────────────────────── */
  function handleSaveLinkDirect(code: string, link: string) {
    if (!link.trim()) {
      removeSubjectDriveLink(selectedScheme, selectedYear, selectedBranch, selectedSemester, code);
      showToast(`Cleared Drive link for ${code}`, "info");
    } else {
      setSubjectDriveLink(selectedScheme, selectedYear, selectedBranch, selectedSemester, code, link.trim());
      showToast(`Drive link updated for ${code}!`, "success");
    }
    triggerRefresh();
  }

  /* ── Generate Google Drive Hierarchy ───────────────────────────────── */
  async function handleGenerateDriveStructure() {
    if (!confirm("This will trigger Google Apps Script to create all VTU scheme, branch, and subject folders in Google Drive. Proceed?")) {
      return;
    }

    setIsGeneratingDrive(true);
    try {
      const res = await triggerDriveStructureCreation();
      if (res.status === "success") {
        showToast(
          res.rootFolderUrl
            ? `Google Drive structure created! Root folder: ${res.rootFolderUrl}`
            : "Google Drive folder structure created successfully!",
          "success"
        );
      } else {
        showToast(res.message || "Failed to generate structure.", "error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast("Error: " + msg, "error");
    } finally {
      setIsGeneratingDrive(false);
    }
  }

  /* ── Test Apps Script Connection ───────────────────────────────────── */
  async function handleTestConnection() {
    if (!appsScriptUrlInput.trim()) {
      showToast("Please enter an Apps Script URL first.", "error");
      return;
    }
    saveActiveAppsScriptUrl(appsScriptUrlInput.trim());
    setIsTestingConnection(true);
    setConnectionStatus("Testing connection to Google Apps Script...");

    try {
      const url = new URL(appsScriptUrlInput.trim());
      url.searchParams.set("action", "checkStatus");
      url.searchParams.set("t", Date.now().toString());

      const res = await fetch(url.toString(), { method: "GET", mode: "cors" });
      const data = await res.json();

      if (data && data.status === "success") {
        setConnectionStatus("✅ Connected successfully to Google Apps Script Web App!");
        showToast("Connected to Google Apps Script!", "success");
      } else {
        setConnectionStatus("⚠️ Script responded but returned an error: " + JSON.stringify(data));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setConnectionStatus("❌ Could not connect: " + msg + ". Make sure 'Who has access' is set to 'Anyone'.");
    } finally {
      setIsTestingConnection(false);
    }
  }

  /* ── Copy Script Helper ────────────────────────────────────────────── */
  function handleCopyScript() {
    const code = `// Please copy google-apps-script.js from the project root into Google Apps Script!`;
    navigator.clipboard.writeText(code);
    showToast("Instructions copied to clipboard!", "info");
  }

  /* ─────────────────────────────────────────────────────────────────── */
  /* 1. LOADING SCREEN                                                   */
  /* ─────────────────────────────────────────────────────────────────── */
  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1e38] text-white">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-slate-300 font-medium">Checking admin credentials...</p>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────── */
  /* 2. LOGIN FORM                                                       */
  /* ─────────────────────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#0d1e38] px-4 py-12 text-slate-100">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black p-2 ring-2 ring-amber-400/40 shadow-lg">
              <img
                src="/images/techmiyaedtech_new_logo.png"
                alt="TechMiya EdTech Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
              TechMiya EdTech
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Admin Portal Login
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Manage VTU Curriculum, Subjects &amp; Google Drive Notes
            </p>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Admin Username / Email
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="techmiyaedtech@gmail.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500 active:scale-95"
            >
              Sign In to Admin Portal →
            </button>
          </form>

          {/* Bottom Back Link */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ─────────────────────────────────────────────────────────────────── */
  /* 3. AUTHENTICATED ADMIN DASHBOARD                                   */
  /* ─────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* ── Toast Notification ───────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl text-sm font-semibold transition-all animate-bounce ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : toast.type === "error"
              ? "bg-rose-600 text-white"
              : "bg-slate-800 text-white"
          }`}
        >
          <span>{toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── Admin Top Navigation Bar ─────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-[#102c59] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-black p-1 shadow">
              <img
                src="/images/techmiyaedtech_new_logo.png"
                alt="TechMiya EdTech Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight">VTUConnect</span>
                <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold text-slate-950 uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-blue-200">TechMiya EdTech Management Console</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-blue-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              {ADMIN_EMAIL}
            </span>
            <Link
              href="/"
              target="_blank"
              className="rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              View Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500/20 border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/30 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container ───────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeTab === "upload"
                ? "bg-[#102c59] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>📤</span> Upload Notes to Drive
          </button>

          <button
            onClick={() => setActiveTab("subjects")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeTab === "subjects"
                ? "bg-[#102c59] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>➕</span> Add VTU Subject
          </button>

          <button
            onClick={() => setActiveTab("links")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeTab === "links"
                ? "bg-[#102c59] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>📁</span> All Subjects &amp; Drive Links
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeTab === "settings"
                ? "bg-[#102c59] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>⚙️</span> Apps Script &amp; Drive Setup
          </button>
        </div>

        {/* ── Filter Strip (Scheme / Year / Branch / Semester) ────────── */}
        {activeTab !== "settings" && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Target VTU Curriculum Selection:
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Scheme */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Scheme</label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {SCHEMES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    const yr = e.target.value;
                    setSelectedYear(yr);
                    if (yr === "First Year") {
                      setSelectedSemester("Physics Cycle");
                    } else if (yr === "Second Year") {
                      setSelectedSemester("Semester 3");
                    } else if (yr === "Third Year") {
                      setSelectedSemester("Semester 5");
                    } else if (yr === "Fourth Year") {
                      setSelectedSemester("Semester 7");
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Branch {selectedYear === "First Year" && "(Common to all branches)"}
                </label>
                <select
                  disabled={selectedYear === "First Year"}
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 disabled:opacity-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Semester / Cycle</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {availableSemesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: UPLOAD NOTES DIRECTLY TO GOOGLE DRIVE                   */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "upload" && (
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Upload Form */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Upload Notes to Google Drive</h2>
                  <p className="text-xs text-slate-500">
                    Upload notes from your computer directly into the Google Drive folder for the chosen subject.
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {selectedSemester}
                </span>
              </div>

              <form onSubmit={handleFileUploadSubmit} className="mt-5 space-y-4">
                {/* Select Subject */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Choose Subject
                  </label>
                  <select
                    value={uploadSubjectCode}
                    onChange={(e) => setUploadSubjectCode(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {currentSubjects.map((sub) => {
                      const hasLink = Boolean(
                        getEffectiveDriveLink(
                          selectedScheme,
                          selectedYear,
                          selectedBranch,
                          selectedSemester,
                          sub.code
                        )
                      );
                      return (
                        <option key={sub.code} value={sub.code}>
                          {hasLink ? "✓ " : "⏳ "} {sub.code} — {sub.name} {hasLink ? "(Drive Link Present)" : "(No Link - Update Shortly)"}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Choose File from System (PDF, PPT, DOC, ZIP)
                  </label>
                  <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 pt-5 pb-6 hover:bg-slate-50 transition">
                    <div className="space-y-2 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-700">
                        📄
                      </div>
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label
                          htmlFor="note-file-input"
                          className="relative cursor-pointer rounded-md font-bold text-blue-700 hover:text-blue-800 focus-within:outline-none"
                        >
                          <span>Browse from your computer</span>
                          <input
                            id="note-file-input"
                            name="note-file-input"
                            type="file"
                            accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.rar"
                            className="sr-only"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              if (e.target.files && e.target.files[0]) {
                                setUploadFile(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-slate-400">PDF, PPTX, DOCX, ZIP up to 50MB</p>
                      {uploadFile && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 border border-emerald-200">
                          <span>📎 Selected:</span>
                          <span className="underline">{uploadFile.name}</span>
                          <span className="text-emerald-600 font-normal">
                            ({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUploading || !uploadFile}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#102c59] py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-[#1a3d7a] transition disabled:opacity-50 active:scale-95"
                  >
                    {isUploading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>{uploadProgressMsg || "Uploading to Google Drive..."}</span>
                      </>
                    ) : (
                      <>
                        <span>☁️ Upload to Google Drive &amp; Update Site</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Helpful instructions */}
              <div className="mt-5 rounded-xl bg-blue-50/80 border border-blue-100 p-4 text-xs text-blue-900">
                <p className="font-bold flex items-center gap-1.5">
                  <span>💡</span> How it reflects on the website:
                </p>
                <ul className="mt-1 list-disc pl-4 space-y-1 text-blue-800">
                  <li>The file is uploaded directly to that subject&apos;s folder in Google Drive.</li>
                  <li>The subject automatically changes from <strong>&ldquo;⏳ Update shortly&rdquo;</strong> to <strong>&ldquo;📂 Open Folder&rdquo;</strong> on the student hub.</li>
                  <li>Students clicking the button can immediately view and download all notes.</li>
                </ul>
              </div>
            </div>

            {/* Quick Status of current semester subjects */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                Subject Status ({selectedSemester})
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Subjects in this semester and their Google Drive status:
              </p>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {currentSubjects.map((sub) => {
                  const link = getEffectiveDriveLink(
                    selectedScheme,
                    selectedYear,
                    selectedBranch,
                    selectedSemester,
                    sub.code
                  );
                  return (
                    <div
                      key={sub.code}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-800">{sub.code}</p>
                          <p className="text-slate-600 text-[11px] line-clamp-1">{sub.name}</p>
                        </div>
                        {link ? (
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            ✓ Available
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                            ⏳ Update shortly
                          </span>
                        )}
                      </div>

                      {link && (
                        <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-200/60">
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline font-semibold text-[11px] inline-flex items-center gap-1"
                          >
                            Open in Drive ↗
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove notes link for ${sub.code}? It will return to 'Update shortly'.`)) {
                                removeSubjectDriveLink(
                                  selectedScheme,
                                  selectedYear,
                                  selectedBranch,
                                  selectedSemester,
                                  sub.code
                                );
                                triggerRefresh();
                                showToast(`Removed link for ${sub.code}`, "info");
                              }
                            }}
                            className="text-[10px] text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: ADD VTU SUBJECT                                        */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "subjects" && (
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Add Subject Form */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Add New Subject to VTU Syllabus</h2>
                <p className="text-xs text-slate-500">
                  Add a new subject for {selectedScheme} → {selectedYear} → {selectedSemester}.
                  It will immediately appear in the student notes explorer and create its folder in Google Drive.
                </p>
              </div>

              <form onSubmit={handleAddSubjectSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BCS305 / 21CS32"
                      value={newSubCode}
                      onChange={(e) => setNewSubCode(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold uppercase text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Subject Type
                    </label>
                    <select
                      value={newSubType}
                      onChange={(e) => setNewSubType(e.target.value as "theory" | "lab" | "project")}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="theory">Theory Course</option>
                      <option value="lab">Laboratory (LAB)</option>
                      <option value="project">Project Work / Seminar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Structures and Applications"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Google Drive Folder / File Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={newSubDriveLink}
                    onChange={(e) => setNewSubDriveLink(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    If left empty, students will see &ldquo;⏳ Update shortly&rdquo; until notes are uploaded.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAddingSubject}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50"
                  >
                    {isAddingSubject ? "Adding Subject..." : "➕ Add Subject & Save to Website"}
                  </button>
                </div>
              </form>
            </div>

            {/* Custom subjects list */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">Custom Added Subjects</h3>
              <p className="text-xs text-slate-500 mb-4">
                Subjects added via Admin that are actively reflecting on the website:
              </p>

              {getCustomSubjects().length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                  No custom subjects added yet. All default VTU curriculum subjects are loaded.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {getCustomSubjects().map((sub) => (
                    <div
                      key={`${sub.scheme}-${sub.semester}-${sub.code}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{sub.code}</span>
                          <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800">
                            {sub.type?.toUpperCase()}
                          </span>
                          <p className="mt-0.5 text-slate-700 font-medium">{sub.name}</p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {sub.scheme} • {sub.semester}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete subject ${sub.code}?`)) {
                              deleteCustomSubject(sub.scheme, sub.year, sub.branch, sub.semester, sub.code);
                              triggerRefresh();
                              showToast(`Deleted ${sub.code}`, "info");
                            }
                          }}
                          className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                          title="Delete Subject"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: ALL SUBJECTS & DIRECT LINK MANAGER                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "links" && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Subjects &amp; Notes Directory ({selectedSemester})
                </h2>
                <p className="text-xs text-slate-500">
                  Manage Google Drive folder links for each subject. You can paste an existing Drive folder URL directly.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Total: {currentSubjects.length} subjects</span>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Subject Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Website Status</th>
                    <th className="py-3 px-4">Google Drive Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentSubjects.map((sub) => {
                    const link = getEffectiveDriveLink(
                      selectedScheme,
                      selectedYear,
                      selectedBranch,
                      selectedSemester,
                      sub.code
                    ) || "";

                    return (
                      <tr key={sub.code} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{sub.code}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">{sub.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                            {sub.type || "theory"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {link ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                              ✓ Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                              ⏳ Update shortly
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <input
                            type="url"
                            defaultValue={link}
                            placeholder="Paste Drive Link..."
                            onBlur={(e) => {
                              if (e.target.value !== link) {
                                handleSaveLinkDirect(sub.code, e.target.value);
                              }
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {link ? (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                            >
                              Open ↗
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setUploadSubjectCode(sub.code);
                                setActiveTab("upload");
                              }}
                              className="rounded-lg bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-amber-300"
                            >
                              Upload File
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 4: APPS SCRIPT CONFIG & GOOGLE DRIVE SETUP                */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="mt-5 space-y-6">
            {/* Apps Script Web App Connection Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Google Apps Script Connection</h2>
                  <p className="text-xs text-slate-500">
                    Connects your website to Google Drive for uploading notes and syncing subjects.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Cloud Backend
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Google Apps Script Web App URL
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="url"
                      value={appsScriptUrlInput}
                      onChange={(e) => setAppsScriptUrlInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        saveActiveAppsScriptUrl(appsScriptUrlInput.trim());
                        showToast("Apps Script URL saved!", "success");
                      }}
                      className="rounded-xl bg-[#102c59] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3d7a] transition"
                    >
                      Save URL
                    </button>
                    <button
                      type="button"
                      disabled={isTestingConnection}
                      onClick={handleTestConnection}
                      className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
                    >
                      {isTestingConnection ? "Testing..." : "Test Connection"}
                    </button>
                  </div>
                </div>

                {connectionStatus && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs font-medium text-slate-800">
                    {connectionStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Google Drive Structure Generator */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Automatic Google Drive Folder Hierarchy Generator
                  </h3>
                  <p className="text-xs text-slate-500">
                    One-click tool that creates the complete folder structure in Google Drive:
                    <br />
                    <code className="text-blue-700 font-mono">
                      VTUConnect_Study_Notes / [Scheme] / [Year or Branch] / [Semester] / [Subject Code - Subject Name]
                    </code>
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isGeneratingDrive}
                  onClick={handleGenerateDriveStructure}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow hover:from-amber-400 hover:to-amber-500 transition active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingDrive ? "Generating in Google Drive..." : "⚡ Generate Drive Folders Now"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs text-slate-600">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="font-bold text-slate-800">1. Upload From System Directly</p>
                  <p className="mt-1">
                    Use the <strong>&ldquo;Upload Notes to Drive&rdquo;</strong> tab to pick any note from your PC. It will automatically upload to the designated Drive folder and turn the subject status to &ldquo;✓ Available&rdquo;.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="font-bold text-slate-800">2. Or Upload Directly in Google Drive</p>
                  <p className="mt-1">
                    Open your Google Drive, go into any subject folder inside <code>VTUConnect_Study_Notes</code>, and drag and drop your PDFs directly!
                  </p>
                </div>
              </div>
            </div>

            {/* Apps Script Setup Instructions & Code Copy */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Google Apps Script Code (google-apps-script.js)
                  </h3>
                  <p className="text-xs text-slate-500">
                    This file is ready in your project root at <code>vtuupdates/google-apps-script.js</code>.
                  </p>
                </div>
                <button
                  onClick={handleCopyScript}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  📋 Copy Setup Instructions
                </button>
              </div>

              <div className="mt-4 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Quick 3-step setup in Google Drive:</p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>
                    Open <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-blue-700 underline font-bold">script.google.com</a> or open your Google Sheet &rarr; <strong>Extensions &rarr; Apps Script</strong>.
                  </li>
                  <li>
                    Paste the contents of <code>vtuupdates/google-apps-script.js</code> into the editor.
                  </li>
                  <li>
                    Click <strong>Deploy &rarr; New deployment &rarr; Web app</strong>.
                    Set <em>Execute as: Me</em>, and <em>Who has access: Anyone</em>. Copy the Web app URL and paste it in the box above!
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

