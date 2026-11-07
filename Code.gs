/**
 * Pick-up Stock Record - Google Apps Script backend
 * Saves every record and edit into the Google Sheet this script is attached to.
 *
 * Sheets created automatically:
 *   Records  - the saved data the app reads (do not edit by hand)
 *   Lists    - saved names, branches and "depart from" places
 *   Readable - a clean table sorted by date, rebuilt after every change
 */

// 1) Change this to your own secret word. Use the SAME word in index.html.
const KEY = 'change-this-key';

function sheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
  }
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

// Read everything (called when the app opens)
function doGet(e) {
  try {
    if ((e.parameter.key || '') !== KEY) return out_({ error: 'bad key' });
    return out_({ records: readRecords_(), lists: readLists_() });
  } catch (err) {
    return out_({ error: String(err) });
  }
}

// Save / delete (called when you save, edit or delete)
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.key !== KEY) return out_({ error: 'bad key' });
    if (b.action === 'save') {
      saveRecord_(b.record);
      rebuildReadable_();
    } else if (b.action === 'delete') {
      deleteRecord_(b.id);
      rebuildReadable_();
    } else if (b.action === 'lists') {
      saveLists_(b.lists);
    } else {
      return out_({ error: 'unknown action' });
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function findRow_(sh, id) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return -1;
  const ids = sh.getRange(2, 1, n, 1).getValues();
  for (let i = 0; i < n; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function saveRecord_(r) {
  const sh = sheet_('Records', ['id', 'ts', 'json']);
  const vals = [[r._id, r.ts || Date.now(), JSON.stringify(r)]];
  const row = findRow_(sh, r._id);
  if (row > 0) sh.getRange(row, 1, 1, 3).setValues(vals);
  else sh.getRange(sh.getLastRow() + 1, 1, 1, 3).setValues(vals);
}

function deleteRecord_(id) {
  const sh = sheet_('Records', ['id', 'ts', 'json']);
  const row = findRow_(sh, id);
  if (row > 0) sh.deleteRow(row);
}

function readRecords_() {
  const sh = sheet_('Records', ['id', 'ts', 'json']);
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, 3).getValues().map(function (v) {
    return JSON.parse(v[2]);
  });
}

function saveLists_(l) {
  const sh = sheet_('Lists', ['key', 'json']);
  const vals = [['main', JSON.stringify(l)]];
  if (sh.getLastRow() < 2) sh.getRange(2, 1, 1, 2).setValues(vals);
  else sh.getRange(2, 1, 1, 2).setValues(vals);
}

function readLists_() {
  const sh = sheet_('Lists', ['key', 'json']);
  if (sh.getLastRow() < 2) return null;
  return JSON.parse(sh.getRange(2, 2).getValue());
}

// A clean, date-sorted table you can read, filter or sum in Google Sheets
function rebuildReadable_() {
  const head = ['Date', 'Depart time', 'Depart from', 'Reach office', 'Who went',
    'Transport', 'Fare (SGD)', 'Branch', 'Item no.', 'Condition OK?', 'Damage reason'];
  const sh = sheet_('Readable', head);
  sh.clear();
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
  sh.setFrozenRows(1);
  const recs = readRecords_().sort(function (a, b) {
    return (a.date + a.time) < (b.date + b.time) ? -1 : 1;
  });
  const yes = function (v) { return v ? (v === 'yes' ? 'Yes' : 'No') : ''; };
  const rows = [];
  recs.forEach(function (r) {
    let first = true;
    (r.branches || []).forEach(function (b) {
      (b.items && b.items.length ? b.items : [{}]).forEach(function (i) {
        rows.push([r.date, r.time, r.from || '', r.arr || '',
          (r.people || []).join(', '), (r.transport || []).join(' + '),
          first && r.fare !== '' && r.fare !== undefined ? Number(r.fare) : '',
          b.name || '', i.no || '', yes(i.ok), i.r || '']);
        first = false;
      });
    });
  });
  if (!rows.length) return;
  sh.getRange(2, 1, rows.length, 6).setNumberFormat('@');
  sh.getRange(2, 8, rows.length, 4).setNumberFormat('@');
  sh.getRange(2, 1, rows.length, head.length).setValues(rows);
  sh.autoResizeColumns(1, head.length);
}
