/* Study hub — plain JS, no build step, no dependencies. Data lives in data/*.js
   (loaded as globals) so this works from file:// as well as any static host. */

const STORE_KEY = "fps-study-progress-v1";

function defaultProgress() {
  return {
    read: {}, ratings: {}, quizBest: {},
    activity: {}, missedTopics: {},
    profileName: "Student", activeTrack: "cpcm",
    lastReset: { overall: null, cpcm: null, fps: null },
    freshStartLock: { cpcm: false, fps: false },
    archive: [],
  };
}
function normalizeProgress(saved) {
  const defaults = defaultProgress();
  saved = saved || {};
  return Object.assign({}, defaults, saved, {
    read: Object.assign({}, defaults.read, saved.read),
    ratings: Object.assign({}, defaults.ratings, saved.ratings),
    quizBest: Object.assign({}, defaults.quizBest, saved.quizBest),
    activity: Object.assign({}, defaults.activity, saved.activity),
    missedTopics: Object.assign({}, defaults.missedTopics, saved.missedTopics),
    lastReset: Object.assign({}, defaults.lastReset, saved.lastReset),
    freshStartLock: Object.assign({}, defaults.freshStartLock, saved.freshStartLock),
    archive: saved.archive || defaults.archive,
  });
}
function isValidProgressShape(obj) {
  return !!obj && typeof obj === "object"
    && typeof obj.read === "object" && obj.read !== null
    && typeof obj.ratings === "object" && obj.ratings !== null
    && typeof obj.quizBest === "object" && obj.quizBest !== null;
}
function loadProgress() {
  try {
    return normalizeProgress(JSON.parse(localStorage.getItem(STORE_KEY)));
  } catch (e) {
    return defaultProgress();
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
const BLOCKS_BY_ID = { A: BLOCK_A, B: BLOCK_B, C: BLOCK_C, D: BLOCK_D, E: BLOCK_E, F: BLOCK_F, G: BLOCK_G, H: BLOCK_H, F1: FPS_BLOCK1, F2: FPS_BLOCK2, F3: FPS_BLOCK3, F4: FPS_BLOCK4, F5: FPS_BLOCK5, F6: FPS_BLOCK6, F7: FPS_BLOCK7, F8: FPS_BLOCK8 };
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
  if (parts[0] === "dashboard") { app.innerHTML = viewDashboard(); navActive("dashboard"); bindDashboardEvents(); return; }
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
  if (parts[0] === "search") {
    const q = parts.slice(1).join("/");
    app.innerHTML = viewSearch(decodeURIComponent(q || ""));
    navActive("search");
    bindSearchEvents();
    return;
  }
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
    if (PROGRESS.read[key]) {
      delete PROGRESS.read[key];
    } else {
      PROGRESS.read[key] = Date.now();
      logActivity();
    }
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
  logActivity();
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
      else {
        quizWrong.push(q);
        PROGRESS.missedTopics[q.lessonTitle] = (PROGRESS.missedTopics[q.lessonTitle] || 0) + 1;
      }
      logActivity();
      saveProgress(PROGRESS);
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

/* ---------- Search ---------- */
function courseTitleFor(blockId) {
  const c = COURSES.find((c) => c.map.some((b) => b.id === blockId));
  return c ? c.title : "";
}
let SEARCH_INDEX_CACHE = null;
function buildSearchIndex() {
  if (SEARCH_INDEX_CACHE) return SEARCH_INDEX_CACHE;
  const items = [];
  Object.entries(BLOCKS_BY_ID).forEach(([blockId, block]) => {
    block.lessons.forEach((l) => {
      const body = [
        l.explanation,
        (l.keyPoints || []).join(" "),
        (l.examTips || []).join(" "),
        l.memoryTrick || "",
        l.example || "",
        (l.keyTerms || []).map((kt) => kt.join(" — ")).join(" "),
      ].join(" ");
      items.push({
        type: "lesson",
        typeLabel: "Lesson",
        title: `Lesson ${l.n}: ${l.title}`,
        context: `${courseTitleFor(blockId)} · Block ${blockId}`,
        body,
        link: `#/lesson/${blockId}/${l.n}`,
      });
    });
    block.flashcards.concat(block.additionalQuestions).forEach(([q, a]) => {
      items.push({
        type: "flashcard",
        typeLabel: "Flashcard",
        title: q,
        context: `${courseTitleFor(blockId)} · Block ${blockId} flashcards`,
        body: a,
        link: `#/flashcards/${blockId}`,
      });
    });
    block.lessons.forEach((l) => {
      l.mcqs.forEach((m) => {
        items.push({
          type: "quiz",
          typeLabel: "Quiz question",
          title: m.q,
          context: `${courseTitleFor(blockId)} · Block ${blockId} quiz`,
          body: m.options.join(" "),
          link: `#/quiz/${blockId}`,
        });
      });
    });
  });
  allGlossaryTerms().forEach((t) => {
    items.push({
      type: "glossary",
      typeLabel: "Glossary",
      title: t.term,
      context: t.group,
      body: t.def,
      link: "#/glossary",
    });
  });
  SEARCH_INDEX_CACHE = items;
  return items;
}
function runSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = buildSearchIndex().map((item) => {
    const titleL = item.title.toLowerCase();
    const bodyL = item.body.toLowerCase();
    let score = 0;
    terms.forEach((t) => {
      if (titleL.includes(t)) score += titleL.startsWith(t) ? 6 : 4;
      if (bodyL.includes(t)) score += 1;
    });
    return { item, score };
  }).filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 40).map((s) => s.item);
}
function snippet(text, terms) {
  const lower = text.toLowerCase();
  let idx = -1;
  for (const t of terms) {
    idx = lower.indexOf(t);
    if (idx !== -1) break;
  }
  if (idx === -1) return esc(text.slice(0, 160)) + (text.length > 160 ? "…" : "");
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + 100);
  return (start > 0 ? "…" : "") + esc(text.slice(start, end)) + (end < text.length ? "…" : "");
}
function viewSearch(query) {
  return `
    <p class="crumbs"><a href="#/">Overview</a> / Search</p>
    <h2>Search</h2>
    <p class="subtitle">Search across every lesson, flashcard, quiz question, and glossary term in both courses.</p>
    <input type="text" class="glossary-search" id="search-input" placeholder="Search e.g. Confirmation of Payee, AC04, mule account..." value="${esc(query)}">
    <div id="search-results"></div>
  `;
}
function renderSearchResults(query) {
  const el = document.getElementById("search-results");
  if (!query.trim()) { el.innerHTML = `<p class="subtitle">Start typing to search.</p>`; return; }
  const results = runSearch(query);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!results.length) { el.innerHTML = `<p class="subtitle">No results for "${esc(query)}".</p>`; return; }
  el.innerHTML = `<p class="subtitle">${results.length} result${results.length === 1 ? "" : "s"}</p>` + results.map((r) => `
    <a class="lesson-row" href="${r.link}" style="flex-direction:column; align-items:flex-start; gap:4px; height:auto; padding:12px 14px;">
      <span><span class="tag">${esc(r.typeLabel)}</span> <strong>${esc(r.title)}</strong></span>
      <span style="color:var(--muted); font-size:12.5px;">${esc(r.context)}</span>
      <span style="color:var(--muted); font-size:13px;">${snippet(r.body, terms)}</span>
    </a>
  `).join("");
}
function bindSearchEvents() {
  const input = document.getElementById("search-input");
  renderSearchResults(input.value);
  input.addEventListener("input", () => renderSearchResults(input.value));
  input.focus();
}

