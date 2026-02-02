---
description: How to add, update, or remove presentations from the blog
---

# Managing Presentations

This workflow explains how to add new PPTX presentations to your blog or remove existing ones.

## File Structure

```
astro-tech-blog/
├── src/data/presentations.json    # Metadata for all presentations
├── public/presentations/          # Generated slide images
│   └── {slug}/
│       ├── slide-1.jpg
│       ├── slide-2.jpg
│       └── ...
└── scripts/generate-slides.py     # Converts PPTX to images
```

---

## Adding a New Presentation

### Step 1: Add PPTX file
Place your PPTX file somewhere accessible (e.g., `f:\PPTs\My-New-Presentation.pptx`)

### Step 2: Update presentations.json
Edit `src/data/presentations.json` and add a new entry:

```json
{
  "slug": "my-new-presentation",
  "title": "My New Presentation Title",
  "description": "A brief description of what this presentation covers.",
  "category": "Security",
  "sourcePath": "f:\\PPTs\\My-New-Presentation.pptx",
  "slideCount": 0,
  "thumbnail": ""
}
```

**Fields explained:**
- `slug`: URL-friendly name (lowercase, hyphens, no spaces)
- `title`: Display title
- `description`: Short description shown on cards
- `category`: Category badge (e.g., "Security", "Architecture", "DevOps")
- `sourcePath`: Absolute path to the PPTX file
- `slideCount`: Leave as 0 (auto-updated by script)
- `thumbnail`: Leave empty (auto-updated by script)

### Step 3: Generate slide images
// turbo
Run the Python script to convert PPTX to images:

```powershell
cd f:\Projects\sudhir-blog-astro\astro-tech-blog
python scripts/generate-slides.py
```

This will:
- Create `public/presentations/{slug}/` folder
- Export each slide as `slide-{n}.jpg`
- Update `slideCount` and `thumbnail` in presentations.json

### Step 4: Verify
// turbo
```powershell
npm run build
```

Then check http://localhost:4321/presentations to see your new presentation.

---

## Removing a Presentation

### Step 1: Remove from presentations.json
Edit `src/data/presentations.json` and delete the entry for the presentation you want to remove.

### Step 2: Delete slide images
// turbo
Delete the corresponding folder:

```powershell
Remove-Item -Recurse -Force "f:\Projects\sudhir-blog-astro\astro-tech-blog\public\presentations\{slug}"
```

Replace `{slug}` with the presentation's slug (e.g., `firewall-chaos`).

### Step 3: Rebuild
// turbo
```powershell
npm run build
```

---

## Updating an Existing Presentation

If you've updated a PPTX file and want to regenerate the slides:

### Step 1: Delete old images
// turbo
```powershell
Remove-Item -Recurse -Force "f:\Projects\sudhir-blog-astro\astro-tech-blog\public\presentations\{slug}"
```

### Step 2: Regenerate
// turbo
```powershell
python scripts/generate-slides.py
```

The script will only process presentations that don't have images yet, so deleting first is required.

---

## Requirements

The `generate-slides.py` script requires:
- Python 3.x
- Microsoft PowerPoint installed (uses COM automation)
- Python packages: `comtypes`, `Pillow`

Install dependencies:
```powershell
pip install comtypes Pillow
```

---

## Current Presentations

| Slug | Title | Slides |
|------|-------|--------|
| firewall-chaos | Firewall Chaos: Taming the Policy Beast | 20 |
| security-architecture-principles | Security Architecture Principles | 17 |
| sase-presentation | SASE Presentation | 12 |
