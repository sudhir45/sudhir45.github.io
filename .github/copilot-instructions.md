Purpose: Help an AI coding agent become productive in this Jekyll blog repository.

- Repository type: Jekyll static site using the Chirpy theme. Primary content is Markdown posts in `_posts/` and data in `_data/`.
- Key commands:
  - Local preview: `bundle install` then `bundle exec jekyll serve` (see `tools/run.sh`).
  - Production build & test: `bash tools/test.sh` (uses `bundle exec jekyll build` and `html-proofer`).
  - CI deploy: GitHub Actions live in `.github/workflows/` (pages-deploy.yml, jekyll.yml).

- Important files & conventions:
  - `_posts/` — blog posts. Filename format: `YYYY-MM-DD-title.md`. Default front-matter is used from `CONTRIBUTING.md` and `_config.yml` defaults (permalink `/posts/:title/`).
  - `_config.yml` — site-wide configuration. When changing URLs, baseurl, plugins, or PWA settings, update this file.
  - `_data/authors.yml` — canonical author list. Add new authors here and upload avatar to `/assets/img/`.
  - `Gemfile` — Ruby gems required for Jekyll and tests (jekyll-theme-chirpy, html-proofer). Use the same Ruby/Bundler environment when running commands.
  - `tools/run.sh` — wrapper to run `jekyll serve`. Honors `--production` and `--host` options and handles Docker polling.
  - `tools/test.sh` — builds site to `_site/` and runs `htmlproofer` to validate links; used for CI/PR checks.

- Style and content rules discovered in the repo:
  - Posts must include front matter with `title`, `date`, `categories`, `tags`, and `author` where applicable (see `CONTRIBUTING.md`).
  - Permalinks are configured to `/posts/:title/`. Do not change post filenames without updating links.
  - Avoid committing large binary assets (>5MB). Store media under `assets/` and reference relative paths.

- When editing or adding code/docs:
  - Prefer minimal, focused changes and preserve existing layout and theme files under `_layouts/` and `_sass/` unless the change is layout-specific.
  - If adding scripts or npm packages, update `.devcontainer/post-create.sh` and `package.json` (if present) so dev containers can bootstrap.
  - Update `CONTRIBUTING.md` if you change post or author conventions.

- CI and testing notes for the agent:
  - The repository uses GitHub Actions in `.github/workflows/`. Changes that affect the build (Gemfile, `_config.yml`, theme changes, plugins) should be validated locally via `tools/test.sh` before creating a PR.
  - HTMLProofer is configured to skip external checks to common localhost patterns; mimic that behavior when running tests locally.

- Safe edit examples (explicit):
  - Add a new post: create `_posts/2025-10-04-my-post.md` with front matter matching `CONTRIBUTING.md`, add assets to `assets/img/`, run `bash tools/test.sh` and fix link errors reported by htmlproofer.
  - Fix a broken internal link: run `bash tools/test.sh`, find the htmlproofer error, update the Markdown link, re-run tests.

- What not to change without approval:
  - The theme import in `_config.yml` (`jekyll-theme-chirpy`) and core layout files under `_layouts/` unless the change is explicitly requested.
  - The `permalink` default or `baseurl` without updating existing post links and running the site build.

If anything here is unclear or you want the agent to follow stricter rules (formatting, linting, commit conventions), tell me which areas to expand.