/* ---------- Dashboard ---------- */
function todayStr() { return new Date().toISOString().slice(0, 10); }
function logActivity() {
  const d = todayStr();
  PROGRESS.activity[d] = (PROGRESS.activity[d] || 0) + 1;
}
function computeStreak() {
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (PROGRESS.activity[key]) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}
function estHours() {
  const total = Object.values(PROGRESS.activity).reduce((a, b) => a + b, 0);
  return Math.round((total * 2 / 60) * 10) / 10; // ~2 min per logged study action
}
function trackInfo(trackKey) { return COURSES.find((c) => c.key === trackKey); }
function trackBlocks(trackKey) { return trackInfo(trackKey).map.filter((b) => b.status === "ready"); }

function blockStats(blockId) {
  const block = BLOCKS_BY_ID[blockId];
  const lessonsTotal = block.lessons.length;
  const lessonsDone = block.lessons.filter((l) => PROGRESS.read[blockId + l.n]).length;
  const cardIds = block.flashcards.map((c, i) => blockId + "core" + i)
    .concat(block.additionalQuestions.map((c, i) => blockId + "extra" + i));
  const flashTotal = cardIds.length;
  const flashMastered = cardIds.filter((id) => PROGRESS.ratings[id] === "know").length;
  const flashAgain = cardIds.filter((id) => PROGRESS.ratings[id] === "again").length;
  const quizTotal = block.lessons.reduce((n, l) => n + l.mcqs.length, 0);
  const quizBest = PROGRESS.quizBest[blockId] || 0;
  const quizPct = quizTotal ? Math.round((quizBest / quizTotal) * 100) : 0;
  const lastRead = block.lessons.reduce((m, l) => Math.max(m, PROGRESS.read[blockId + l.n] || 0), 0);
  const tagCounts = {};
  block.lessons.forEach((l) => { tagCounts[l.tag] = (tagCounts[l.tag] || 0) + 1; });
  const difficulty = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0][0];
  return { blockId, block, lessonsTotal, lessonsDone, flashTotal, flashMastered, flashAgain, quizTotal, quizBest, quizPct, lastRead, cardIds, difficulty };
}
function trackStats(trackKey) {
  const blocks = trackBlocks(trackKey);
  let lessonsTotal = 0, lessonsDone = 0, flashTotal = 0, flashMastered = 0, flashAgain = 0,
    quizTotalAll = 0, quizBestAll = 0, modulesCompleted = 0;
  blocks.forEach((b) => {
    const s = blockStats(b.id);
    lessonsTotal += s.lessonsTotal; lessonsDone += s.lessonsDone;
    flashTotal += s.flashTotal; flashMastered += s.flashMastered; flashAgain += s.flashAgain;
    quizTotalAll += s.quizTotal; quizBestAll += s.quizBest;
    if (s.lessonsTotal && s.lessonsDone === s.lessonsTotal) modulesCompleted++;
  });
  const quizAvgPct = quizTotalAll ? Math.round((quizBestAll / quizTotalAll) * 100) : 0;
  const lessonPct = lessonsTotal ? Math.round((lessonsDone / lessonsTotal) * 100) : 0;
  const flashPct = flashTotal ? Math.round((flashMastered / flashTotal) * 100) : 0;
  const examReadiness = Math.round(lessonPct * 0.5 + quizAvgPct * 0.3 + flashPct * 0.2);
  return { modulesTotal: blocks.length, modulesCompleted, lessonsTotal, lessonsDone, lessonPct, flashTotal, flashMastered, flashAgain, quizAvgPct, examReadiness };
}
function pickContinueBlock(trackKey) {
  const blocks = trackBlocks(trackKey);
  let inProgress = null, notStarted = null;
  blocks.forEach((b) => {
    const s = blockStats(b.id);
    if (s.lessonsDone > 0 && s.lessonsDone < s.lessonsTotal) {
      if (!inProgress || s.lastRead > inProgress.s.lastRead) inProgress = { b, s };
    } else if (s.lessonsDone === 0 && !notStarted) {
      notStarted = { b, s };
    }
  });
  return inProgress || notStarted || null;
}
function weakTopics(trackKey, limit) {
  const titles = new Set();
  trackBlocks(trackKey).forEach((b) => BLOCKS_BY_ID[b.id].lessons.forEach((l) => titles.add(l.title)));
  return Object.entries(PROGRESS.missedTopics)
    .filter(([title]) => titles.has(title))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit || 5)
    .map(([title]) => title);
}
function weeklyActivity() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ label: d.toLocaleDateString(undefined, { weekday: "short" }), count: PROGRESS.activity[key] || 0 });
  }
  return days;
}
function computeBadges() {
  const badges = [];
  if (Object.keys(PROGRESS.read).length) badges.push("First lesson");
  let quizMaster = false;
  ["cpcm", "fps"].forEach((t) => {
    const s = trackStats(t);
    if (s.modulesTotal && s.modulesCompleted === s.modulesTotal) badges.push(trackInfo(t).title.split(" ")[0] + " graduate");
    trackBlocks(t).forEach((b) => { if (blockStats(b.id).quizPct >= 90) quizMaster = true; });
  });
  if (quizMaster) badges.push("Quiz master");
  const know = Object.values(PROGRESS.ratings).filter((r) => r === "know").length;
  if (know >= 50) badges.push("Flashcard pro");
  const streak = computeStreak();
  if (streak >= 7) badges.push("7-day streak");
  else if (streak >= 3) badges.push("3-day streak");
  return badges;
}

