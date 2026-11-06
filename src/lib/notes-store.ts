import {
  SubjectEntry,
  getSubjects as getDefaultSubjects,
  VTU_SUBJECTS,
  SCHEMES,
  YEARS,
  BRANCHES,
} from "@/data/vtu-subjects";
import { getDriveLink as getDefaultDriveLink, DRIVE_LINKS } from "@/data/drive-links";
import { APP_CONFIG } from "@/config/app-config";

export interface CustomSubject extends SubjectEntry {
  scheme: string;
  year: string;
  branch: string;
  semester: string;
  createdAt?: string;
}

export interface NoteUploadResponse {
  status: "success" | "error";
  message?: string;
  fileUrl?: string;
  folderUrl?: string;
  fileName?: string;
}

const STORAGE_CUSTOM_SUBJECTS = "vtu_custom_subjects_v1";
const STORAGE_DYNAMIC_NOTES = "vtu_dynamic_notes_v1";
const STORAGE_CUSTOM_APPS_SCRIPT_URL = "vtu_custom_apps_script_url";

/**
 * Get active Apps Script URL (either from localStorage if admin configured one, or app-config.ts)
 */
export function getActiveAppsScriptUrl(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_CUSTOM_APPS_SCRIPT_URL);
    if (saved && saved.startsWith("http")) return saved;
  }
  return APP_CONFIG.APPS_SCRIPT_URL || "";
}

/**
 * Save custom Apps Script URL in localStorage
 */
export function saveActiveAppsScriptUrl(url: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_CUSTOM_APPS_SCRIPT_URL, url.trim());
  }
}

/**
 * Get custom subjects added by Admin
 */
export function getCustomSubjects(): CustomSubject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_SUBJECTS);
    if (!raw) return [];
    return JSON.parse(raw) as CustomSubject[];
  } catch (err) {
    console.error("Error reading custom subjects from localStorage:", err);
    return [];
  }
}

/**
 * Save a new custom subject
 */
export function addCustomSubject(subject: CustomSubject): void {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomSubjects();
    const exists = current.some(
      (s) =>
        s.scheme === subject.scheme &&
        s.year === subject.year &&
        s.branch === subject.branch &&
        s.semester === subject.semester &&
        s.code.trim().toUpperCase() === subject.code.trim().toUpperCase()
    );

    let updated: CustomSubject[];
    if (exists) {
      updated = current.map((s) =>
        s.scheme === subject.scheme &&
        s.year === subject.year &&
        s.branch === subject.branch &&
        s.semester === subject.semester &&
        s.code.trim().toUpperCase() === subject.code.trim().toUpperCase()
          ? { ...s, ...subject }
          : s
      );
    } else {
      updated = [...current, { ...subject, createdAt: new Date().toISOString() }];
    }
    localStorage.setItem(STORAGE_CUSTOM_SUBJECTS, JSON.stringify(updated));

    // Also trigger cloud sync in background if Apps Script is configured
    syncSubjectToCloud(subject).catch((err) =>
      console.warn("Failed to sync subject to Apps Script cloud:", err)
    );
  } catch (err) {
    console.error("Error saving custom subject:", err);
  }
}

/**
 * Delete a custom subject
 */
export function deleteCustomSubject(
  scheme: string,
  year: string,
  branch: string,
  semester: string,
  code: string
): void {
  if (typeof window === "undefined") return;
  const current = getCustomSubjects();
  const updated = current.filter(
    (s) =>
      !(
        s.scheme === scheme &&
        s.year === year &&
        s.branch === branch &&
        s.semester === semester &&
        s.code.trim().toUpperCase() === code.trim().toUpperCase()
      )
  );
  localStorage.setItem(STORAGE_CUSTOM_SUBJECTS, JSON.stringify(updated));
}

/**
 * Get merged subjects (Default VTU Curriculum + Admin Added Subjects)
 */
export function getMergedSubjects(
  scheme: string,
  year: string,
  branch: string,
  semester: string
): SubjectEntry[] {
  const defaults = getDefaultSubjects(scheme, year, branch, semester);
  const custom = getCustomSubjects().filter(
    (s) =>
      s.scheme === scheme &&
      s.year === year &&
      (year === "First Year" || s.branch === branch) &&
      s.semester === semester
  );

  if (custom.length === 0) return defaults;

  // Merge, ensuring no duplicates by code
  const codeSet = new Set(defaults.map((d) => d.code.trim().toUpperCase()));
  const merged = [...defaults];

  for (const c of custom) {
    if (!codeSet.has(c.code.trim().toUpperCase())) {
      merged.push({
        code: c.code,
        name: c.name,
        type: c.type,
      });
      codeSet.add(c.code.trim().toUpperCase());
    }
  }

  return merged;
}

/**
 * Dynamic notes registry type:
 * map of scheme -> branch/year -> semester -> subjectCode -> folderUrl / fileUrl
 */
export type DynamicNotesMap = Record<
  string,
  Record<string, Record<string, Record<string, string>>>
>;

/**
 * Get dynamic notes from localStorage
 */
