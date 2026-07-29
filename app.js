/* Study hub — plain JS, no build step, no dependencies. Data lives in data/*.js
   (loaded as globals) so this works from file:// as well as any static host. */

const STORE_KEY = "fps-study-progress-v1";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || { read: {}, ratings: {}, quizBest: {} };
  } catch (e) {
    return { read: {}, ratings: {}, quizBest: {} };
  }
}
function saveProgress(p) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
  catch (e) { /* localStorage unavailable (e.g. some file:// / privacy contexts) — progress just won't persist this session */ }
}
let PROGRESS = loadProgress();

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function nl2p(s) {
  return String(s).split("\n\n").map((p) => `<p>${esc(p)}</p>`).join("");
}

/* Every course/block registered here. Add a new block's data file, then add
   one line below — everything else (routing, rendering, flashcards, quiz,
   glossary) is generic. */
const BLOCKS_BY_ID = { A: BLOCK_A, F1: FPS_BLOCK1 };
const COURSES = [
  { key: "cpcm", title: "CPCM curriculum", subtitle: "General payments & cash management foundation (40 lessons)", map: COURSE_MAP },
  { key: "fps", title: "FPS analyst deep-dive", subtitle: "UK Faster Payments operations, investigation & testing", map: FPS_COURSE_MAP },
];

/* ---------- diagram renderer ---------- */
function renderDiagram(d) {
  if (!d) return "";
  if (d.type === "flow" && d.orientation === "vertical") {
    return `<div class="diagram flow-vert">${d.steps.map((s, i) =>
      `<div class="box">${esc(s)}</div>${i < d.steps.length - 1 ? '<div class="arrow">&#9660;</div>' : ""}`
    ).join("")}</div>`;
  }
  if (d.type === "flow" && d.orientation === "horizontal") {
    return `<div class="diagram flow-horiz">${d.steps.map((s, i) =>
      `<div class="box">${esc(s)}</div>${i < d.steps.length - 1 ? '<div class="arrow">&#8594;</div>' : ""}`
    ).join("")}</div>`;
  }
  if (d.type === "dualflow") {
    return `<div class="diagram">${d.rows.map((row) => `
      <div class="dualflow-row">
        <div class="rowlabel">${esc(row.label)}</div>
        <div class="flow-horiz">${row.steps.map((s, i) =>
          `<div class="box">${esc(s)}</div>${i < row.steps.length - 1 ? '<div class="arrow">&#8594;</div>' : ""}`
        ).join("")}</div>
      </div>`).join("")}</div>`;
  }
  if (d.type === "spectrum") {
    return `<div class="diagram spectrum">
      <span class="endpoint">${esc(d.from)}</span>
      <div class="items">${d.items.map((i) => `<span class="item">${esc(i)}</span>`).join("")}</div>
      <span class="endpoint">${esc(d.to)}</span>
    </div>`;
  }
  return "";
}

