# Online annotation pages -> Google Sheet setup

## Files
- `index.html`: configure shared URLs and generate per-annotator links
- `annotator_01.html` ... `annotator_10.html`: pages for annotators
- `assignment_10x20.csv`: sample assignment reference
- `google_apps_script.gs`: backend that appends submissions to Google Sheet

## Step 1: host the HTML and images
Upload this folder and your image folder to any static host, for example:
- GitHub Pages
- Netlify
- Vercel
- a lab or university web server

Your images should be reachable at a shared URL, e.g.
`https://your-site.com/images/mscoco_00842.jpg`

## Step 2: create the Google Sheet backend
1. Create a new Google Sheet.
2. Open **Extensions -> Apps Script**.
3. Paste `google_apps_script.gs` into `Code.gs`.
4. Save.
5. Deploy -> New deployment -> Web app
   - Execute as: **Me**
   - Who has access: **Anyone with the link**
6. Copy the Web App URL.

## Step 3: configure the annotation pages
Open `index.html`, paste:
- the image base URL
- the Apps Script Web App URL

Click **Generate annotator links** and send each annotator their own link.

## Step 4: collecting data
Each annotator can:
- submit directly to Google Sheet
- also export a CSV backup from their page

The sheet will receive one row per task.

## Notes
- The HTML pages store local progress in the browser via localStorage.
- The online submit is designed for Google Apps Script form-style POST.
- If someone has trouble submitting, they can still use **Export CSV backup**.
