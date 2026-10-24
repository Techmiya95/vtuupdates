/**
 * VTUConnect App Configuration
 *
 * HOW TO SET UP THE REGISTRATION FORM:
 * 1. Go to script.google.com → New Project
 * 2. Paste this function:
 *
 *    function doPost(e) {
 *      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *      sheet.appendRow([
 *        e.parameter.timestamp,
 *        e.parameter.name,
 *        e.parameter.phone,
 *        e.parameter.email,
 *        e.parameter.college,
 *      ]);
 *      return ContentService.createTextOutput("OK");
 *    }
 *
 * 3. Deploy → Web App → Execute as Me → Anyone → Copy the URL
 * 4. Paste it as APPS_SCRIPT_URL below.
 */

export const APP_CONFIG = {
  /**
   * Google Apps Script Web App URL.
   * Receives student registration details and saves them to a Google Sheet.
   * Leave as placeholder if you haven't set this up yet — registrations will
   * still be saved locally in the browser (localStorage) so the lock still works.
   */
  APPS_SCRIPT_URL: "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
} as const;
