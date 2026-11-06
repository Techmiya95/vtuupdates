/**
 * ============================================================================
 * VTUConnect & TechMiya EdTech — Google Apps Script Backend (v2.1)
 * ============================================================================
 * 
 * Features:
 * 1. Automatic Google Drive Folder Structure Creator:
 *    Creates: VTUConnect_Study_Notes / [Scheme] / [Year or Branch] / [Semester] / [Subject Code - Name]
 * 2. File Upload API:
 *    Directly uploads notes (PDF, PPT, DOCX, ZIP) from system to Drive.
 * 3. File & Subject Delete API:
 *    Allows admin to delete / unlink notes from the frontend in real time.
 * 4. Dynamic Notes & Subject Indexer:
 *    Serves notes and subject metadata via JSON API (GET & POST).
 * 5. Free Student Registration Handler:
 *    Backward compatible with existing student registration logging.
 * 
 * HOW TO DEPLOY (3 STEPS):
 * 1. Open Google Sheets / Apps Script (script.google.com).
 * 2. Delete ALL existing code in Code.gs and PASTE THIS ENTIRE FILE.
 * 3. Click "Deploy" (top right) → "Manage deployments":
 *    - Click the Pencil (Edit) icon
 *    - Select Version: "New version"
 *    - Set "Who has access": "Anyone"
 *    - Click "Deploy"
 * ============================================================================
 */

// Root folder name in Google Drive
var ROOT_FOLDER_NAME = "VTUConnect_Study_Notes";

// ── GET REQUEST HANDLER ──────────────────────────────────────────────────────
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "getNotes";
    var callback = params.callback;

    if (action === "getNotes") {
      var notesMap = getNotesRegistry();
      var customSubjects = getStoredSubjects();
      return jsonResponse({
        status: "success",
        version: "2.1-delete-support",
        notes: notesMap,
        subjects: customSubjects,
        rootFolderUrl: getRootFolderUrl()
      }, callback);
    }

    if (action === "getSubjects") {
      var subjects = getStoredSubjects();
      return jsonResponse({ status: "success", subjects: subjects }, callback);
    }

    if (action === "checkStatus") {
      return jsonResponse({
        status: "success",
        version: "2.1-delete-support",
        rootFolderUrl: getRootFolderUrl(),
        message: "VTUConnect Google Apps Script v2.1 is active and connected!"
      }, callback);
    }

    if (action === "scanDrive") {
      var scanRes = scanDriveFoldersAndIndex();
      return jsonResponse({
        status: "success",
        indexedFolders: scanRes.indexedFolders,
        notes: getNotesRegistry()
      }, callback);
    }

    return jsonResponse({
      status: "success",
      version: "2.1-delete-support",
      message: "VTUConnect Apps Script API is running.",
      timestamp: new Date().toISOString()
    }, callback);
  } catch (err) {
    return jsonResponse({ status: "error", error: err.toString() }, params ? params.callback : null);
  }
}

// ── POST REQUEST HANDLER ─────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    var action = data.action;

    // 1. Backward compatibility: Student Registrations
    if (!action && (data.phone || data.email || data.name)) {
      return handleStudentRegistration(data);
    }

    // 2. Query Notes & Subjects (supports POST as well as GET)
    if (action === "getNotes") {
      var notesMap = getNotesRegistry();
      var customSubjects = getStoredSubjects();
      return jsonResponse({
        status: "success",
        version: "2.1-delete-support",
        notes: notesMap,
        subjects: customSubjects,
        rootFolderUrl: getRootFolderUrl()
      });
    }

    if (action === "checkStatus") {
      return jsonResponse({
        status: "success",
        version: "2.1-delete-support",
        rootFolderUrl: getRootFolderUrl(),
        message: "VTUConnect Google Apps Script v2.1 is active and connected!"
      });
    }

    if (action === "scanDrive") {
      var scanRes = scanDriveFoldersAndIndex();
      return jsonResponse({
        status: "success",
        indexedFolders: scanRes.indexedFolders,
        notes: getNotesRegistry()
      });
    }

    // 3. Upload Note File from system
    if (action === "uploadFile") {
      return handleFileUpload(data);
    }

    // 4. Delete / Remove Note from frontend
    if (action === "deleteNote") {
      return handleDeleteNote(data);
    }

    // 5. Add Custom Subject
    if (action === "addSubject") {
      return handleAddSubject(data);
    }

    // 6. Set or Update Drive Link for a Subject
    if (action === "setDriveLink") {
      return handleSetDriveLink(data);
    }

    // 7. Create Entire Drive Folder Structure
    if (action === "createStructure") {
      var root = createDriveFolderStructure();
      return jsonResponse({
        status: "success",
        version: "2.1-delete-support",
        message: "Google Drive folder structure generated successfully!",
        rootFolderUrl: root ? root.getUrl() : ""
      });
    }

    return jsonResponse({ status: "error", message: "Unknown action: " + action });
  } catch (err) {
    return jsonResponse({ status: "error", error: err.toString() });
  }
}

