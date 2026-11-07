# Pick-up Stock Record

A simple, mobile-friendly tracker for self pick-up stock records. Works on phone and computer browsers.

- Pick who is going, where and when you depart, transport and fare (SGD), and the time you reach the office
- Add many branches, with the products collected at each (item no., SKU, condition)
- Edit records after saving
- Save all records as **Excel** or **PDF** (sorted by date), or copy as text

It is one static file (`index.html`), so there is nothing to build or install.

## Put it online with GitHub Pages

1. On GitHub, tap **New repository**, give it a name (for example `pickup-tracker`) and create it.
2. Tap **Add file > Upload files**, drag in `index.html` and `README.md`, then tap **Commit changes**.
3. Go to **Settings > Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose branch `main` and folder `/ (root)`, then **Save**.
4. After a minute, your app is live at `https://YOUR-USERNAME.github.io/pickup-tracker/`.

## Good to know

- Records are saved in each person's own browser (localStorage). A phone and a computer do not share the same list, and clearing browser data removes the records. Use **Save as Excel** to keep a backup.
- The Excel and PDF buttons load two libraries (SheetJS and jsPDF) from cdnjs, so they need an internet connection.
- The PDF cannot show some non-English letters (for example Chinese names). The Excel file can.
