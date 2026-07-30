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

function lessonMarkdown(lesson, blockMeta, trackTitle, blockTitle, keywords) {
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

  let body = `# ${lesson.n}. ${lesson.title}\n\n`;
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

// CPCM track
const cpcmBlocks = blocksFromMap(data.COURSE_MAP, (id) => "BLOCK_" + id);
const cpcmDir = path.join(OUT, "cpcm");
fs.mkdirSync(cpcmDir, { recursive: true });
Object.entries(cpcmBlocks).forEach(([id, block]) => {
  const blockSlug = `block-${id.toLowerCase()}-${slugify(block.title)}`;
  const blockDir = path.join(cpcmDir, blockSlug);
  fs.mkdirSync(blockDir, { recursive: true });
  const slugs = {};
  block.lessons.forEach((l) => (slugs[l.n] = String(l.n).padStart(2, "0") + "-" + slugify(l.title)));
  block.lessons.forEach((l) => {
    const md = lessonMarkdown(l, block, "CPCM curriculum", block.title, [block.title, l.title]);
    fs.writeFileSync(path.join(blockDir, slugs[l.n] + ".md"), md);
  });
  fs.writeFileSync(path.join(blockDir, "index.md"), blockIndexMarkdown(block, "CPCM curriculum", slugs));
});

// FPS track
const fpsBlocks = blocksFromMap(data.FPS_COURSE_MAP, (id) => "FPS_BLOCK" + id.slice(1));
const fpsDir = path.join(OUT, "fps");
fs.mkdirSync(fpsDir, { recursive: true });
Object.entries(fpsBlocks).forEach(([id, block]) => {
  const blockSlug = `${id.toLowerCase()}-${slugify(block.title)}`;
  const blockDir = path.join(fpsDir, blockSlug);
  fs.mkdirSync(blockDir, { recursive: true });
  const slugs = {};
  block.lessons.forEach((l) => (slugs[l.n] = String(l.n).padStart(2, "0") + "-" + slugify(l.title)));
  block.lessons.forEach((l) => {
    const md = lessonMarkdown(l, block, "FPS analyst deep-dive", block.title, [block.title, l.title]);
    fs.writeFileSync(path.join(blockDir, slugs[l.n] + ".md"), md);
  });
  fs.writeFileSync(path.join(blockDir, "index.md"), blockIndexMarkdown(block, "FPS analyst deep-dive", slugs));
});

// Glossary
fs.mkdirSync(path.join(OUT, "glossary"), { recursive: true });
fs.writeFileSync(path.join(OUT, "glossary", "index.md"), glossaryMarkdown(data.GLOSSARY_EXTRA));

console.log("Conversion complete.");
console.log("CPCM blocks:", Object.keys(cpcmBlocks).length, "FPS blocks:", Object.keys(fpsBlocks).length);