export function getDynamicNotesMap(): DynamicNotesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_DYNAMIC_NOTES);
    if (!raw) return {};
    return JSON.parse(raw) as DynamicNotesMap;
  } catch (err) {
    console.error("Error reading dynamic notes:", err);
    return {};
  }
}

/**
 * Save / link notes for a specific subject
 */
export function setSubjectDriveLink(
  scheme: string,
  year: string,
  branch: string,
  semester: string,
  subjectCode: string,
  driveLink: string
): void {
  if (typeof window === "undefined") return;
  try {
    const map = getDynamicNotesMap();
    const branchKey = year === "First Year" ? "First Year" : branch;

    if (!map[scheme]) map[scheme] = {};
    if (!map[scheme][branchKey]) map[scheme][branchKey] = {};
    if (!map[scheme][branchKey][semester]) map[scheme][branchKey][semester] = {};

    map[scheme][branchKey][semester][subjectCode.trim().toUpperCase()] = driveLink.trim();
    localStorage.setItem(STORAGE_DYNAMIC_NOTES, JSON.stringify(map));

    // Also sync to cloud
    syncDriveLinkToCloud(scheme, year, branch, semester, subjectCode, driveLink).catch(
      (err) => console.warn("Cloud sync link failed:", err)
    );
  } catch (err) {
    console.error("Error saving subject drive link:", err);
  }
}

/**
 * Remove notes link for a subject locally
 */
export function removeSubjectDriveLink(
  scheme: string,
  year: string,
  branch: string,
  semester: string,
  subjectCode: string
): void {
  if (typeof window === "undefined") return;
  try {
    const map = getDynamicNotesMap();
    const branchKey = year === "First Year" ? "First Year" : branch;
    if (map[scheme]?.[branchKey]?.[semester]?.[subjectCode.trim().toUpperCase()]) {
      delete map[scheme][branchKey][semester][subjectCode.trim().toUpperCase()];
      localStorage.setItem(STORAGE_DYNAMIC_NOTES, JSON.stringify(map));
    }
  } catch (err) {
    console.error("Error removing subject drive link:", err);
  }
}

/**
 * Delete note from BOTH Google Drive cloud and local website
 */
export async function deleteNoteFromCloudAndLocal(params: {
  scheme: string;
  year: string;
  branch: string;
  semester: string;
  subjectCode: string;
  deleteDriveFiles?: boolean;
}): Promise<{ status: "success" | "error"; message?: string }> {
  // 1. Remove from local store immediately
  removeSubjectDriveLink(
    params.scheme,
    params.year,
    params.branch,
    params.semester,
    params.subjectCode
  );

  // 2. Call Google Apps Script to delete from cloud
  const scriptUrl = getActiveAppsScriptUrl();
  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "deleteNote",
          scheme: params.scheme,
          year: params.year,
          branch: params.branch,
          semester: params.semester,
          subjectCode: params.subjectCode.trim().toUpperCase(),
          deleteDriveFiles: Boolean(params.deleteDriveFiles),
        }),
      });
      const data = await res.json();
      if (data && data.status === "success") {
        return { status: "success", message: data.message || "Note deleted successfully!" };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("Cloud delete request failed:", msg);
    }
  }

  return { status: "success", message: "Note removed from website." };
}

/**
 * Get the effective Drive Link for a subject.
 * Priority:
 * 1. Locally saved / dynamically synced notes link
 * 2. Default drive link in drive-links.ts
 */
export function getEffectiveDriveLink(
  scheme: string,
  year: string,
  branch: string,
  semester: string,
  subjectCode: string
): string | undefined {
  const branchKey = year === "First Year" ? "First Year" : branch;
  const upperCode = subjectCode.trim().toUpperCase();

  // 1. Dynamic map
  const dynMap = getDynamicNotesMap();
  const dynLink = dynMap[scheme]?.[branchKey]?.[semester]?.[upperCode];
  if (dynLink && dynLink.trim().length > 0) return dynLink.trim();

  // 2. Default hardcoded link
  return getDefaultDriveLink(scheme, year, branch, semester, subjectCode);
}

/**
 * Fetch latest notes map from Google Apps Script Web App
 * Supports both POST and GET with automatic deep merge.
 */
