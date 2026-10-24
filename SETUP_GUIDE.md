# VTUConnect — Admin Setup Guide

## 1. Google Sheet for Notes Data

### Step 1 — Create the Sheet
Create a new Google Sheet. Name the first tab **Notes**.
Add the following headers in **Row 1** exactly:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| scheme | year | branch | semester | subject_code | subject_name | drive_link | file_type | description |

### Step 2 — Add Notes Data
Add rows like this example:

| scheme | year | branch | semester | subject_code | subject_name | drive_link | file_type |
|--------|------|---------|----------|-------------|-------------|-----------|---------|
| 2025 Scheme | First Year | ALL | Physics Cycle | BMA101 | Engineering Mathematics - I | https://drive.google.com/file/d/YOUR_FILE_ID/view | PDF |
| 2025 Scheme | First Year | ALL | Chemistry Cycle | BMA201 | Engineering Mathematics - II | https://drive.google.com/file/d/YOUR_FILE_ID/view | PDF |
| 2025 Scheme | Second Year | Computer Science and Engineering (CSE) | Semester 3 | BCS304 | Data Structures | https://drive.google.com/file/d/YOUR_FILE_ID/view | PDF |

> **Important:** The `branch` column must exactly match one of the branch names in
> `src/data/vtu-subjects.ts`. For 1st year subjects that are common to all branches,
> you can use `ALL` as the branch — the frontend will show them regardless of branch.

### Step 3 — Publish the Sheet
1. File → Share → **Publish to web**
2. Select **Sheet1** (or your Notes tab)
3. Select **Comma-separated values (.csv)**
4. Click **Publish** → **OK**
5. Copy the URL — it looks like:
   `https://docs.google.com/spreadsheets/d/SHEET_ID/pub?gid=0&single=true&output=csv`
6. Extract the `SHEET_ID` from that URL

### Step 4 — Update app-config.ts
Edit `src/config/app-config.ts`:
```ts
NOTES_SHEET_ID: "YOUR_ACTUAL_SHEET_ID",
NOTES_SHEET_GID: "0",  // or the GID of your Notes tab
USE_LIVE_SHEET: true,  // ← flip this to true
```

---

## 2. Google Apps Script for Student Registrations

### Step 1 — Create the Registration Sheet
Create a second tab in the same (or a different) Google Sheet called **Registrations**.
Headers in Row 1:

| A | B | C | D | E |
|---|---|---|---|---|
| name | phone | email | college | timestamp |

### Step 2 — Create the Apps Script
1. Open your Google Sheet → **Extensions → Apps Script**
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Registrations");

  const params = e.parameter;
  sheet.appendRow([
    params.name    || "",
    params.phone   || "",
    params.email   || "",
    params.college || "",
    params.timestamp || new Date().toISOString(),
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (floppy disk icon)

### Step 3 — Deploy as Web App
1. Click **Deploy → New deployment**
2. Click the gear icon next to **Type** → select **Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

### Step 4 — Update app-config.ts
```ts
APPS_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
```

---

## 3. Uploading Notes to Google Drive

1. Upload your PDF/PPT/DOC file to Google Drive
2. Right-click the file → **Share** → set to **Anyone with the link can view**
3. Copy the share link (e.g. `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)
4. Paste the link into the `drive_link` column of your Notes sheet
5. The site auto-refreshes and shows the note link to students

### Supported file types
The viewer auto-detects the type from the `file_type` column:
- `PDF` — opens in Google Drive PDF viewer
- `PPT` / `PPTX` — opens in Google Slides viewer
- `DOC` / `DOCX` — opens in Google Docs viewer
- `ZIP` — downloads automatically
- `VIDEO` / `MP4` — opens in Drive player
- `YT` — YouTube link (opens in YouTube)

---

## 4. Deploy to GitHub Pages

### First time setup
```bash
# Install gh-pages
npm install -D gh-pages

# Add remote if not already done
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Deploy
npm run deploy
```

### Every time you update content
```bash
npm run deploy
```

This will:
1. Run `next build` (generates the `out/` static folder)
2. Push `out/` to the `gh-pages` branch
3. GitHub Pages serves it automatically

### GitHub Pages settings (do once on GitHub.com)
1. Go to your repo on GitHub → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **/ (root)**
4. Save

---

## 5. Custom Domain Setup (optional)

1. Edit `public/CNAME` — replace the domain with yours
2. At your domain registrar, add a DNS record:
   - Type: `CNAME`
   - Host: `@` (or `www`)
   - Value: `yourusername.github.io`
3. On GitHub → Settings → Pages → Custom domain: enter your domain
4. Enable **Enforce HTTPS** (may take up to 24h for DNS to propagate)
