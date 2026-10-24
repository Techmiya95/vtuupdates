"use client";

import { SubjectEntry } from "@/data/vtu-subjects";

/** One entry = one Google Drive subject folder */
export interface NoteLink {
  subjectCode: string;
  folderLink: string;
}

interface NotesPanelProps {
  year: string;
  scheme: string;
  branch: string;
  semester: string;
  subjects: SubjectEntry[];
  noteLinks: NoteLink[];
  isRegistered: boolean;
  onNotesAccessRequest: () => void;
}

export default function NotesPanel({
  year,
  scheme,
  branch,
  semester,
  subjects,
  noteLinks,
  isRegistered,
  onNotesAccessRequest,
}: NotesPanelProps) {
  const getLinkForSubject = (code: string): NoteLink | undefined =>
    noteLinks.find(
      (n) => n.subjectCode.trim().toUpperCase() === code.trim().toUpperCase(),
    );

  const handleOpenFolder = (noteLink: NoteLink) => {
    if (!isRegistered) {
      onNotesAccessRequest();
      return;
    }
    window.open(noteLink.folderLink, "_blank", "noopener,noreferrer");
  };

  if (subjects.length === 0) {
    return (
      <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
        <p className="text-3xl mb-2">📚</p>
        <p className="font-semibold text-slate-700">No subjects found</p>
        <p className="mt-1">Check that your year / branch / semester selection is correct.</p>
      </div>
    );
  }

  const withNotes    = subjects.filter((s) => getLinkForSubject(s.code));
  const withoutNotes = subjects.filter((s) => !getLinkForSubject(s.code));

  return (
    <>
      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{scheme}</span>
        <span className="text-slate-300">›</span>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{year}</span>
        {year !== "First Year" && (
          <>
            <span className="text-slate-300">›</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{branch}</span>
          </>
        )}
        <span className="text-slate-300">›</span>
        <span className="rounded-full bg-[#102c59] px-3 py-1 text-white">{semester}</span>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Total Subjects",  value: subjects.length,    colour: "text-slate-700"  },
          { label: "Notes Available", value: withNotes.length,   colour: "text-green-600"  },
          { label: "Coming Soon",     value: withoutNotes.length, colour: "text-amber-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"
          >
            <p className={`text-2xl font-extrabold ${stat.colour}`}>{stat.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Registration nudge ─────────────────────────────────────── */}
      {!isRegistered && withNotes.length > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <span className="text-2xl">🔒</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-blue-800">Free registration required</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Register once to open any subject folder and download all module notes.
            </p>
          </div>
          <button
            onClick={onNotesAccessRequest}
            className="shrink-0 rounded-lg bg-[#102c59] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3d7a] transition"
          >
            Register Free →
          </button>
        </div>
      )}

      {/* ── How to use (info strip) ────────────────────────────────── */}
      {withNotes.length > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-500">
          <span className="text-base">📂</span>
          <span>
            Each button opens a <strong className="text-slate-700">Google Drive folder</strong> containing
            all module-wise PDFs for that subject. Download any module you need.
          </span>
        </div>
      )}

      {/* ── Subject list ───────────────────────────────────────────── */}
      <div className="mt-5 space-y-3">
        {subjects.map((subject, idx) => {
          const noteLink = getLinkForSubject(subject.code);
          const hasLink  = Boolean(noteLink);

          return (
            <div
              key={subject.code}
              className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-150 ${
                hasLink
                  ? "border-green-200 bg-green-50/40 hover:border-green-300 hover:bg-green-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* Left — subject info */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Index badge */}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    hasLink ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {hasLink ? "📂" : idx + 1}
                </span>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 leading-snug">{subject.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">{subject.code}</span>

                    {subject.type === "lab" && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700">
                        LAB
                      </span>
                    )}

                    {hasLink && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-green-100 text-green-700">
                        ✓ Modules Available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right — action button */}
              <div className="flex shrink-0 items-center gap-2">
                {noteLink ? (
                  isRegistered ? (
                    <button
                      onClick={() => handleOpenFolder(noteLink)}
                      className="flex items-center gap-2 rounded-lg bg-[#102c59] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1a3d7a] active:scale-95"
                      title="Open subject folder on Google Drive"
                    >
                      📂 Open Folder
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenFolder(noteLink)}
                      className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100 active:scale-95"
                      title="Register to access this folder"
                    >
                      🔓 Unlock Notes
                    </button>
                  )
                ) : (
                  <span className="rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-xs text-slate-400">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Empty notes state ──────────────────────────────────────── */}
      {withNotes.length === 0 && (
        <div className="mt-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-3xl mb-3">🚧</p>
          <p className="font-bold text-slate-700">Notes are being uploaded</p>
          <p className="mt-1 text-xs text-slate-400">
            Check back soon — folders will appear here as subjects are added.
          </p>
        </div>
      )}
    </>
  );
}
