/**
 * Google Apps Script backend for the online annotation pages.
 *
 * Setup:
 * 1) Create a new Google Sheet.
 * 2) Extensions -> Apps Script.
 * 3) Paste this file into Code.gs.
 * 4) Change SHEET_NAME if needed.
 * 5) Deploy -> New deployment -> Web app.
 *    Execute as: Me
 *    Who has access: Anyone with the link
 * 6) Copy the Web App URL into the HTML page.
 */

const SHEET_NAME = 'responses';

function ensureSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'submitted_at_server',
      'submitted_at_client',
      'annotator',
      'page_url',
      'image_base',
      'task_index',
      'sample_id',
      'model',
      'image',
      'label',
      'notes',
      'caption',
      'clean_caption'
    ]);
  }
  return sh;
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Annotation web app is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payloadRaw = (e && e.parameter && e.parameter.payload) ? e.parameter.payload : '';
    if (!payloadRaw) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Missing payload parameter.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const payload = JSON.parse(payloadRaw);
    const rows = payload.rows || [];
    const sh = ensureSheet_();
    const serverTime = new Date();

    const values = rows.map(r => [
      serverTime,
      payload.submitted_at_client || '',
      payload.annotator || '',
      payload.page_url || '',
      payload.image_base || '',
      r.task_index || '',
      r.sample_id || '',
      r.model || '',
      r.image || '',
      r.label || '',
      r.notes || '',
      r.caption || '',
      r.clean_caption || ''
    ]);

    if (values.length > 0) {
      sh.getRange(sh.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, rows: values.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