/* ---------- router ---------- */
function parseHash() {
  const h = location.hash.replace(/^#\/?/, "");
  return h.split("/").filter(Boolean);
}
function navActive(view) {
  document.querySelectorAll(".navlink").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
}

function render() {
  const parts = parseHash();
  const app = document.getElementById("app");
  window.scrollTo && window.scrollTo(0, 0);
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("open");

  if (parts.length === 0) { app.innerHTML = viewOverview(); navActive("overview"); return; }
  if (parts[0] === "block" && parts[1]) { app.innerHTML = viewBlock(parts[1]); navActive("block-" + parts[1]); return; }
  if (parts[0] === "lesson" && parts[1] && parts[2]) {
    app.innerHTML = viewLesson(parts[1], Number(parts[2]));
    navActive("block-" + parts[1]);
    bindLessonEvents(parts[1], Number(parts[2]));
    return;
  }
  if (parts[0] === "flashcards") { const id = parts[1] || "A"; app.innerHTML = viewFlashcardsShell(id); navActive("flashcards"); initFlashcards(id); return; }
  if (parts[0] === "quiz") { const id = parts[1] || "A"; app.innerHTML = viewQuizShell(id); navActive("quiz"); initQuiz(id); return; }
  if (parts[0] === "glossary") { app.innerHTML = viewGlossary(); navActive("glossary"); bindGlossaryEvents(); return; }
  app.innerHTML = viewOverview(); navActive("overview");
}

/* ---------- Overview ---------- */
function viewOverview() {
  const courseProgress = COURSES.map((c) => {
    const readyBlocks = c.map.filter((b) => b.status === "ready");
    let total = 0, done = 0;
    readyBlocks.forEach((b) => {
      const block = BLOCKS_BY_ID[b.id];
      if (!block) return;
      total += block.lessons.length;
      done += block.lessons.filter((l) => PROGRESS.read[b.id + l.n]).length;
    });
    return { c, total, done };
  });

  return `
    <h2>CPCM / FPS analyst study hub</h2>
    <p class="subtitle">Two tracks: the general CPCM curriculum, and a dedicated FPS analyst deep-dive. Condensed into readable lessons, flashcards, and self-scoring quizzes. Progress is saved on this device.</p>

    <div class="quick-links">
      <a href="#/block/A">Start CPCM &rarr;</a>
      <a href="#/block/F1">Start FPS deep-dive &rarr;</a>
      <a href="#/glossary">Glossary</a>
    </div>

    ${COURSES.map((c, i) => `
      <h3 style="font-size:13px; text-transform:uppercase; letter-spacing:0.03em; color:var(--muted); margin:24px 0 10px;">${esc(c.title)}</h3>
      <p class="subtitle" style="margin-top:-6px;">${esc(c.subtitle)}</p>
      ${courseProgress[i].total ? `
        <div class="panel">
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${Math.round(courseProgress[i].done / courseProgress[i].total * 100)}%"></div></div>
          <p class="subtitle" style="margin:6px 0 0;">${courseProgress[i].done} of ${courseProgress[i].total} lessons read</p>
        </div>` : ""}
      <div class="block-grid">
        ${c.map.map((b) => {
          const range = `Lessons ${b.lessons[0]}-${b.lessons[b.lessons.length - 1]}`;
          if (b.status === "ready") {
            return `<a class="block-card ready" href="#/block/${b.id}">
              <span class="status">Ready</span>
              <div class="id">BLOCK ${b.id} &middot; ${range}</div>
              <div class="title">${esc(b.title)}</div>
              <div class="desc">${esc(b.desc)}</div>
            </a>`;
          }
          return `<div class="block-card soon">
              <span class="status">Coming soon</span>
              <div class="id">BLOCK ${b.id} &middot; ${range}</div>
              <div class="title">${esc(b.title)}</div>
              <div class="desc">${esc(b.desc)}</div>
            </div>`;
        }).join("")}
      </div>
    `).join("")}
  `;
}

/* ---------- Block ---------- */
function viewBlock(blockId) {
  const block = BLOCKS_BY_ID[blockId];
  if (!block) return `<h2>Not found</h2>`;
  return `
    <p class="crumbs"><a href="#/">Overview</a> / Block ${block.id}</p>
    <h2>Block ${block.id}: ${esc(block.title)}</h2>
    <p class="subtitle">${block.lessons.length} lessons. Read each one, do the MCQs, then use the revision pack below.</p>
    <div class="lesson-list">
      ${block.lessons.map((l) => {
        const done = PROGRESS.read[blockId + l.n];
        return `<a class="lesson-row" href="#/lesson/${block.id}/${l.n}">
          <span class="num">L${l.n}</span>
          <span class="lt">${esc(l.title)}</span>
          <span class="check">${done ? "&#10003; read" : ""}</span>
        </a>`;
      }).join("")}
    </div>
    <div class="panel">
      <h3>Revision pack (covers lessons ${block.lessons[0]}-${block.lessons[block.lessons.length - 1]})</h3>
      <p>${esc(block.revisionSummary)}</p>
      <div class="quick-links" style="margin-top:14px;">
        <a href="#/flashcards/${block.id}">Flashcards (${block.flashcards.length + block.additionalQuestions.length})</a>
        <a href="#/quiz/${block.id}">Quiz (${block.lessons.reduce((n, l) => n + l.mcqs.length, 0)} questions)</a>
      </div>
    </div>
  `;
}

/* ---------- Lesson ---------- */
function viewLesson(blockId, n) {
  const block = BLOCKS_BY_ID[blockId];
  const lesson = block && block.lessons.find((l) => l.n === n);
  if (!lesson) return `<h2>Not found</h2>`;
  const done = !!PROGRESS.read[blockId + n];
  const idx = block.lessons.findIndex((l) => l.n === n);
  const prev = block.lessons[idx - 1];
  const next = block.lessons[idx + 1];

  return `
    <p class="crumbs"><a href="#/">Overview</a> / <a href="#/block/${block.id}">Block ${block.id}</a> / Lesson ${n}</p>
    <h2>Lesson ${n}: ${esc(lesson.title)} <span class="tag">essential</span></h2>
    <p class="subtitle">${esc(lesson.objectives)}</p>

    <div class="panel">
      <h3>Explanation</h3>
      ${nl2p(lesson.explanation)}
    </div>

    <div class="panel">
      <h3>Diagram</h3>
      ${renderDiagram(lesson.diagram)}
    </div>

    <div class="panel">
      <h3>Key terms</h3>
      <table class="kt"><tbody>
        ${lesson.keyTerms.map(([t, d]) => `<tr><td style="width:32%; font-weight:600;">${esc(t)}</td><td>${esc(d)}</td></tr>`).join("")}
      </tbody></table>
    </div>

    <div class="panel">
      <h3>Real-world example</h3>
      <p>${esc(lesson.example)}</p>
    </div>

    <div class="panel">
      <h3>${esc(lesson.comparison.caption)}</h3>
      <table class="kt"><thead><tr>${lesson.comparison.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>${lesson.comparison.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>
    </div>

    <div class="panel">
      <h3>Exam tips &amp; memory trick</h3>
      <ul class="exam-tips">${lesson.examTips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <p class="memory-trick" style="margin-top:10px;">${esc(lesson.memoryTrick)}</p>
    </div>

    <div class="panel">
      <h3>Key points to remember</h3>
      <ul>${lesson.keyPoints.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>
    </div>

    <div class="panel">
      <h3>${lesson.mcqs.length} exam-style MCQs</h3>
      <p class="subtitle">Answered as part of the Block ${block.id} quiz — <a href="#/quiz/${block.id}">open quiz mode</a>.</p>
    </div>

    <div class="panel">
      <h3>Scenario questions</h3>
      ${lesson.scenarios.map(([q, a], i) => `
        <p><strong>${i + 1}. ${esc(q)}</strong><br><span style="color:var(--muted);">${esc(a)}</span></p>
      `).join("")}
    </div>

    <button class="mark-read ${done ? "done" : ""}" id="mark-read-btn">${done ? "✓ Marked as read" : "Mark lesson as read"}</button>

    <div class="lesson-nav">
      ${prev ? `<a href="#/lesson/${block.id}/${prev.n}">&larr; Lesson ${prev.n}</a>` : `<span class="disabled">&larr; Start</span>`}
      ${next ? `<a href="#/lesson/${block.id}/${next.n}">Lesson ${next.n} &rarr;</a>` : `<a href="#/block/${block.id}">Back to block &rarr;</a>`}
    </div>
  `;
}
function bindLessonEvents(blockId, n) {
  const btn = document.getElementById("mark-read-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const key = blockId + n;
    PROGRESS.read[key] = !PROGRESS.read[key];
    saveProgress(PROGRESS);
    render();
  });
}

