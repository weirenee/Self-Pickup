# Pick-up Stock Record

A simple, mobile-friendly tracker for self pick-up stock records. Works on phone and computer browsers.

- Pick who is going, where and when you depart, transport and fare (SGD), and the time you reach the office
- Add many branches, with the products collected at each (item no. and condition)
- Edit records after saving
- Save all records as **Excel** or **PDF** (sorted by date), or copy as text
- Records are saved online in your own **Google Sheet** (through Google Apps Script), so every device sees the same history

Files: `index.html` (the app), `Code.gs` (the Google Apps Script backend), `README.md`.

## Step 1: Set up Google Sheets and Apps Script (about 5 minutes)

1. Create a new **Google Sheet** (for example "Pick-up Records").
2. In the sheet, open **Extensions > Apps Script**.
3. Delete the sample code, paste in everything from `Code.gs`, and tap Save.
4. Near the top of the code, change `change-this-key` to your own secret word (for example `mango-2026-pickup`).
5. Tap **Deploy > New deployment**. Tap the gear icon and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Tap **Deploy**, then **Authorize access** and allow it (if Google says the app is not verified, tap **Advanced > Go to project**).
7. Copy the **Web app URL** (it ends with `/exec`).

## Step 2: Connect the app

Open `index.html` in a text editor. Near the top of the script, find this line and fill it in:

```js
var GAS="PASTE_YOUR_WEB_APP_URL_HERE",KEY="change-this-key";
```

Paste your Web app URL, and put the same secret word you used in `Code.gs`.

## Step 3: Put it online with GitHub Pages

1. On GitHub, create a new repository (for example `pickup-tracker`).
2. Choose **Add file > Upload files**, drag in `index.html` and `README.md`, then **Commit changes**. (`Code.gs` stays in Google, but you can upload it too as a backup.)
3. Go to **Settings > Pages**, set **Source** to *Deploy from a branch*, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute, your app is live at `https://YOUR-USERNAME.github.io/pickup-tracker/`.

## Your data in Google Sheets

- **Readable**: a clean table sorted by date, rebuilt after every change. You can filter it or add up the fares here.
- **Records** and **Lists**: the data the app reads. Please do not edit these by hand.

## Good to know

- If you change `Code.gs` later, tap **Deploy > Manage deployments**, edit the deployment, choose **New version**, and **Deploy**. The URL stays the same.
- The secret word is only light protection. Anyone who can view the page source could find it, so do not put private information in the records.
- If the Google Sheet cannot be reached, the app keeps records in the browser and shows a message at the bottom of the Records tab.
- The Excel and PDF buttons load two libraries (SheetJS and jsPDF) from cdnjs, so they need an internet connection.
- The PDF cannot show some non-English letters (for example Chinese names). The Excel file can.