/* -- reset & archive -- */
function archiveSnapshot(scope, label) {
  PROGRESS.archive.unshift({
    id: Date.now(), scope, label, date: todayStr(),
    cpcm: trackStats("cpcm"), fps: trackStats("fps"),
    streak: computeStreak(), hours: estHours(),
  });
  PROGRESS.archive = PROGRESS.archive.slice(0, 20);
}
function clearModuleData(blockId) {
  const block = BLOCKS_BY_ID[blockId];
  block.lessons.forEach((l) => delete PROGRESS.read[blockId + l.n]);
  const cardIds = block.flashcards.map((c, i) => blockId + "core" + i)
    .concat(block.additionalQuestions.map((c, i) => blockId + "extra" + i));
  cardIds.forEach((id) => delete PROGRESS.ratings[id]);
  delete PROGRESS.quizBest[blockId];
}
function clearTrackMissedTopics(trackKey) {
  const titles = new Set();
  trackBlocks(trackKey).forEach((b) => BLOCKS_BY_ID[b.id].lessons.forEach((l) => titles.add(l.title)));
  Object.keys(PROGRESS.missedTopics).forEach((title) => { if (titles.has(title)) delete PROGRESS.missedTopics[title]; });
}
function resetModuleProgress(blockId) {
  archiveSnapshot("module", "Block " + blockId + " reset");
  clearModuleData(blockId);
  PROGRESS.lastReset[blockId] = todayStr();
  saveProgress(PROGRESS);
}
function resetTrackProgress(trackKey) {
  archiveSnapshot(trackKey, trackInfo(trackKey).title + " reset");
  trackBlocks(trackKey).forEach((b) => clearModuleData(b.id));
  clearTrackMissedTopics(trackKey);
  PROGRESS.lastReset[trackKey] = todayStr();
  PROGRESS.freshStartLock[trackKey] = true;
  saveProgress(PROGRESS);
}
function resetTrackFlashcards(trackKey) {
  archiveSnapshot(trackKey + "-flashcards", trackInfo(trackKey).title + " flashcards reset");
  trackBlocks(trackKey).forEach((b) => {
    const block = BLOCKS_BY_ID[b.id];
    const cardIds = block.flashcards.map((c, i) => b.id + "core" + i)
      .concat(block.additionalQuestions.map((c, i) => b.id + "extra" + i));
    cardIds.forEach((id) => delete PROGRESS.ratings[id]);
  });
  saveProgress(PROGRESS);
}
function freshStartReset() {
  archiveSnapshot("fresh-start", "Fresh start — full reset");
  ["cpcm", "fps"].forEach((t) => {
    trackBlocks(t).forEach((b) => clearModuleData(b.id));
    clearTrackMissedTopics(t);
    PROGRESS.freshStartLock[t] = true;
  });
  PROGRESS.activity = {};
  PROGRESS.lastReset.overall = todayStr();
  PROGRESS.lastReset.cpcm = todayStr();
  PROGRESS.lastReset.fps = todayStr();
  saveProgress(PROGRESS);
}

