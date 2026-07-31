// One-off converter: turns the existing JS lesson-data objects into Markdown
// files with YAML frontmatter for the new MkDocs Material docs site.
// Reads from data/*.js (via a sandboxed eval, no browser globals needed),
// writes into content/<track>/<block-slug>/<lesson-slug>.md

const fs = require("fs");
const path = require("path");

const SRC = process.argv[2]; // path to fps-study-hub repo
const OUT = process.argv[3]; // path to output content/ root

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Auto-discovers every data/*.js file and evaluates them all together in one
// sandboxed context, then returns every top-level `const NAME = ...` it
// declared. This means adding a new block (e.g. data/fps-block6.js,
// data/block-b.js) never requires editing this script — it's picked up
// automatically as long as it's referenced by id in a course-map file below.
function loadAllData() {
  const dataDir = path.join(SRC, "data");
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".js"));
  const code = files.map((f) => fs.readFileSync(path.join(dataDir, f), "utf8")).join("\n");
  const names = Array.from(code.matchAll(/^const\s+([A-Z][A-Z0-9_]*)\s*=/gm)).map((m) => m[1]);
  const unique = [...new Set(names)];
  const obj = "{ " + unique.join(", ") + " }";
  // eslint-disable-next-line no-new-func
  return new Function(code + `\nreturn ${obj};`)();
}

function esc(s) {
  return String(s).replace(/"/g, '\\"');
}

function mermaidFromFlow(diagram) {
  if (!diagram || diagram.type !== "flow" || !Array.isArray(diagram.steps)) return null;
  const dir = diagram.orientation === "horizontal" ? "LR" : "TD";
  const lines = [`flowchart ${dir}`];
  diagram.steps.forEach((step, i) => {
    const id = "S" + i;
    const label = step.replace(/"/g, "'");
    lines.push(`  ${id}["${label}"]`);
    if (i > 0) lines.push(`  S${i - 1} --> ${id}`);
  });
  return lines.join("\n");
}

function tableFromComparison(cmp) {
  if (!cmp) return "";
  const { headers, rows, caption } = cmp;
  let out = caption ? `**${caption}**\n\n` : "";
  out += "| " + headers.join(" | ") + " |\n";
  out += "|" + headers.map(() => "---").join("|") + "|\n";
  rows.forEach((r) => {
    out += "| " + r.map((c) => String(c).replace(/\|/g, "\\|")).join(" | ") + " |\n";
  });
  return out;
}

// Builds the small link-navigation block used at the top (breadcrumb) and
// bottom (prev/next pager) of every lesson page, so a reader never has to
// fall back to the browser's back button to get to the next lesson, the
// block index, or the track overview.
function lessonNavMarkdown(nav) {
  const { trackTitle, blockTitle, index, total, prevRel, prevLabel, nextRel, nextLabel } = nav;
  const crumbs =
    `[${trackTitle}](../index.md) / [${blockTitle}](index.md) &middot; Lesson ${index} of ${total}\n{: .lesson-crumbs}\n\n`;

  const prevBlock = prevRel
    ? `<div markdown="1">\n<span class="label">Previous</span>\n[&larr; ${esc(prevLabel)}](${prevRel})\n</div>`
    : `<div markdown="1">\n<span class="label">&nbsp;</span>\n[&larr; Back to block index](index.md)\n</div>`;
  const nextBlock = nextRel
    ? `<div class="next" markdown="1">\n<span class="label">Next</span>\n[${esc(nextLabel)} &rarr;](${nextRel})\n</div>`
    : `<div class="next" markdown="1">\n<span class="label">Course complete</span>\n[Back to overview &rarr;](../index.md)\n</div>`;

  const pager = `\n<div class="lesson-pager" markdown="1">\n${prevBlock}\n\n${nextBlock}\n</div>\n`;

  return { crumbs, pager };
}

function lessonMarkdown(lesson, blockMeta, trackTitle, blockTitle, keywords, nav) {
  const fm = [
    "---",
    `title: "${esc(lesson.title)}"`,
    `lesson_number: ${lesson.n}`,
    `track: "${esc(trackTitle)}"`,
    `block: "${esc(blockTitle)}"`,
    `tags: [${(keywords || []).map((k) => `"${esc(k)}"`).join(", ")}]`,
    `summary: "${esc((lesson.objectives || "").slice(0, 180))}"`,
    "---",
    "",
  ].join("\n");

  const { crumbs, pager } = lessonNavMarkdown(nav);

  let body = crumbs;
  body += `# ${lesson.n}. ${lesson.title}\n\n`;
  body += `!!! abstract "Learning objective"\n    ${lesson.objectives}\n\n`;

  body += `## Core concepts\n\n${lesson.explanation}\n\n`;

  if (lesson.diagram) {
    const mermaid = mermaidFromFlow(lesson.diagram);
    body += `## Visual overview\n\n`;
    if (mermaid) {
      body += "```mermaid\n" + mermaid + "\n```\n\n";
    } else if (Array.isArray(lesson.diagram.steps)) {
      body += lesson.diagram.steps.map((s) => `- ${s}`).join("\n") + "\n\n";
    }
  }

  if (Array.isArray(lesson.keyTerms) && lesson.keyTerms.length) {
    body += `## Key terms\n\n`;
    lesson.keyTerms.forEach(([term, def]) => {
      body += `**${term}**\n:   ${def}\n\n`;
    });
  }

  if (lesson.example) {
    body += `## Worked example\n\n!!! example\n    ${lesson.example}\n\n`;
  }

  if (lesson.comparison) {
    body += `## Comparison\n\n${tableFromComparison(lesson.comparison)}\n`;
  }

  if (Array.isArray(lesson.keyPoints) && lesson.keyPoints.length) {
    body += `## Key points\n\n`;
    lesson.keyPoints.forEach((p) => (body += `- ${p}\n`));
    body += "\n";
  }

  if (Array.isArray(lesson.examTips) && lesson.examTips.length) {
    body += `## Exam & interview tips\n\n!!! tip\n`;
    lesson.examTips.forEach((t) => (body += `    - ${t}\n`));
    body += "\n";
  }

  if (lesson.memoryTrick) {
    body += `!!! note "Memory trick"\n    ${lesson.memoryTrick}\n\n`;
  }

  if (Array.isArray(lesson.scenarios) && lesson.scenarios.length) {
    body += `## Scenario questions\n\n`;
    lesson.scenarios.forEach(([q, a]) => {
      body += `??? question "${q.replace(/"/g, "'")}"\n    ${a}\n\n`;
    });
  }

  if (Array.isArray(lesson.mcqs) && lesson.mcqs.length) {
    body += `## Practice questions\n\n`;
    lesson.mcqs.forEach((m, i) => {
      body += `??? question "${(i + 1)}. ${m.q.replace(/"/g, "'")}"\n`;
      m.options.forEach((opt, oi) => {
        const mark = oi === m.a ? "✅" : "▫️";
        body += `    ${mark} ${opt}\n`;
      });
      body += "\n";
    });
  }

  body += pager;

  return fm + body;
}

function blockIndexMarkdown(block, trackTitle, slugs) {
  let out = `---\ntitle: "${esc(block.title)}"\n---\n\n`;
  out += `# ${block.title}\n\n`;
  out += `${block.desc || ""}\n\n`;
  out += `## Lessons\n\n`;
  block.lessons.forEach((lesson) => {
    const slug = slugs[lesson.n];
    out += `- [${lesson.n}. ${lesson.title}](${slug}.md)\n`;
  });
  if (block.revisionSummary) {
    out += `\n## Revision summary\n\n${block.revisionSummary}\n`;
  }
  if (Array.isArray(block.flashcards) && block.flashcards.length) {
    out += `\n## Flashcards\n\n`;
    block.flashcards.forEach(([q, a]) => {
      out += `??? question "${q.replace(/"/g, "'")}"\n    ${a}\n\n`;
    });
  }
  return out;
}

function glossaryMarkdown(entries) {
  let out = `---\ntitle: "Glossary"\n---\n\n# Payments & FPS glossary\n\n`;
  const byGroup = {};
  entries.forEach(([term, def, group]) => {
    const g = group || "General";
    (byGroup[g] = byGroup[g] || []).push({ term, def });
  });
  Object.keys(byGroup)
    .sort()
    .forEach((group) => {
      out += `## ${group}\n\n`;
      byGroup[group]
        .sort((a, b) => a.term.localeCompare(b.term))
        .forEach((e) => {
          out += `**${e.term}**\n:   ${e.def}\n\n`;
        });
    });
  return out;
}

// --- Main ---
const data = loadAllData();

fs.mkdirSync(OUT, { recursive: true });

// Build { id: blockObject } maps by looking up each id from the course-map
// registries against the corresponding data global — BLOCK_A for CPCM id
// "A", FPS_BLOCK5 for FPS id "F5", etc. A block whose data file hasn't been
// written yet (status "soon") is silently skipped rather than erroring.
function blocksFromMap(courseMap, globalNameFor) {
  const out = {};
  (courseMap || []).forEach((entry) => {
    const block = data[globalNameFor(entry.id)];
    if (block) out[entry.id] = block;
  });
  return out;
}

// Writes one track (CPCM or FPS): computes block-slug/lesson-slug for every
// lesson first, builds one flat prev/next chain across all blocks in
// course-map order (lessons are numbered continuously across a track, e.g.
// FPS block F2 picks up at lesson 6 right after F1's lesson 5), then writes
// each lesson with a breadcrumb + prev/next pager wired to that chain.
function writeTrack(blocks, trackDir, trackTitle, blockSlugPrefix) {
  fs.mkdirSync(trackDir, { recursive: true });

  const blockEntries = Object.entries(blocks); // preserves course-map order
  const perBlockSlugs = {}; // blockId -> { lessonN: lessonSlug }
  const perBlockDirSlug = {}; // blockId -> directory slug

  const flat = []; // [{ blockId, n, title }] across the whole track, in order
  blockEntries.forEach(([id, block]) => {
    const blockDirSlug = `${blockSlugPrefix(id)}-${slugify(block.title)}`;
    perBlockDirSlug[id] = blockDirSlug;
    const slugs = {};
    block.lessons.forEach((l) => (slugs[l.n] = String(l.n).padStart(2, "0") + "-" + slugify(l.title)));
    perBlockSlugs[id] = slugs;
    block.lessons.forEach((l) => flat.push({ blockId: id, n: l.n, title: l.title }));
  });

  function relPathBetween(fromBlockId, toBlockId, toN) {
    const toSlug = perBlockSlugs[toBlockId][toN] + ".md";
    if (toBlockId === fromBlockId) return toSlug;
    return `../${perBlockDirSlug[toBlockId]}/${toSlug}`;
  }

  blockEntries.forEach(([id, block]) => {
    const blockDir = path.join(trackDir, perBlockDirSlug[id]);
    fs.mkdirSync(blockDir, { recursive: true });
    const slugs = perBlockSlugs[id];

    block.lessons.forEach((l) => {
      const flatIndex = flat.findIndex((f) => f.blockId === id && f.n === l.n);
      const prev = flatIndex > 0 ? flat[flatIndex - 1] : null;
      const next = flatIndex < flat.length - 1 ? flat[flatIndex + 1] : null;
      const nav = {
        trackTitle,
        blockTitle: block.title,
        index: flatIndex + 1,
        total: flat.length,
        prevRel: prev ? relPathBetween(id, prev.blockId, prev.n) : null,
        prevLabel: prev ? `${prev.n}. ${prev.title}` : null,
        nextRel: next ? relPathBetween(id, next.blockId, next.n) : null,
        nextLabel: next ? `${next.n}. ${next.title}` : null,
      };
      const md = lessonMarkdown(l, block, trackTitle, block.title, [block.title, l.title], nav);
      fs.writeFileSync(path.join(blockDir, slugs[l.n] + ".md"), md);
    });
    fs.writeFileSync(path.join(blockDir, "index.md"), blockIndexMarkdown(block, trackTitle, slugs));
  });
}

// CPCM track
const cpcmBlocks = blocksFromMap(data.COURSE_MAP, (id) => "BLOCK_" + id);
writeTrack(cpcmBlocks, path.join(OUT, "cpcm"), "CPCM curriculum", (id) => `block-${id.toLowerCase()}`);

// FPS track
const fpsBlocks = blocksFromMap(data.FPS_COURSE_MAP, (id) => "FPS_BLOCK" + id.slice(1));
writeTrack(fpsBlocks, path.join(OUT, "fps"), "FPS analyst deep-dive", (id) => id.toLowerCase());

// Glossary
fs.mkdirSync(path.join(OUT, "glossary"), { recursive: true });
fs.writeFileSync(path.join(OUT, "glossary", "index.md"), glossaryMarkdown(data.GLOSSARY_EXTRA));

console.log("Conversion complete.");
console.log("CPCM blocks:", Object.keys(cpcmBlocks).length, "FPS blocks:", Object.keys(fpsBlocks).length);
