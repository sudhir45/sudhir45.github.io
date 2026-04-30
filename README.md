# FortMatrix Logs

Personal blog and portfolio.

## Hosted Certifications

Certificate PDFs live in `public/certification` and are served directly from:

```text
https://sudhir.is-a.dev/certification/<file-name>.pdf
```

Use lowercase, URL-safe filenames for resume links. The deployment build runs
`npm run secure:certs` before publishing, which applies PDF permissions that
allow normal viewing and printing while disabling viewer-supported copying,
editing, commenting, signing, and form filling.

To secure certificates locally before committing:

```bash
python -m pip install pypdf
npm run secure:certs
```
