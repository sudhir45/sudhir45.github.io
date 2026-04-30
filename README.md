# FortMatrix Logs

Personal blog and portfolio.

## Hosted Certifications

Certificate PDFs live in `public/certification` and are served directly from:

```text
https://sudhir.is-a.dev/certification/<file-name>.pdf
```

Use lowercase, URL-safe filenames for resume links.

## Public PDF Security

The deployment build runs `npm run secure:pdfs` before publishing. It scans every
PDF under `public/` and applies PDF permissions that allow normal viewing and
printing while disabling viewer-supported copying, editing, commenting, signing,
and form filling.

To secure PDFs locally before committing:

```bash
python -m pip install pypdf
npm run secure:pdfs
```