/* ---------- Flashcards ---------- */
let deck = [];
let deckPos = 0;
let deckBlockId = "A";
function buildDeck(blockId) {
  const block = BLOCKS_BY_ID[blockId];
  const cards = block.flashcards.map((c, i) => ({ id: blockId + "core" + i, q: c[0], a: c[1] }))
    .concat(block.additionalQuestions.map((c, i) => ({ id: blockId + "extra" + i, q: c[0], a: c[1] })));
  const weighted = cards.map((c) => ({ c, w: PROGRESS.ratings[c.id] === "again" ? 0 : Math.random() }));
  weighted.sort((a, b) => a.w - b.w);
  return weighted.map((x) => x.c);
}
function viewFlashcardsShell(blockId) {
  const block = BLOCKS_BY_ID[blockId];
  return `
    <p class="crumbs"><a href="#/">Overview</a> / Flashcards</p>
    <h2>Flashcards &mdash; Block ${block.id}: ${esc(block.title)}</h2>
    <p class="subtitle">${block.flashcards.length + block.additionalQuestions.length} cards. Tap a card to flip it, then rate yourself &mdash; cards marked "review again" resurface sooner.</p>
    <div class="deck-controls">
      <button id="fc-shuffle">Reshuffle deck</button>
    </div>
    <div class="deck-progress" id="fc-progress"></div>
    <div id="fc-area"></div>
  `;
}
function initFlashcards(blockId) {
  deckBlockId = blockId;
  deck = buildDeck(blockId);
  deckPos = 0;
  document.getElementById("fc-shuffle").addEventListener("click", () => { deck = buildDeck(deckBlockId); deckPos = 0; renderCard(); });
  renderCard();
}
function renderCard() {
  const area = document.getElementById("fc-area");
  const prog = document.getElementById("fc-progress");
  if (deckPos >= deck.length) {
    area.innerHTML = `<div class="panel"><h3>Deck complete</h3><p>You've been through all ${deck.length} cards. Reshuffle to go again &mdash; cards you marked "review again" will come up first.</p></div>`;
    prog.textContent = "";
    return;
  }
  const card = deck[deckPos];
  prog.textContent = `Card ${deckPos + 1} of ${deck.length}`;
  area.innerHTML = `
    <div class="flip-wrap">
      <div class="flip-card" id="flip-card">
        <div class="flip-inner">
          <div class="flip-face front"><span class="kicker">Question</span>${esc(card.q)}</div>
          <div class="flip-face back"><span class="kicker">Answer</span>${esc(card.a)}</div>
        </div>
      </div>
      <div class="rate-row">
        <button class="again" id="rate-again">Review again</button>
        <button class="know" id="rate-know">Got it</button>
      </div>
    </div>
  `;
  document.getElementById("flip-card").addEventListener("click", () => {
    document.getElementById("flip-card").classList.toggle("flipped");
  });
  document.getElementById("rate-again").addEventListener("click", (e) => { e.stopPropagation(); rateCard(card.id, "again"); });
  document.getElementById("rate-know").addEventListener("click", (e) => { e.stopPropagation(); rateCard(card.id, "know"); });
}
function rateCard(id, rating) {
  PROGRESS.ratings[id] = rating;
  saveProgress(PROGRESS);
  deckPos++;
  renderCard();
}

