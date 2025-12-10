# PROJECT KNOWLEDGE BASE
## FortMatrix Logs - Complete Technical Documentation
### For AI Assistants and Human Developers

> IMPORTANT: This file is gitignored. It will NOT be committed to the repository.

---

## QUICK CONTEXT

- **Project Type**: Jekyll static blog
- **Theme**: Chirpy 7.2.4 (gem-based)
- **Owner**: Sudhir (sudhir45 on GitHub)
- **Live URL**: https://sudhir45.github.io
- **Repository**: sudhir45/sudhir45.github.io

---

## CRITICAL KNOWLEDGE

### The home layout is SPECIAL

The content in index.html is IGNORED by the Chirpy home layout!

```
index.html:
---
layout: home    <-- Only this matters
---

<h2>Hi, Welcome...</h2>   <-- THIS IS DEAD CODE!
```

The home layout directly renders the post list and does NOT call {{ content }}.
Other layouts (post, page) DO render content normally.

---

## FILE STRUCTURE

```
_config.yml         - Main configuration
Gemfile             - Ruby dependencies (theme gem)
index.html          - Homepage (content ignored!)

_posts/             - 13 blog posts (YYYY-MM-DD-title.md)
_tabs/              - Sidebar pages (about.md, Terminal.md, etc.)
_data/              - Data files (contact.yml, share.yml)
_sass/addon/        - Custom styles (about.scss)
_plugins/           - Custom plugins (posts-lastmod-hook.rb)
assets/             - Images and static files

_layouts/           - EMPTY (using theme defaults)
_includes/          - EMPTY (using theme defaults)

.github/workflows/  - CI/CD for GitHub Pages
.docs/              - This documentation (gitignored)
```

---

## KEY CONFIGURATION

Theme: jekyll-theme-chirpy
Title: FortMatrix logs
URL: https://sudhir45.github.io
Comments: Giscus (GitHub Discussions)
Analytics: Google (G-YZERYVC8E1)
PWA: Enabled

---

## COMMANDS

Start server:       bundle exec jekyll serve
Clean cache:        bundle exec jekyll clean
Update theme:       bundle update jekyll-theme-chirpy
Production build:   set JEKYLL_ENV=production && bundle exec jekyll build

---

## CREATING CONTENT

Posts: Create _posts/YYYY-MM-DD-title.md with front matter
Tabs: Create _tabs/name.md with icon and order in front matter

---

## CUSTOMIZATION

Styles: Add to _sass/addon/
Layouts: Copy from theme gem to _layouts/, then edit
Theme gem: C:/Ruby34-x64/lib/ruby/gems/3.4.0/gems/jekyll-theme-chirpy-7.2.4

---

## FOR AI ASSISTANTS

DO:
- Edit posts in _posts/ with proper naming
- Edit tab pages in _tabs/
- Add custom styles in _sass/addon/
- Use bundle exec for all Jekyll commands

DO NOT:
- Assume index.html content displays (it does NOT!)
- Edit _site/ folder (auto-generated)
- Modify the theme gem directly

REMEMBER:
- This is gem-based: most theme code is in the gem
- _config.yml changes require server restart
- Production builds need JEKYLL_ENV=production

---

## ACTIVE CUSTOMIZATIONS

1. About page styles (_sass/addon/about.scss)
2. **Experience Timeline** (_tabs/experience.md + _sass/addon/experience.scss)
3. Git-based lastmod plugin (_plugins/posts-lastmod-hook.rb)
4. Social links (_data/contact.yml)
5. Share buttons (_data/share.yml)
6. Google Analytics
7. Giscus comments
8. PWA enabled

---

## EXPERIENCE TIMELINE

### Overview
A vertical timeline page showcasing work history, accessible via the sidebar "Experience" tab.

### Files
- **Page**: `_tabs/experience.md` - Timeline HTML structure
- **Styles**: `assets/css/experience.css` - Main CSS loaded by page
- **SCSS Source**: `_sass/addon/experience.scss` - Kept in sync

### Color Scheme
Uses Chirpy's blue accent colors:
- Light mode: `#086adb` (primary), `#1894d4` (secondary), `#6cb4ee` (light)
- Dark mode: `#1894d4`, `#6cb4ee`, `#93c8f5`

### Dark Mode Support
- Uses `html[data-mode="dark"]` selector for explicit dark mode
- Uses `@media (prefers-color-scheme: dark)` with `html:not([data-mode])` for system dark mode

### Customizing Timeline Entries
Edit `_tabs/experience.md` and add/modify timeline items:
```html
<div class="timeline-item">
  <div class="timeline-marker"></div>
  <div class="timeline-content">
    <div class="timeline-header">
      <h3 class="job-title">Job Title</h3>
      <span class="company">Company Name</span>
    </div>
    <div class="timeline-date">
      <i class="fas fa-calendar-alt"></i>
      <span>Start - End</span>
    </div>
    <div class="timeline-description">
      <ul>
        <li>Achievement 1</li>
        <li>Achievement 2</li>
      </ul>
    </div>
  </div>
</div>
```

## EXTERNAL LINKS IN SIDEBAR

### How It Works

External links appear in the sidebar and open directly in new tabs (no redirect page).

**Configuration File**: [_data/external_links.yml](cci:7://file:///f:/Projects/sudhir-blog/_data/external_links.yml:0:0-0:0)

**Example**:
```yaml
- title: Terminal
  url: [https://sudhir.is-a.dev/terminal_proj/](https://sudhir.is-a.dev/terminal_proj/)
  icon: fas fa-terminal
  order: 4

- title: Pokedex
  url: [https://sudhir.is-a.dev/PokeDex/](https://sudhir.is-a.dev/PokeDex/)
  icon: fas fa-gamepad
  order: 5

Adding New External Links
Edit 
_data/external_links.yml
Add a new entry with title, url, icon, and order
Save - Jekyll will auto-reload
Icons
Uses Font Awesome icons: https://fontawesome.com/search?o=r&m=free

Format: fas fa-icon-name (solid) or fab fa-icon-name (brands)

Implementation
Custom sidebar: 
_includes/sidebar.html
 (overrides theme default)
External links render after regular tabs
All external links open with target="_blank" and rel="noopener noreferrer"
Regular Tabs vs External Links
Type	Location	Behavior
Regular tabs	_tabs/*.md	Navigate within site
External links	
_data/external_links.yml
Open in new tab



Last Updated: December 10, 2025
