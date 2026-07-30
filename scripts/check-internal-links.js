// Checks that every internal (same-site) link and image reference in the
// built HTML resolves to a real file on disk. External links (http/https to
// other domains, mailto:, tel:, javascript:) are intentionally skipped —
// this check only ever ran offline in CI, so it never actually verified
// external reachability anyway; this keeps that same scope but replaces a
// third-party binary (lychee) that was crashing on some of the newer pages'
// links with a small, fully-testable script.
//
// Usage: node check-internal-links.js <siteDir>

const fs = require("fs");
const path = require("path");

const SITE_DIR = process.argv[2];
if (!SITE_DIR) {
  console.error("Usage: node check-internal-links.js <siteDir>");
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function isExternal(href) {
  return (
    /^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:\/\/gsriidhar\.github\.io/i.test(href)
  ) || href.startsWith("//");
}

function resolveTarget(fromFile, href) {
  // strip fragment/query
  let clean = href.split("#")[0].split("?")[0];
  if (clean === "") return null; // pure same-page fragment link, nothing to check
  // absolute-to-our-own-site links (full URL form): strip scheme+host+subpath back to a site-relative path
  clean = clean.replace(/^https?:\/\/gsriidhar\.github\.io\/fps-study-hub\/?/i, "/");
  // root-relative links that already include the deploy subpath (e.g. Material's 404 page,
  // which always emits absolute /fps-study-hub/... paths regardless of build location)
  clean = clean.replace(/^\/fps-study-hub\/?/i, "/");
  let target;
  if (clean.startsWith("/")) {
    target = path.join(SITE_DIR, clean);
  } else {
    target = path.join(path.dirname(fromFile), clean);
  }
  if (target.endsWith("/") || !path.extname(target)) {
    target = path.join(target, "index.html");
  }
  return target;
}

const files = walk(SITE_DIR);
const hrefRe = /\s(?:href|src)="([^"]+)"/g;
const broken = [];
let checked = 0;

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  let m;
  while ((m = hrefRe.exec(html))) {
    const href = m[1];
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) continue;
    if (isExternal(href)) continue;
    const target = resolveTarget(file, href);
    if (!target) continue;
    checked++;
    if (!fs.existsSync(target)) {
      broken.push({ file: path.relative(SITE_DIR, file), href, target: path.relative(SITE_DIR, target) });
    }
  }
}

console.log(`Checked ${checked} internal links across ${files.length} pages.`);
if (broken.length) {
  console.error(`\n${broken.length} broken internal link(s):\n`);
  for (const b of broken) {
    console.error(`  ${b.file} -> "${b.href}" (missing: ${b.target})`);
  }
  process.exit(1);
}
console.log("All internal links resolve.");