// ── FILE UPLOAD TO GOOGLE DRIVE ──────────────────────────────────────────────
function handleFileUpload(data) {
  var scheme = data.scheme || "2025 Scheme";
  var year = data.year || "Second Year";
  var branch = data.branch || "Computer Science and Engineering (CSE)";
  var semester = data.semester || "Semester 3";
  var subjectCode = (data.subjectCode || "GENERAL").toUpperCase().trim();
  var subjectName = data.subjectName || subjectCode;
  var fileName = data.fileName || "Note_" + subjectCode + ".pdf";
  var mimeType = data.mimeType || "application/pdf";
  var fileBase64 = data.fileData;

  if (!fileBase64) {
    return jsonResponse({ status: "error", message: "No fileData provided" });
  }

  // Get or create the subject folder
  var subjectFolder = getOrCreateSubjectFolder(scheme, year, branch, semester, subjectCode, subjectName);

  // Decode file and save in folder
  var decodedBytes = Utilities.base64Decode(fileBase64);
  var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
  var createdFile = subjectFolder.createFile(blob);

  // Set permissions: Anyone with the link can view
  try {
    createdFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    subjectFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (shareErr) {}

  var folderUrl = subjectFolder.getUrl();
  var fileUrl = createdFile.getUrl();

  // Register this link in registry
  saveNoteLink(scheme, year, branch, semester, subjectCode, folderUrl);

  return jsonResponse({
    status: "success",
    version: "2.1-delete-support",
    message: "Note uploaded successfully to Google Drive!",
    folderUrl: folderUrl,
    fileUrl: fileUrl,
    fileName: fileName
  });
}

// ── DELETE NOTE HANDLER ──────────────────────────────────────────────────────
function handleDeleteNote(data) {
  var scheme = data.scheme || "2025 Scheme";
  var year = data.year || "Second Year";
  var branch = data.branch || "Computer Science and Engineering (CSE)";
  var semester = data.semester || "Semester 3";
  var subjectCode = (data.subjectCode || "").toUpperCase().trim();

  var branchKey = (year === "First Year") ? "First Year" : branch;
  var key = "NOTE_" + cleanKey(scheme) + "_" + cleanKey(branchKey) + "_" + cleanKey(semester) + "_" + cleanKey(subjectCode);

  var props = PropertiesService.getScriptProperties();
  props.deleteProperty(key);

  // Remove from index
  var indexRaw = props.getProperty("NOTES_INDEX") || "[]";
  var index = [];
  try { index = JSON.parse(indexRaw); } catch (e) { index = []; }

  index = index.filter(function(i) {
    return !(
      i.scheme === scheme &&
      i.branch === branchKey &&
      i.semester === semester &&
      i.subjectCode === subjectCode
    );
  });
  props.setProperty("NOTES_INDEX", JSON.stringify(index));

  // If requested, also trash files in that subject's Drive folder
  if (data.deleteDriveFiles) {
    try {
      var subjectFolder = getSubjectFolderIfExists(scheme, year, branch, semester, subjectCode);
      if (subjectFolder) {
        var files = subjectFolder.getFiles();
        while (files.hasNext()) {
          files.next().setTrashed(true);
        }
      }
    } catch (trashErr) {}
  }

  return jsonResponse({
    status: "success",
    version: "2.1-delete-support",
    message: "Note deleted successfully for " + subjectCode + "! Status will revert to 'Update shortly'.",
    subjectCode: subjectCode
  });
}

// ── FOLDER NAVIGATION / CREATION HELPERS ─────────────────────────────────────
function getOrCreateRootFolder() {
  var folders = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  if (folders.hasNext()) {
    var folder = folders.next();
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {}
    return folder;
  }
  var newRoot = DriveApp.createFolder(ROOT_FOLDER_NAME);
  try {
    newRoot.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
  return newRoot;
}

function getOrCreateSubFolder(parentFolder, name) {
  var folders = parentFolder.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  var sub = parentFolder.createFolder(name);
  try {
    sub.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
  return sub;
}

function getOrCreateSubjectFolder(scheme, year, branch, semester, subjectCode, subjectName) {
  var root = getOrCreateRootFolder();
  var schemeFolder = getOrCreateSubFolder(root, scheme);

  var branchOrYear = (year === "First Year") ? "First Year" : branch;
  var branchFolder = getOrCreateSubFolder(schemeFolder, branchOrYear);

  var semFolder = getOrCreateSubFolder(branchFolder, semester);

  var folderDisplayName = subjectCode;
  if (subjectName && subjectName !== subjectCode) {
    folderDisplayName = subjectCode + " - " + subjectName;
  }

  var existing = semFolder.getFolders();
  while (existing.hasNext()) {
    var f = existing.next();
    var fname = f.getName();
    if (fname.toUpperCase().indexOf(subjectCode) !== -1) {
      return f;
    }
  }

  return getOrCreateSubFolder(semFolder, folderDisplayName);
}

function getSubjectFolderIfExists(scheme, year, branch, semester, subjectCode) {
  var root = getOrCreateRootFolder();
  var schemes = root.getFoldersByName(scheme);
  if (!schemes.hasNext()) return null;
  var scFolder = schemes.next();

  var branchOrYear = (year === "First Year") ? "First Year" : branch;
  var branches = scFolder.getFoldersByName(branchOrYear);
  if (!branches.hasNext()) return null;
  var brFolder = branches.next();

  var semesters = brFolder.getFoldersByName(semester);
  if (!semesters.hasNext()) return null;
  var semFolder = semesters.next();

  var folders = semFolder.getFolders();
  while (folders.hasNext()) {
    var f = folders.next();
    if (f.getName().toUpperCase().indexOf(subjectCode) !== -1) {
      return f;
    }
  }
  return null;
}

function getRootFolderUrl() {
  try {
    var folders = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
    if (folders.hasNext()) {
      return folders.next().getUrl();
    }
  } catch (e) {}
  return "";
}

// ── PERSISTENCE (SCRIPT PROPERTIES & REGISTRY) ───────────────────────────────
function saveNoteLink(scheme, year, branch, semester, subjectCode, link) {
  var branchKey = (year === "First Year") ? "First Year" : branch;
  var key = "NOTE_" + cleanKey(scheme) + "_" + cleanKey(branchKey) + "_" + cleanKey(semester) + "_" + cleanKey(subjectCode);
  
  var props = PropertiesService.getScriptProperties();
  props.setProperty(key, link);

  var indexRaw = props.getProperty("NOTES_INDEX") || "[]";
  var index = [];
  try { index = JSON.parse(indexRaw); } catch (e) { index = []; }

  var entry = {
    scheme: scheme,
    branch: branchKey,
    semester: semester,
    subjectCode: subjectCode.toUpperCase(),
    link: link,
    key: key
  };

  index = index.filter(function(i) { return i.key !== key; });
  index.push(entry);
  props.setProperty("NOTES_INDEX", JSON.stringify(index));
}

function getNotesRegistry() {
  var props = PropertiesService.getScriptProperties();
  var indexRaw = props.getProperty("NOTES_INDEX") || "[]";
  var index = [];
  try { index = JSON.parse(indexRaw); } catch (e) { index = []; }

  // If index is currently empty, automatically scan Drive folders to index existing notes
  if (index.length === 0) {
    try {
      scanDriveFoldersAndIndex();
      indexRaw = props.getProperty("NOTES_INDEX") || "[]";
      try { index = JSON.parse(indexRaw); } catch (e) { index = []; }
    } catch (scanErr) {}
  }

  var notesMap = {};
  for (var i = 0; i < index.length; i++) {
    var item = index[i];
    if (!notesMap[item.scheme]) notesMap[item.scheme] = {};
    if (!notesMap[item.scheme][item.branch]) notesMap[item.scheme][item.branch] = {};
    if (!notesMap[item.scheme][item.branch][item.semester]) notesMap[item.scheme][item.branch][item.semester] = {};
    notesMap[item.scheme][item.branch][item.semester][item.subjectCode] = item.link;
  }
  return notesMap;
}

// ── AUTOMATIC DRIVE FOLDER SCANNER ──────────────────────────────────────────
function scanDriveFoldersAndIndex() {
  var root = getOrCreateRootFolder();
  var count = 0;

  var schemes = root.getFolders();
  while (schemes.hasNext()) {
    var scFolder = schemes.next();
    var scName = scFolder.getName();

    var branches = scFolder.getFolders();
    while (branches.hasNext()) {
      var brFolder = branches.next();
      var brName = brFolder.getName();

      var semesters = brFolder.getFolders();
      while (semesters.hasNext()) {
        var semFolder = semesters.next();
        var semName = semFolder.getName();

        var subjects = semFolder.getFolders();
        while (subjects.hasNext()) {
          var subFolder = subjects.next();
          var subFolderName = subFolder.getName();
          var parts = subFolderName.split(" - ");
          var subCode = parts[0].trim().toUpperCase();

          saveNoteLink(
            scName,
            brName === "First Year" ? "First Year" : "Other",
            brName,
            semName,
            subCode,
            subFolder.getUrl()
          );
          count++;
        }
      }
    }
  }

  return { status: "success", indexedFolders: count };
}

function handleSetDriveLink(data) {
  saveNoteLink(data.scheme, data.year, data.branch, data.semester, data.subjectCode, data.driveLink);
  return jsonResponse({ status: "success", message: "Link saved successfully!" });
}

function handleAddSubject(data) {
  var sub = data.subject || data;
  var props = PropertiesService.getScriptProperties();
  var subjectsRaw = props.getProperty("CUSTOM_SUBJECTS") || "[]";
  var subjects = [];
  try { subjects = JSON.parse(subjectsRaw); } catch (e) { subjects = []; }

  var exists = false;
  for (var i = 0; i < subjects.length; i++) {
    if (subjects[i].scheme === sub.scheme &&
        subjects[i].year === sub.year &&
        subjects[i].branch === sub.branch &&
        subjects[i].semester === sub.semester &&
        subjects[i].code.toUpperCase() === sub.code.toUpperCase()) {
      subjects[i] = sub;
      exists = true;
      break;
    }
  }
  if (!exists) {
    subjects.push(sub);
  }
  props.setProperty("CUSTOM_SUBJECTS", JSON.stringify(subjects));

  var folder = getOrCreateSubjectFolder(sub.scheme, sub.year, sub.branch, sub.semester, sub.code, sub.name);
  if (sub.driveLink) {
    saveNoteLink(sub.scheme, sub.year, sub.branch, sub.semester, sub.code, sub.driveLink);
  } else {
    saveNoteLink(sub.scheme, sub.year, sub.branch, sub.semester, sub.code, folder.getUrl());
  }

  return jsonResponse({
    status: "success",
    message: "Subject added and Google Drive folder created successfully!",
    folderUrl: folder.getUrl()
  });
}

function getStoredSubjects() {
  var props = PropertiesService.getScriptProperties();
  var subjectsRaw = props.getProperty("CUSTOM_SUBJECTS") || "[]";
  try {
    return JSON.parse(subjectsRaw);
  } catch (e) {
    return [];
  }
}

// ── BACKWARD COMPATIBLE STUDENT REGISTRATION ────────────────────────────────
function handleStudentRegistration(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss ? (ss.getSheetByName("Registrations") || ss.getActiveSheet()) : null;

  var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  var name      = data.name || "";
  var phone     = data.phone || "";
  var email     = data.email || "";
  var college   = data.college || "";

  if (sheet) {
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Full Name", "Mobile Number", "Email", "College"]);
    }
    sheet.appendRow([timestamp, name, phone, email, college]);
  }

  return jsonResponse({ status: "success", message: "Registration recorded successfully." });
}

function cleanKey(str) {
  return String(str || "").replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
}

function jsonResponse(obj, callback) {
  var jsonStr = JSON.stringify(obj);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + jsonStr + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonStr)
    .setMimeType(ContentService.MimeType.JSON);
}

// ── FULL DRIVE STRUCTURE INITIALIZER (ONE-CLICK EXECUTION) ──────────────────
function createDriveFolderStructure() {
  var root = getOrCreateRootFolder();

  var schemes = ["2025 Scheme", "2022 Scheme", "2021 Scheme", "2018 Scheme"];

  var physicsCycle = [
    { code: "BMA101", name: "Engineering Mathematics - I" },
    { code: "BPH102", name: "Engineering Physics" },
    { code: "BCEE103", name: "Elements of Civil Engineering & Mechanics" },
    { code: "BENGK104", name: "Engineering Graphics" },
    { code: "BKXC105", name: "Communicative English" },
    { code: "BPH107", name: "Engineering Physics Lab" }
  ];

  var chemistryCycle = [
    { code: "BMA201", name: "Engineering Mathematics - II" },
    { code: "BCH202", name: "Engineering Chemistry" },
    { code: "BEEE203", name: "Elements of Electrical Engineering" },
    { code: "BCS204", name: "C Programming for Problem Solving" },
    { code: "BCH207", name: "Engineering Chemistry Lab" }
  ];

  var sampleBranches = [
    "Computer Science and Engineering (CSE)",
    "Artificial Intelligence and Machine Learning (AIML)",
    "Information Science and Engineering (ISE)",
    "Electronics and Communication Engineering (ECE)",
    "Electrical and Electronics Engineering (EEE)",
    "Mechanical Engineering (ME)",
    "Civil Engineering (CE)"
  ];

  var cseSubjects = {
    "Semester 3": [
      { code: "BMAT301", name: "Transform Calculus & Numerical Techniques" },
      { code: "BCS302", name: "Discrete Mathematical Structures" },
      { code: "BCS303", name: "Digital Electronics" },
      { code: "BCS304", name: "Data Structures and Applications" },
      { code: "BCS357", name: "Data Structures Lab" }
    ],
    "Semester 4": [
      { code: "BMAT401", name: "Complex Analysis & Probability" },
      { code: "BCS401", name: "Analysis and Design of Algorithms" },
      { code: "BCS402", name: "Microcontrollers" },
      { code: "BCS403", name: "Operating Systems" },
      { code: "BCS404", name: "Software Engineering" }
    ],
    "Semester 5": [
      { code: "BCS501", name: "Automata Theory & Compiler Design" },
      { code: "BCS502", name: "Computer Networks" },
      { code: "BCS503", name: "DBMS" },
      { code: "BCS504", name: "System Software & OS" }
    ],
    "Semester 6": [
      { code: "BCS601", name: "Software Testing & Automation" },
      { code: "BCS602", name: "Machine Learning & Applications" },
      { code: "BCS603", name: "Cloud Computing" }
    ],
    "Semester 7": [
      { code: "BCS701", name: "Cryptography & Network Security" },
      { code: "BCS702", name: "Deep Learning" },
      { code: "BCS703A", name: "Elective III: Blockchain Technology" },
      { code: "BCS703B", name: "Elective III: Software Testing" },
      { code: "BCS703C", name: "Elective III: Distributed Systems" }
    ],
    "Semester 8": [
      { code: "BCS801", name: "Project Work Phase - II" },
      { code: "BCS802", name: "Technical Seminar" }
    ]
  };

  for (var s = 0; s < schemes.length; s++) {
    var scName = schemes[s];
    var scFolder = getOrCreateSubFolder(root, scName);

    var firstYearFolder = getOrCreateSubFolder(scFolder, "First Year");
    var physFolder = getOrCreateSubFolder(firstYearFolder, "Physics Cycle");
    for (var p = 0; p < physicsCycle.length; p++) {
      var pf = getOrCreateSubFolder(physFolder, physicsCycle[p].code + " - " + physicsCycle[p].name);
      saveNoteLink(scName, "First Year", "First Year", "Physics Cycle", physicsCycle[p].code, pf.getUrl());
    }

    var chemFolder = getOrCreateSubFolder(firstYearFolder, "Chemistry Cycle");
    for (var c = 0; c < chemistryCycle.length; c++) {
      var cf = getOrCreateSubFolder(chemFolder, chemistryCycle[c].code + " - " + chemistryCycle[c].name);
      saveNoteLink(scName, "First Year", "First Year", "Chemistry Cycle", chemistryCycle[c].code, cf.getUrl());
    }

    for (var b = 0; b < sampleBranches.length; b++) {
      var brName = sampleBranches[b];
      var brFolder = getOrCreateSubFolder(scFolder, brName);

      var semKeys = Object.keys(cseSubjects);
      for (var k = 0; k < semKeys.length; k++) {
        var semName = semKeys[k];
        var semFolder = getOrCreateSubFolder(brFolder, semName);

        if (brName.indexOf("CSE") !== -1 || brName.indexOf("Computer") !== -1) {
          var subs = cseSubjects[semName];
          for (var u = 0; u < subs.length; u++) {
            var subFolder = getOrCreateSubFolder(semFolder, subs[u].code + " - " + subs[u].name);
            saveNoteLink(scName, "Other", brName, semName, subs[u].code, subFolder.getUrl());
          }
        }
      }
    }
  }

  Logger.log("Folder hierarchy created! Root folder link: " + root.getUrl());
  return root;
}