/* ---------- Quiz ---------- */
let quizQs = [];
let quizPos = 0;
let quizScore = 0;
let quizAnswered = false;
let quizWrong = [];
let quizBlockId = "A";
function buildQuiz(blockId) {
  const block = BLOCKS_BY_ID[blockId];
  const all = [];
  block.lessons.forEach((l) => l.mcqs.forEach((m) => all.push({ ...m, lessonTitle: l.title })));
  return all.sort(() => Math.random() - 0.5);
}
function viewQuizShell(blockId) {
  const block = BLOCKS_BY_ID[blockId];
  return `
    <p class="crumbs"><a href="#/">Overview</a> / Quiz</p>
    <h2>Quiz mode &mdash; Block ${block.id}: ${esc(block.title)}</h2>
    <p class="subtitle">${block.lessons.reduce((n, l) => n + l.mcqs.length, 0)} questions across lessons ${block.lessons[0].n}-${block.lessons[block.lessons.length - 1].n}, shuffled.</p>
    <div id="quiz-area"></div>
  `;
}
function initQuiz(blockId) {
  quizBlockId = blockId;
  quizQs = buildQuiz(blockId);
  quizPos = 0; quizScore = 0; quizAnswered = false; quizWrong = [];
  renderQuiz();
}
function renderQuiz() {
  const area = document.getElementById("quiz-area");
  if (quizPos >= quizQs.length) {
    const best = PROGRESS.quizBest[quizBlockId] || 0;
    if (quizScore > best) { PROGRESS.quizBest[quizBlockId] = quizScore; saveProgress(PROGRESS); }
    area.innerHTML = `
      <div class="panel">
        <h3>Result</h3>
        <div class="quiz-score">${quizScore} / ${quizQs.length}</div>
        <p class="subtitle">Best score on this device: ${Math.max(quizScore, best)} / ${quizQs.length}</p>
        <button class="mark-read" id="quiz-restart">Try again</button>
        ${quizWrong.length ? `<h4>Review missed questions</h4>${quizWrong.map((w) => `
          <div class="review-item"><strong>${esc(w.q)}</strong><br>Correct answer: ${esc(w.options[w.a])}${w.why ? `<br><span style="color:var(--muted)">${esc(w.why)}</span>` : ""}</div>
        `).join("")}` : `<p style="margin-top:14px;">Perfect score &mdash; nice work.</p>`}
      </div>`;
    document.getElementById("quiz-restart").addEventListener("click", () => initQuiz(quizBlockId));
    return;
  }
  const q = quizQs[quizPos];
  area.innerHTML = `
    <div class="quiz-progress">Question ${quizPos + 1} of ${quizQs.length} &middot; ${esc(q.lessonTitle)}</div>
    <div class="panel">
      <div class="quiz-q">${esc(q.q)}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button data-i="${i}">${esc(opt)}</button>`).join("")}
      </div>
      <div id="quiz-explain"></div>
      <button class="quiz-next" id="quiz-next" style="display:none;">Next question &rarr;</button>
    </div>
  `;
  quizAnswered = false;
  const buttons = area.querySelectorAll(".quiz-options button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (quizAnswered) return;
      quizAnswered = true;
      const chosen = Number(btn.dataset.i);
      buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === q.a) b.classList.add("correct");
        else if (i === chosen) b.classList.add("incorrect");
      });
      if (chosen === q.a) quizScore++;
      else quizWrong.push(q);
      if (q.why) document.getElementById("quiz-explain").innerHTML = `<div class="quiz-explain">${esc(q.why)}</div>`;
      document.getElementById("quiz-next").style.display = "inline-block";
    });
  });
  document.getElementById("quiz-next").addEventListener("click", () => { quizPos++; renderQuiz(); });
}

/* ---------- Glossary ---------- */
function allGlossaryTerms() {
  const coreTerms = [];
  Object.values(BLOCKS_BY_ID).forEach((block) => {
    block.lessons.forEach((l) => l.keyTerms.forEach(([t, d]) => coreTerms.push({ term: t, def: d, group: "Block " + block.id + " core terms" })));
  });
  const extra = GLOSSARY_EXTRA.map(([t, d, g]) => ({ term: t, def: d, group: g }));
  return coreTerms.concat(extra);
}
function viewGlossary() {
  return `
    <p class="crumbs"><a href="#/">Overview</a> / Glossary</p>
    <h2>Glossary</h2>
    <p class="subtitle">${allGlossaryTerms().length} terms &mdash; core terms from every built block, plus the supplementary payments terminology reference.</p>
    <input type="text" class="glossary-search" id="gloss-search" placeholder="Search terms...">
    <div id="gloss-results"></div>
  `;
}
function bindGlossaryEvents() {
  const input = document.getElementById("gloss-search");
  renderGlossaryResults("");
  input.addEventListener("input", () => renderGlossaryResults(input.value));
}
function renderGlossaryResults(query) {
  const q = query.trim().toLowerCase();
  const terms = allGlossaryTerms().filter((t) => !q || t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q));
  const groups = {};
  terms.forEach((t) => { (groups[t.group] = groups[t.group] || []).push(t); });
  const el = document.getElementById("gloss-results");
  if (!terms.length) { el.innerHTML = `<p class="subtitle">No terms match "${esc(query)}".</p>`; return; }
  el.innerHTML = Object.keys(groups).map((g) => `
    <div class="gloss-group">
      <h4>${esc(g)}</h4>
      ${groups[g].map((t) => `<div class="gloss-term"><div class="term">${esc(t.term)}</div><div class="def">${esc(t.def)}</div></div>`).join("")}
    </div>
  `).join("");
}

/* ---------- boot ---------- */
window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) menuToggle.addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
  render();
});