/* -- dashboard sub-components -- */
function progressRing(pct, size, color) {
  size = size || 64;
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, pct || 0));
  const offset = c - (p / 100) * c;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="dash-ring">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="dash-ring-track"></circle>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="dash-ring-fill" style="stroke:${color}; stroke-dasharray:${c}; stroke-dashoffset:${offset};"></circle>
    <text x="50%" y="52%" class="dash-ring-text" dominant-baseline="middle" text-anchor="middle">${Math.round(p)}%</text>
  </svg>`;
}
function moduleCardHtml(b, state) {
  const s = blockStats(b.id);
  const pct = s.lessonsTotal ? Math.round((s.lessonsDone / s.lessonsTotal) * 100) : 0;
  const diffLabel = s.difficulty === "essential" ? "Core" : "Important";
  if (state === "locked") {
    return `<div class="dash-card dash-module locked">
      <div class="dash-module-head"><span class="dash-module-id">${esc(b.id)}</span><span class="dash-lock">&#128274; Locked</span></div>
      <div class="dash-module-title">${esc(b.title)}</div>
      <div class="dash-module-desc">Complete the previous module to unlock.</div>
    </div>`;
  }
  return `<div class="dash-card dash-module">
    <div class="dash-module-head"><span class="dash-module-id">${esc(b.id)}</span><span class="dash-pct">${pct}%</span></div>
    <div class="dash-module-title">${esc(b.title)}</div>
    <div class="dash-module-meta">
      <span>${diffLabel}</span>
      <span>${s.lessonsTotal} lessons</span>
      <span>${s.flashTotal} flashcards</span>
      <span>Quiz ${s.quizPct}%</span>
    </div>
    <div class="dash-progress-track"><div class="dash-progress-fill" style="width:${pct}%"></div></div>
    <a class="dash-btn dash-btn-primary" href="#/block/${b.id}">${pct > 0 ? "Continue" : "Start"}</a>
  </div>`;
}
function continueLearningHtml(active, continueBlock) {
  if (!continueBlock) {
    return `<div class="dash-card dash-glow"><div class="dash-card-title">All caught up</div><p class="dash-muted">Every ready module in this track is fully read. Check the quiz center to sharpen weak spots.</p></div>`;
  }
  const { b, s } = continueBlock;
  const pct = s.lessonsTotal ? Math.round((s.lessonsDone / s.lessonsTotal) * 100) : 0;
  const lastStudied = s.lastRead ? new Date(s.lastRead).toLocaleDateString() : "Not started";
  return `<div class="dash-card dash-glow">
    <div class="dash-card-title">${esc(b.id)}: ${esc(b.title)}</div>
    <div class="dash-progress-track"><div class="dash-progress-fill" style="width:${pct}%"></div></div>
    <div class="dash-module-meta">
      <span>${s.lessonsTotal} lessons</span>
      <span>${s.flashTotal} flashcards</span>
      <span>Quizzes: ${s.quizPct}%</span>
      <span>Last studied: ${esc(lastStudied)}</span>
    </div>
    <a class="dash-btn dash-btn-primary" href="#/block/${b.id}">Continue learning &rarr;</a>
  </div>`;
}
function roadmapHtml(steps) {
  return `<div class="dash-roadmap">${steps.map((st, i) => `
    <div class="dash-roadmap-step ${st.state}">
      <div class="dash-roadmap-dot"></div>
      <div class="dash-roadmap-label">${esc(st.b.title)}${st.state === "locked" ? " (locked)" : st.state === "complete" ? " &#10003;" : ""}</div>
    </div>
    ${i < steps.length - 1 ? '<div class="dash-roadmap-line"></div>' : ""}
  `).join("")}
  <div class="dash-roadmap-step ${steps.length && steps[steps.length - 1].state === "complete" ? "complete" : ""}">
    <div class="dash-roadmap-dot"></div>
    <div class="dash-roadmap-label">Exam ready</div>
  </div>
  </div>`;
}
function flashcardPanelHtml(active, activeStats, continueBlock) {
  const firstBlock = trackBlocks(active)[0];
  const reviewHref = continueBlock ? `#/flashcards/${continueBlock.b.id}` : (firstBlock ? `#/flashcards/${firstBlock.id}` : "#/dashboard");
  const learning = Math.max(0, activeStats.flashTotal - activeStats.flashMastered - activeStats.flashAgain);
  return `<div class="dash-card">
    <div class="dash-eyebrow">Flashcard mastery — ${esc(trackInfo(active).title)}</div>
    <div class="dash-flash-row">
      <div class="dash-stat"><span class="v" style="color:var(--dash-green)">${activeStats.flashMastered}</span><span class="l">Mastered</span></div>
      <div class="dash-stat"><span class="v" style="color:var(--dash-blue)">${learning}</span><span class="l">Learning</span></div>
      <div class="dash-stat"><span class="v" style="color:var(--dash-purple)">${activeStats.flashAgain}</span><span class="l">Need review</span></div>
    </div>
    <div class="dash-btn-row">
      <a class="dash-btn dash-btn-primary" href="${reviewHref}">Review today</a>
      <button class="dash-btn" data-action="reset-flashcards">Reset flashcards</button>
      <a class="dash-btn" href="${reviewHref}">Start new deck</a>
    </div>
  </div>`;
}
function quizCenterHtml(cpcmStats, fpsStats) {
  function side(key, stats) {
    const info = trackInfo(key);
    const weak = weakTopics(key, 3);
    return `<div class="dash-quiz-col">
      <div class="dash-eyebrow">${esc(info.title)} quizzes</div>
      <div class="dash-quiz-avg">${stats.quizAvgPct}%<span>avg score</span></div>
      <div class="dash-muted">${stats.modulesCompleted}/${stats.modulesTotal} modules quiz-ready</div>
      ${weak.length ? `<div class="dash-weak-title">Weak topics</div><ul class="dash-weak-list">${weak.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : `<div class="dash-muted" style="margin-top:8px;">No weak topics flagged yet.</div>`}
    </div>`;
  }
  return `<div class="dash-card"><div class="dash-quiz-grid">${side("cpcm", cpcmStats)}${side("fps", fpsStats)}</div></div>`;
}
function weeklyChartHtml(week, maxWeek) {
  return `<div class="dash-week-chart">${week.map((d) => `
    <div class="dash-week-col">
      <div class="dash-week-bar" style="height:${Math.max(4, Math.round((d.count / maxWeek) * 64))}px"></div>
      <div class="dash-week-label">${esc(d.label)}</div>
    </div>`).join("")}</div>`;
}
function resetPanelHtml(active) {
  const lastOverall = PROGRESS.lastReset.overall ? new Date(PROGRESS.lastReset.overall).toLocaleDateString() : "Never";
  const lastCpcm = PROGRESS.lastReset.cpcm ? new Date(PROGRESS.lastReset.cpcm).toLocaleDateString() : "Never";
  const lastFps = PROGRESS.lastReset.fps ? new Date(PROGRESS.lastReset.fps).toLocaleDateString() : "Never";
  const cb = pickContinueBlock(active);
  return `<div class="dash-card dash-reset-panel">
    <div class="dash-eyebrow">Reset &amp; new start</div>
    <div class="dash-btn-row">
      <button class="dash-btn" data-action="reset-module" ${cb ? "" : "disabled"}>Reset current module${cb ? " (" + esc(cb.b.id) + ")" : ""}</button>
      <button class="dash-btn dash-btn-danger" data-action="reset-cpcm">Reset CPCM Study Hub</button>
      <button class="dash-btn dash-btn-danger" data-action="reset-fps">Reset FPS Study Hub</button>
      <button class="dash-btn dash-btn-danger" data-action="fresh-start">Fresh start mode</button>
    </div>
    <div class="dash-reset-meta">
      <span>Last reset — overall: ${lastOverall}</span>
      <span>CPCM: ${lastCpcm}</span>
      <span>FPS: ${lastFps}</span>
    </div>
    ${PROGRESS.archive.length ? `<details class="dash-archive"><summary>Previous achievements archive (${PROGRESS.archive.length})</summary>
      ${PROGRESS.archive.map((a) => `<div class="dash-archive-item"><strong>${esc(a.label)}</strong> &middot; ${esc(a.date)} &middot; CPCM ${a.cpcm.lessonPct}% / FPS ${a.fps.lessonPct}%, streak ${a.streak}d</div>`).join("")}
    </details>` : ""}
  </div>`;
}

/* -- backup / cross-device transfer -- */
function exportProgress() {
  const data = JSON.stringify(PROGRESS, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `study-progress-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function setImportMsg(text, isError) {
  const el = document.getElementById("dash-import-msg");
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? "#ff9b9b" : "";
}
function importProgressFile(file) {
  setImportMsg("");
  const reader = new FileReader();
  reader.onerror = () => setImportMsg("Couldn't read that file.", true);
  reader.onload = () => {
    let parsed;
    try {
      parsed = JSON.parse(reader.result);
    } catch (e) {
      setImportMsg("That file isn't valid JSON.", true);
      return;
    }
    if (!isValidProgressShape(parsed)) {
      setImportMsg("That file doesn't look like a study-progress export.", true);
      return;
    }
    const normalized = normalizeProgress(parsed);
    const prevProgress = PROGRESS;
    PROGRESS = normalized;
    const cpcmPreview = trackStats("cpcm");
    const fpsPreview = trackStats("fps");
    const streakPreview = computeStreak();
    PROGRESS = prevProgress;
    openDashModal({
      title: "Import this progress file?",
      message: `This replaces your current progress on this device. Incoming file — CPCM ${cpcmPreview.lessonPct}% complete, FPS ${fpsPreview.lessonPct}% complete, streak ${streakPreview}d.`,
      confirmLabel: "Replace with imported data",
      onConfirm: () => { PROGRESS = normalized; saveProgress(PROGRESS); },
    });
  };
  reader.readAsText(file);
}
function backupPanelHtml() {
  return `<div class="dash-card">
    <div class="dash-eyebrow">Backup &amp; transfer</div>
    <p class="dash-muted">Progress is stored locally on this device only — opening the site on another phone or laptop starts fresh. Export a backup file here, then import it on the other device to bring your progress across.</p>
    <div class="dash-btn-row">
      <button class="dash-btn dash-btn-primary" data-action="export-progress">Export progress</button>
      <label class="dash-btn" for="dash-import-input" style="cursor:pointer;">Import progress
        <input type="file" id="dash-import-input" accept="application/json" style="display:none;" />
      </label>
    </div>
    <div id="dash-import-msg" class="dash-muted" style="margin-top:8px;"></div>
  </div>`;
}

/* -- modal -- */
let dashModal = null;
function openDashModal(cfg) { dashModal = cfg; renderDashModal(); }
function closeDashModal() { dashModal = null; renderDashModal(); }
function renderDashModal() {
  const root = document.getElementById("dash-modal-root");
  if (!root) return;
  if (!dashModal) { root.innerHTML = ""; return; }
  root.innerHTML = `
    <div class="dash-modal-backdrop" id="dash-modal-backdrop">
      <div class="dash-modal">
        <div class="dash-modal-title">${esc(dashModal.title)}</div>
        <p class="dash-modal-msg">${esc(dashModal.message)}</p>
        <div class="dash-btn-row">
          <button class="dash-btn" id="dash-modal-cancel">Cancel</button>
          <button class="dash-btn dash-btn-danger" id="dash-modal-confirm">${esc(dashModal.confirmLabel || "Confirm")}</button>
        </div>
      </div>
    </div>`;
  document.getElementById("dash-modal-cancel").addEventListener("click", closeDashModal);
  document.getElementById("dash-modal-confirm").addEventListener("click", () => {
    const action = dashModal.onConfirm;
    dashModal = null;
    action();
    render();
  });
  document.getElementById("dash-modal-backdrop").addEventListener("click", (e) => { if (e.target.id === "dash-modal-backdrop") closeDashModal(); });
}

/* -- main dashboard view -- */
function viewDashboard() {
  const active = PROGRESS.activeTrack || "cpcm";
  const cpcmStats = trackStats("cpcm");
  const fpsStats = trackStats("fps");
  const overallPct = Math.round(((cpcmStats.lessonPct || 0) + (fpsStats.lessonPct || 0)) / 2);
  const level = overallPct < 25 ? "Beginner" : overallPct < 60 ? "Intermediate" : overallPct < 90 ? "Advanced" : "Expert";
  const streak = computeStreak();
  const hours = estHours();
  const badges = computeBadges();
  const activeStats = active === "cpcm" ? cpcmStats : fpsStats;
  const continueBlock = pickContinueBlock(active);
  const activeBlocks = trackBlocks(active);
  const weak = weakTopics(active, 5);
  const week = weeklyActivity();
  const maxWeek = Math.max(1, ...week.map((d) => d.count));

  const roadmapSteps = activeBlocks.map((b, i) => {
    const s = blockStats(b.id);
    const complete = s.lessonsTotal > 0 && s.lessonsDone === s.lessonsTotal;
    const prevComplete = i === 0 || (() => { const ps = blockStats(activeBlocks[i - 1].id); return ps.lessonsTotal > 0 && ps.lessonsDone === ps.lessonsTotal; })();
    const locked = !!(PROGRESS.freshStartLock[active] && i > 0 && !prevComplete);
    const state = locked ? "locked" : complete ? "complete" : s.lessonsDone > 0 ? "current" : "upcoming";
    return { b, state };
  });

  return `
    <div class="dash">
      <div class="dash-profile dash-card">
        <div class="dash-profile-top">
          <div>
            <input id="dash-name-input" class="dash-name-input" value="${esc(PROGRESS.profileName)}" aria-label="Your name" />
            <div class="dash-profile-sub">${esc(trackInfo(active).title)} &middot; ${level}</div>
          </div>
          <div class="dash-profile-stats">
            <div class="dash-stat"><span class="v">${streak}</span><span class="l">Day streak</span></div>
            <div class="dash-stat"><span class="v">${hours}h</span><span class="l">Study time</span></div>
            <div class="dash-stat"><span class="v">${overallPct}%</span><span class="l">Overall</span></div>
          </div>
        </div>
        <div class="dash-badges">${badges.length ? badges.map((b) => `<span class="dash-badge">${esc(b)}</span>`).join("") : `<span class="dash-muted">No badges yet — keep studying to earn your first one.</span>`}</div>
      </div>

      <div class="dash-mode-selector">
        <button class="dash-mode-btn ${active === "cpcm" ? "active" : ""}" data-mode="cpcm">CPCM Study Hub</button>
        <button class="dash-mode-btn ${active === "fps" ? "active" : ""}" data-mode="fps">FPS Study Hub</button>
      </div>

      ${resetPanelHtml(active)}
      ${backupPanelHtml()}

      <div class="dash-eyebrow" style="margin-top:6px;">Overall progress</div>
      <div class="dash-progress-track big"><div class="dash-progress-fill" style="width:${overallPct}%"></div></div>

      <div class="dash-grid-2">
        <div class="dash-card">
          <div class="dash-eyebrow">CPCM progress</div>
          <div class="dash-track-row">
            ${progressRing(cpcmStats.lessonPct, 72, "var(--dash-blue)")}
            <div class="dash-track-meta">
              <div>${cpcmStats.modulesCompleted}/${cpcmStats.modulesTotal} modules complete</div>
              <div>${cpcmStats.flashMastered}/${cpcmStats.flashTotal} flashcards mastered</div>
              <div>Quiz average: ${cpcmStats.quizAvgPct}%</div>
              <div>Exam readiness: ${cpcmStats.examReadiness}%</div>
            </div>
          </div>
        </div>
        <div class="dash-card">
          <div class="dash-eyebrow">FPS progress</div>
          <div class="dash-track-row">
            ${progressRing(fpsStats.lessonPct, 72, "var(--dash-green)")}
            <div class="dash-track-meta">
              <div>${fpsStats.modulesCompleted}/${fpsStats.modulesTotal} systems complete</div>
              <div>${fpsStats.flashMastered}/${fpsStats.flashTotal} practice items mastered</div>
              <div>SQL/system knowledge score: ${fpsStats.quizAvgPct}%</div>
              <div>Exam readiness: ${fpsStats.examReadiness}%</div>
            </div>
          </div>
        </div>
      </div>

      <div class="dash-eyebrow" style="margin-top:6px;">Continue learning</div>
      ${continueLearningHtml(active, continueBlock)}

      <div class="dash-eyebrow" style="margin-top:6px;">Learning roadmap — ${esc(trackInfo(active).title)}</div>
      <div class="dash-card">${roadmapHtml(roadmapSteps)}</div>

      <div class="dash-eyebrow" style="margin-top:6px;">Modules</div>
      <div class="dash-module-grid">
        ${roadmapSteps.map((st) => moduleCardHtml(st.b, st.state)).join("")}
      </div>

      <div class="dash-grid-2">
        <div class="dash-card">
          <div class="dash-eyebrow">Weekly study activity</div>
          ${weeklyChartHtml(week, maxWeek)}
        </div>
        <div class="dash-card">
          <div class="dash-eyebrow">Your focus areas</div>
          ${weak.length ? `<div class="dash-weak-title">Need revision</div><ul class="dash-weak-list">${weak.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : `<p class="dash-muted">No weak topics flagged yet — answer some quiz questions to populate this.</p>`}
        </div>
      </div>

      ${flashcardPanelHtml(active, activeStats, continueBlock)}

      <div class="dash-eyebrow" style="margin-top:6px;">Quiz center</div>
      ${quizCenterHtml(cpcmStats, fpsStats)}

      <div id="dash-modal-root"></div>
    </div>
  `;
}
function bindDashboardEvents() {
  const active = PROGRESS.activeTrack || "cpcm";
  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => { PROGRESS.activeTrack = btn.dataset.mode; saveProgress(PROGRESS); render(); });
  });
  const nameInput = document.getElementById("dash-name-input");
  if (nameInput) {
    nameInput.addEventListener("change", () => { PROGRESS.profileName = nameInput.value.trim() || "Student"; saveProgress(PROGRESS); render(); });
  }
  const resetModuleBtn = document.querySelector('[data-action="reset-module"]');
  if (resetModuleBtn) resetModuleBtn.addEventListener("click", () => {
    const cb = pickContinueBlock(active);
    if (!cb) return;
    openDashModal({
      title: "Reset this module?",
      message: `Clear progress for Block ${cb.b.id}: ${cb.b.title}? Your overall achievements stay intact.`,
      confirmLabel: "Reset module",
      onConfirm: () => resetModuleProgress(cb.b.id),
    });
  });
  const resetCpcmBtn = document.querySelector('[data-action="reset-cpcm"]');
  if (resetCpcmBtn) resetCpcmBtn.addEventListener("click", () => {
    openDashModal({
      title: "Start CPCM journey from the beginning?",
      message: "This clears CPCM module completion, quiz scores, flashcard history, and study streak data tied to CPCM. FPS progress is unaffected.",
      confirmLabel: "Reset CPCM",
      onConfirm: () => resetTrackProgress("cpcm"),
    });
  });
  const resetFpsBtn = document.querySelector('[data-action="reset-fps"]');
  if (resetFpsBtn) resetFpsBtn.addEventListener("click", () => {
    openDashModal({
      title: "Start FPS journey from the beginning?",
      message: "This clears FPS module completion, practice results, flashcard progress, and exam readiness score. CPCM progress is unaffected.",
      confirmLabel: "Reset FPS",
      onConfirm: () => resetTrackProgress("fps"),
    });
  });
  const freshBtn = document.querySelector('[data-action="fresh-start"]');
  if (freshBtn) freshBtn.addEventListener("click", () => {
    openDashModal({
      title: "Begin a fresh start?",
      message: "This resets everything — both tracks, your study streak, and study history — and re-locks modules in recommended order. A snapshot is archived first.",
      confirmLabel: "Fresh start",
      onConfirm: () => freshStartReset(),
    });
  });
  const resetFlashBtn = document.querySelector('[data-action="reset-flashcards"]');
  if (resetFlashBtn) resetFlashBtn.addEventListener("click", () => {
    openDashModal({
      title: "Reset flashcards?",
      message: `Clear flashcard ratings for ${trackInfo(active).title}? Lessons and quiz scores are kept.`,
      confirmLabel: "Reset flashcards",
      onConfirm: () => resetTrackFlashcards(active),
    });
  });
  const exportBtn = document.querySelector('[data-action="export-progress"]');
  if (exportBtn) exportBtn.addEventListener("click", exportProgress);
  const importInput = document.getElementById("dash-import-input");
  if (importInput) importInput.addEventListener("change", () => {
    const file = importInput.files[0];
    if (file) importProgressFile(file);
    importInput.value = "";
  });
}

/* ---------- boot ---------- */
window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) menuToggle.addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));

  const topSearch = document.getElementById("top-search");
  if (topSearch) {
    topSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        location.hash = "#/search/" + encodeURIComponent(topSearch.value);
      }
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      if (topSearch) topSearch.focus();
      else location.hash = "#/search";
    }
  });

  render();
});
