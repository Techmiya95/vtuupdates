# VTUConnect & TechMiya EdTech — Admin & Notes Management Guide

This project includes a **Google Drive & Notes Automation System** powered by a single Google Apps Script and an **Admin Portal** on the website.

---

## 🔐 1. Admin Portal Login & Access

- **Website URL:** Main Homepage or `/admin/`
- **Location:** Header navbar, right after `Official VTU ↗`
- **Username / Email:** `techmiyaedtech@gmail.com`
- **Password:** `Techmiya@786`

### Admin Features:
1. **📤 Upload Notes to Google Drive:**
   - Select Scheme, Year, Branch, Semester, and Subject.
   - Choose notes file (PDF, PPT, DOC, ZIP) from your computer.
   - Upload directly to Google Drive via the Apps Script Web App.
   - The website automatically changes that subject from **"⏳ Update shortly"** to **"✓ Modules Available / 📂 Open Folder"**!
2. **➕ Add VTU Subject:**
   - Add new subjects per scheme, year, branch, and semester according to VTU syllabus.
   - Automatically creates the corresponding subject folder in Google Drive.
   - Instantly shows up on the website for students!
3. **📁 Direct Drive Links & Directory Manager:**
   - View all subjects per semester with their live status.
   - Paste existing Drive links directly or open folders in 1 click.
4. **⚙️ Google Apps Script & Drive Generator:**
   - 1-click button to generate the complete Google Drive folder tree.
   - Update Apps Script Web App URL without editing code.

---

## ☁️ 2. Google Apps Script Setup (google-apps-script.js)

The complete script is available in your repository: [`vtuupdates/google-apps-script.js`](./google-apps-script.js).

### Step-by-Step Deployment:

1. Go to [Google Drive](https://drive.google.com).
2. Create or open a Google Sheet (e.g. `VTUConnect Master Database`).
3. Click **Extensions → Apps Script**.
4. Delete all existing code in `Code.gs` and paste the contents of [`google-apps-script.js`](./google-apps-script.js).
5. Click **Save** (floppy disk icon).
6. **(Optional 1-Click Folder Setup):**
   - In the Apps Script toolbar, select the function `createDriveFolderStructure` and click **Run**.
   - Review permissions and click **Allow**.
   - This will automatically create the entire folder structure in your Google Drive under `VTUConnect_Study_Notes`:
     ```
     VTUConnect_Study_Notes/
     ├── 2025 Scheme/
     │   ├── First Year/
     │   │   ├── Physics Cycle/
     │   │   └── Chemistry Cycle/
     │   └── Computer Science and Engineering (CSE)/
     │       ├── Semester 3/
     │       ├── Semester 4/
     │       └── ...
     ├── 2022 Scheme/
     ├── 2021 Scheme/
     └── 2018 Scheme/
     ```
7. Click **Deploy → New deployment**.
8. Select Type: **Web app** (gear icon).
9. Configure:
   - **Description:** `VTUConnect Notes & Portal API`
   - **Execute as:** `Me` (your Google account)
   - **Who has access:** `Anyone` (CRITICAL: Must be "Anyone" so students and the admin portal can upload & fetch notes)
10. Click **Deploy** → **Authorize access** → Select your account → Click **Advanced** → **Go to Untitled project (unsafe)** → **Allow**.
11. Copy the **Web app URL** (ends in `/exec`).
12. Paste the URL into:
    - **Option A:** The Admin Portal under **Settings → Google Apps Script Web App URL** → Click **Save URL**.
    - **Option B:** `src/config/app-config.ts` in the `APPS_SCRIPT_URL` field.

---

## 📂 3. How Notes Reflect on the Website

- **If notes are NOT uploaded yet:**
  - The subject shows: **`⏳ Update shortly`**
  - Keeps students informed that notes are in progress.
- **When notes ARE uploaded:**
  - The subject shows: **`✓ Modules Available`** and **`📂 Open Folder`**
  - Registered students can click to view and download all PDFs from Google Drive.
  - Non-registered students get a prompt to register free once.

---

## 🚀 4. Deploying Updates to GitHub Pages

Whenever you make frontend changes or deploy the website:

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

The site will automatically build and publish to GitHub Pages / custom domain.
