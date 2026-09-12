# School notes and reviewers

Study Shelf is a small, static-first library where students can search notes and reviewers, preview resources, and add their own study material.

## Run locally

Open `Project school helper/index.html` directly in a browser, or serve the folder with:

```bash
cd "Project school helper"
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Current upload behavior

The upload dialog accepts PDF, document, presentation, text, and image files. Resource metadata and filenames persist in the browser's local storage, so the new entry remains after a refresh on that device. A production version will need a backend and file storage service to make uploads available across different students and devices.
