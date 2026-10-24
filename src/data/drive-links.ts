/**
 * VTU Study Notes — Google Drive Subject Folder Links
 *
 * YOUR FOLDER STRUCTURE ON GOOGLE DRIVE:
 * ─────────────────────────────────────
 *  AIML/
 *  ├── 3rd sem/
 *  │   ├── Subject-A/   ← share THIS folder link
 *  │   └── Subject-B/   ← share THIS folder link
 *  ├── 4th sem/
 *  └── 7th sem/
 *      ├── ML-2/                  ← share THIS folder link
 *      ├── DEEP LEARNING/         ← share THIS folder link
 *      └── DATA SECURITY.../      ← share THIS folder link
 *
 * HOW TO ADD A SUBJECT FOLDER:
 * 1. Right-click the subject folder in Google Drive
 * 2. Share → "Anyone with the link" → Viewer → Copy link
 * 3. Add it below under scheme → branch → semester → subject_code
 *
 * Subject codes come from src/data/vtu-subjects.ts
 *
 * Structure:
 *   DRIVE_LINKS[scheme][branch][semester][subjectCode] = "folder URL"
 */

export const DRIVE_LINKS: Record<
  string,
  Record<string, Record<string, Record<string, string>>>
> = {
  // ═══════════════════════════════════════════════════════════════
  // 2025 SCHEME
  // ═══════════════════════════════════════════════════════════════
  "2025 Scheme": {

    // ── First Year (common to all branches) ──────────────────────
    "First Year": {
      "Physics Cycle": {
        // "BMA101": "https://drive.google.com/drive/folders/FOLDER_ID",
        // "BPH102": "https://drive.google.com/drive/folders/FOLDER_ID",
      },
      "Chemistry Cycle": {
        // "BMA201": "https://drive.google.com/drive/folders/FOLDER_ID",
      },
    },

    // ── AIML ─────────────────────────────────────────────────────
    "Artificial Intelligence and Machine Learning (AIML)": {
      "Semester 3": {
        // Paste each subject folder link here.
        // Example: "BAI301": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      },
      "Semester 4": {
        // "BAI401": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      },
      "Semester 5": {
        // "BAI501": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      },
      "Semester 6": {
        // "BAI601": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      },
      "Semester 7": {
        // From your folder: AIML → 7th sem → ML-2
        // "BAI701": "https://drive.google.com/drive/folders/DATA_SECURITY_FOLDER_ID",
        // "BAI702": "https://drive.google.com/drive/folders/ML2_FOLDER_ID",
        // "BAI703": "https://drive.google.com/drive/folders/DEEP_LEARNING_FOLDER_ID",
      },
      "Semester 8": {
        // "BAI801": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      },
    },

    // ── CSE ──────────────────────────────────────────────────────
    "Computer Science and Engineering (CSE)": {
      "Semester 3": {
        // "BMAT301": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
        // "BCS302":  "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      },
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },

    // ── ISE ──────────────────────────────────────────────────────
    "Information Science and Engineering (ISE)": {
      "Semester 3": {},
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },

    // ── ECE ──────────────────────────────────────────────────────
    "Electronics and Communication Engineering (ECE)": {
      "Semester 3": {},
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },

    // ── EEE ──────────────────────────────────────────────────────
    "Electrical and Electronics Engineering (EEE)": {
      "Semester 3": {},
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },

    // ── ME ───────────────────────────────────────────────────────
    "Mechanical Engineering (ME)": {
      "Semester 3": {},
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },

    // ── CE ───────────────────────────────────────────────────────
    "Civil Engineering (CE)": {
      "Semester 3": {},
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },

    // ── CSBS ─────────────────────────────────────────────────────
    "Computer Science and Business Systems (CSBS)": {
      "Semester 3": {},
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },

    // ── ETE ──────────────────────────────────────────────────────
    "Electronics and Telecommunication Engineering (ETE)": {
      "Semester 3": {},
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },

    // ── IEM ──────────────────────────────────────────────────────
    "Industrial Engineering and Management (IEM)": {
      "Semester 3": {},
      "Semester 4": {},
      "Semester 5": {},
      "Semester 6": {},
      "Semester 7": {},
      "Semester 8": {},
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 2022 SCHEME
  // ═══════════════════════════════════════════════════════════════
  "2022 Scheme": {},

  // ═══════════════════════════════════════════════════════════════
  // 2021 SCHEME
  // ═══════════════════════════════════════════════════════════════
  "2021 Scheme": {},

  // ═══════════════════════════════════════════════════════════════
  // 2018 SCHEME
  // ═══════════════════════════════════════════════════════════════
  "2018 Scheme": {},
};

/**
 * Get the Drive folder link for a specific subject.
 * Returns undefined if no link is configured yet.
 */
export function getDriveLink(
  scheme: string,
  year: string,
  branch: string,
  semester: string,
  subjectCode: string,
): string | undefined {
  const branchKey = year === "First Year" ? "First Year" : branch;
  return DRIVE_LINKS[scheme]?.[branchKey]?.[semester]?.[subjectCode];
}

/**
 * Check if any notes exist for a semester (at least one subject has a folder link).
 */
export function hasNotesForSemester(
  scheme: string,
  year: string,
  branch: string,
  semester: string,
): boolean {
  const branchKey = year === "First Year" ? "First Year" : branch;
  const semData = DRIVE_LINKS[scheme]?.[branchKey]?.[semester] ?? {};
  return Object.keys(semData).length > 0;
}
