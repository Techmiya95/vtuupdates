/**
 * VTUConnect App Configuration
 *
 * HOW TO SET UP THE GOOGLE SHEET FOR STUDENT REGISTRATIONS:
 * 1. Open Google Sheets (https://sheets.new) and create a new sheet.
 *    - In Row 1, add column headers:
 *      A1: Timestamp | B1: Full Name | C1: Mobile Number | D1: Email | E1: College
 *
 * 2. In Google Sheets menu, click Extensions → Apps Script.
 * 3. Delete existing code and paste this script:
 *
 *    function doPost(e) {
 *      try {
 *        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *        var data = {};
 *        if (e.postData && e.postData.contents) {
 *          try {
 *            data = JSON.parse(e.postData.contents);
 *          } catch (err) {
 *            data = e.parameter || {};
 *          }
 *        } else {
 *          data = e.parameter || {};
 *        }
 *
 *        var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
 *        var name      = data.name || "";
 *        var phone     = data.phone || "";
 *        var email     = data.email || "";
 *        var college   = data.college || "";
 *
 *        sheet.appendRow([timestamp, name, phone, email, college]);
 *
 *        return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
 *          .setMimeType(ContentService.MimeType.JSON);
 *      } catch (err) {
 *        return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
 *          .setMimeType(ContentService.MimeType.JSON);
 *      }
 *    }
 *
 * 4. Click "Deploy" (top right) → "New deployment".
 * 5. Click the Gear icon (Select type) → Select "Web app".
 * 6. Set:
 *    - Description: "VTU Registrations"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (CRITICAL: must be Anyone so students can submit without sign-in)
 * 7. Click "Deploy" → "Authorize access" → Choose account → Click "Advanced" → "Go to Untitled project (unsafe)" → "Allow".
 * 8. Copy the Web app URL (ends with /exec).
 * 9. Paste the URL into APPS_SCRIPT_URL below.
 */

export const APP_CONFIG = {
  /**
   * Google Apps Script Web App URL.
   * Paste your deployed web app URL here.
   */
  APPS_SCRIPT_URL:
    "https://script.google.com/macros/s/AKfycbwuMoBWsdXZtL8gK4xaaAYgpR9mVKEy7P0T78TTOTyd9edGpNmW0_ZM_W6ShN1G2yLFvQ/exec",

  /**
   * Google Analytics 4 Measurement ID (e.g. G-XXXXXXXXXX).
   * Leave empty or set NEXT_PUBLIC_GA_MEASUREMENT_ID in your environment.
   */
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",

  /**
   * Google Tag Manager Container ID (e.g. GTM-XXXXXXX).
   * Leave empty or set NEXT_PUBLIC_GTM_ID in your environment.
   */
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "",

  /**
   * Google Ads Conversion Tracking ID / Label (e.g. AW-XXXXXXXXX/YYYYYYYYYYYYYYYYYYY).
   * Leave empty or set NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID in your environment.
   */
  GOOGLE_ADS_CONVERSION_ID:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || "",
} as const;

