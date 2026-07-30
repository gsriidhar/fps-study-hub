# Docs site (MkDocs Material)

This is the searchable documentation-site version of the study hub, built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/). It's separate from the interactive app at the repo root (`index.html` / `app.js` / `data/*.js`), which keeps working as-is.

## How content gets here

The Markdown files under `content/fps/` and `content/cpcm/` are **generated**, not hand-written. The single source of truth for lesson content stays in `data/*.js` (used by the interactive app). `scripts/convert-to-markdown.js` reads those files and regenerates the Markdown + frontmatter version for this site.

Hand-written pages (`content/index.md`, `content/fps/index.md`, `content/cpcm/index.md`, `content/interview-prep/`, `content/mock-exams/`, `content/case-studies/`, `content/resources/`, `content/assistant/`) are **not** touched by the converter — edit those directly.

To regenerate after changing lesson data:

```bash
node scripts/convert-to-markdown.js . docs-site/content
```

This also runs automatically in CI before every deploy (see `.github/workflows/docs-deploy.yml`).

## Local development

```bash
cd docs-site
pip install -r requirements.txt
mkdocs serve
```

Then open `http://127.0.0.1:8000`.

## Build

```bash
cd docs-site
mkdocs build --strict
```

Output goes to `docs-site/site/` (gitignored — CI builds and deploys this directory, it isn't committed).

## Search

Full-text search is provided out of the box by the MkDocs Material `search` plugin — no extra setup needed. See the [architecture document](ARCHITECTURE.md) for the semantic "Knowledge Assistant" layered on top.