export async function fetchNotesFromAppsScript(): Promise<boolean> {
  const scriptUrl = getActiveAppsScriptUrl();
  if (!scriptUrl) return false;

  interface ApiResponse {
    status?: string;
    notes?: DynamicNotesMap;
    subjects?: CustomSubject[];
    [key: string]: unknown;
  }

  let data: ApiResponse | null = null;

  // 1. Try POST first (most reliable, avoids CORS redirect errors)
  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "getNotes" }),
    });

    if (res.ok) {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {}
    }
  } catch (err) {
    // Silently fall back to GET
  }

  // 2. Fallback to GET if POST didn't return notes
  if (!data || data.status !== "success" || !data.notes) {
    try {
      const url = new URL(scriptUrl);
      url.searchParams.set("action", "getNotes");
      url.searchParams.set("t", Date.now().toString());

      const res = await fetch(url.toString(), {
        method: "GET",
        mode: "cors",
      });

      if (res.ok) {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {}
      }
    } catch (err) {}
  }

  if (data && data.status === "success" && data.notes) {
    // Merge with existing local notes
    const existing = getDynamicNotesMap();
    const incoming: DynamicNotesMap = data.notes;

    // Deep merge
    for (const scheme of Object.keys(incoming)) {
      if (!existing[scheme]) existing[scheme] = {};
      for (const branch of Object.keys(incoming[scheme])) {
        if (!existing[scheme][branch]) existing[scheme][branch] = {};
        for (const sem of Object.keys(incoming[scheme][branch])) {
          if (!existing[scheme][branch][sem]) existing[scheme][branch][sem] = {};
          for (const code of Object.keys(incoming[scheme][branch][sem])) {
            existing[scheme][branch][sem][code.toUpperCase()] =
              incoming[scheme][branch][sem][code];
          }
        }
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_DYNAMIC_NOTES, JSON.stringify(existing));
    }

    // Also if subjects are returned
    if (data.subjects && Array.isArray(data.subjects)) {
      const localCustom = getCustomSubjects();
      const mergedCustom = [...localCustom];
      for (const sub of data.subjects) {
        const exists = mergedCustom.some(
          (s) =>
            s.scheme === sub.scheme &&
            s.year === sub.year &&
            s.branch === sub.branch &&
            s.semester === sub.semester &&
            s.code.toUpperCase() === sub.code.toUpperCase()
        );
        if (!exists) {
          mergedCustom.push(sub);
        }
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_CUSTOM_SUBJECTS, JSON.stringify(mergedCustom));
      }
    }

    return true;
  }

  return false;
}

/**
 * Upload a note file directly to Google Drive via Apps Script
 */
export async function uploadNoteToGoogleDrive(params: {
  scheme: string;
  year: string;
  branch: string;
  semester: string;
  subjectCode: string;
  subjectName: string;
  file: File;
}): Promise<NoteUploadResponse> {
  const scriptUrl = getActiveAppsScriptUrl();
  if (!scriptUrl) {
    return {
      status: "error",
      message: "Google Apps Script Web App URL is not configured. Please set it in Admin Settings.",
    };
  }

  // Convert File to base64
  const base64Data = await fileToBase64(params.file);

  const payload = {
    action: "uploadFile",
    scheme: params.scheme,
    year: params.year,
    branch: params.branch,
    semester: params.semester,
    subjectCode: params.subjectCode.trim().toUpperCase(),
    subjectName: params.subjectName.trim(),
    fileName: params.file.name,
    mimeType: params.file.type || "application/pdf",
    fileData: base64Data,
  };

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight issues with Google Apps Script
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result && result.status === "success" && (result.folderUrl || result.fileUrl)) {
      // Genuine upload success with Drive folder/file created
      const effectiveLink = result.folderUrl || result.fileUrl || "";
      if (effectiveLink) {
        setSubjectDriveLink(
          params.scheme,
          params.year,
          params.branch,
          params.semester,
          params.subjectCode,
          effectiveLink
        );
      }
      return {
        status: "success",
        folderUrl: result.folderUrl,
        fileUrl: result.fileUrl,
        fileName: result.fileName,
      };
    } else if (result && result.status === "success" && !result.folderUrl && !result.fileUrl) {
      // The old registration script returned generic success without saving to Drive
      return {
        status: "error",
        message:
          "Google Apps Script returned generic success but did NOT save to Drive. Your Apps Script is still running the old version. Please go to script.google.com -> Deploy -> Manage deployments -> Edit -> select 'New version' -> Deploy.",
      };
    } else {
      return {
        status: "error",
        message: result.error || result.message || "Failed to upload to Google Drive",
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: "error",
      message: "Network error while uploading: " + message,
    };
  }
}

/**
 * Trigger creation of Google Drive folder hierarchy via Apps Script
 */
export async function triggerDriveStructureCreation(): Promise<{
  status: "success" | "error";
  rootFolderUrl?: string;
  message?: string;
}> {
  const scriptUrl = getActiveAppsScriptUrl();
  if (!scriptUrl) {
    return {
      status: "error",
      message: "Google Apps Script Web App URL is not configured.",
    };
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "createStructure" }),
    });

    const result = await res.json();
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: "error",
      message: "Failed to create folder structure: " + message,
    };
  }
}

// Helpers
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

async function syncSubjectToCloud(subject: CustomSubject) {
  const scriptUrl = getActiveAppsScriptUrl();
  if (!scriptUrl) return;
  await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "addSubject",
      subject,
    }),
  });
}

async function syncDriveLinkToCloud(
  scheme: string,
  year: string,
  branch: string,
  semester: string,
  subjectCode: string,
  driveLink: string
) {
  const scriptUrl = getActiveAppsScriptUrl();
  if (!scriptUrl) return;
  await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "setDriveLink",
      scheme,
      year,
      branch,
      semester,
      subjectCode: subjectCode.toUpperCase(),
      driveLink,
    }),
  });
}
