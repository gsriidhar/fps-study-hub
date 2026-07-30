// Builds the retrieval index used by the Knowledge Assistant widget.
// Walks every generated + hand-written Markdown page under docs-site/content,
// splits each page into ## sections, strips Markdown syntax down to plain
// text, and writes a flat JSON array of {id, title, page, section, url, text}
// chunks. No external API calls and no model download — this is a classic
// term-frequency retrieval corpus, built entirely offline.
//
// Usage: node build-search-index.js <contentDir> <outFile>

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = process.argv[2];
const OUT_FILE = process.argv[3];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "assets") continue; // skip css/js/embeddings themselves
      walk(full, out);
    } else if (entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ") // code/mermaid blocks
    .replace(/!!!\s*\w+(\s+"[^"]*")?/g, " ") // admonition markers
    .replace(/\?\?\?\s*\w+\s*"([^"]*)"/g, "$1") // collapsible question titles
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links -> label text
    .replace(/[*_`>#|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function frontmatterTitle(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return null;
  const t = m[1].match(/title:\s*"?([^"\n]+)"?/);
  return t ? t[1].trim() : null;
}

function pageUrl(relPath) {
  // MkDocs Material default: directory-style URLs, index.md -> parent dir "/"
  let url = relPath.replace(/\\/g, "/");
  if (url.endsWith("index.md")) {
    url = url.slice(0, -"index.md".length);
  } else {
    url = url.slice(0, -".md".length) + "/";
  }
  return "/" + url;
}

const files = walk(CONTENT_DIR);
const chunks = [];
let chunkId = 0;

files.forEach((file) => {
  const raw = fs.readFileSync(file, "utf8");
  const rel = path.relative(CONTENT_DIR, file);
  const title = frontmatterTitle(raw) || path.basename(file, ".md");
  const body = raw.replace(/^---[\s\S]*?---/, "");
  const url = pageUrl(rel);

  // Split on H2 headings, keep the heading text as the section label.
  const sections = body.split(/\n##\s+/).map((s, i) => (i === 0 ? s : "## " + s));
  sections.forEach((section) => {
    const headingMatch = section.match(/^##\s+(.+)/);
    const sectionTitle = headingMatch ? headingMatch[1].trim() : "Overview";
    const text = stripMarkdown(section);
    if (text.length < 40) return; // skip near-empty sections
    chunks.push({
      id: chunkId++,
      title,
      section: sectionTitle,
      page: rel,
      url,
      text: text.slice(0, 1200),
    });
  });
});

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(chunks));
console.log(`Indexed ${chunks.length} chunks from ${files.length} pages -> ${OUT_FILE}`);
