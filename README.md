# CPCM / FPS Analyst Study Hub

A study site built from your bootcamp curriculum (`00_Course_Overview_and_Syllabus.md` through `14_Interview_Prep_Guide.md`): readable lessons, flip-card flashcards, self-scoring quizzes, and a searchable glossary. No install, no build step, no account — open `index.html` in a browser on your laptop, phone, or tablet.

## What's built so far

**Block A — Foundations (Lessons 1-5)**, in full: explanation, diagram, key terms, real-world example, comparison table, exam tips, memory trick, scenario questions, plus the revision pack (10 core flashcards + 25 additional practice questions) turned into an interactive flip-card deck, and all 50 lesson MCQs turned into a shuffled, self-scoring quiz.

**Glossary**: Block A's key terms plus ~80 terms merged in from your supplementary `Payments_Terminology_Glossary.docx` — card models, domestic rails, cross-border/correspondent banking, SWIFT message types (MT103, MT202, MT940...), ISO 20022 (pacs.008, camt.053...), and reconciliation/STP terms. Searchable.

**Blocks B-H** show on the roadmap as "coming soon" — same structure, built out lesson block by block.

## How to use it

Just open `index.html` — double-click it, or drag it into a browser tab. Everything runs client-side; your read/flashcard/quiz progress is saved in that browser's local storage (per device — it won't sync between your phone and laptop unless you host it, see below).

## Structure

```
fps-study-hub/
  index.html            Shell: nav, routing, mounts the app
  app.js                All view logic (router, diagram renderer, flashcards, quiz, glossary)
  styles.css            Responsive styling
  data/
    course-map.js       The 8-block roadmap
    block-a.js           Lessons 1-5 content, MCQs, scenarios, revision pack
    glossary-extra.js    Supplementary glossary terms
```

Adding a block later means writing a new `data/block-b.js` in the same shape as `block-a.js`, adding it to `course-map.js` with `status: "ready"`, and wiring one more `BLOCKS_BY_ID` entry in `app.js` — the rest of the app (routing, diagrams, revision pack rendering) is already generic.

## Free hosting, so it works from your phone without emailing yourself a file

Push this folder to a GitHub repo and turn on GitHub Pages (Settings → Pages → deploy from branch) — no build step needed since it's plain HTML/CSS/JS. You'll get a URL like `yourname.github.io/fps-study-hub` that works identically on laptop, phone, and tablet. Note progress is per-browser local storage, so it won't sync across devices unless you're logged into the same browser profile (e.g. Chrome sync) on each.

## What's next

Blocks B-H (UK Domestic Clearing → Cards → Treasury → ISO 20022/Open Banking → Risk & Compliance → Regulation/Career), the Final Revision Handbook's 300+ term glossary and top-100 facts, the 3 mock exams as full timed quiz mode, and the study timetables as a checklist view.
