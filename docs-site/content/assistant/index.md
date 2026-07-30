---
title: "Knowledge Assistant"
---

# Knowledge Assistant

Ask a question in your own words — e.g. *"What is FPS settlement?"* or *"Compare MT103 and pacs.008"* — and the assistant retrieves the most relevant passages from every lesson on this site, ranked by relevance.

<div id="assistant-panel" markdown="0">
  <div id="assistant-key-row">
    <input id="assistant-api-key" type="password" placeholder="Optional: paste your own Anthropic API key for a synthesized answer (kept in your browser only, never stored or sent anywhere else)" />
  </div>
  <textarea id="assistant-question" placeholder="Ask about FPS, CoP, ISO 20022, investigations, reconciliation..."></textarea><br>
  <button id="assistant-ask">Ask</button>
  <div id="assistant-status" style="margin-top:0.5rem; font-size:0.85rem; opacity:0.7;"></div>
  <div id="assistant-results"></div>
</div>

## How this works

This is a **retrieval-first** assistant, not a hosted chatbot — there is no backend server, so it works entirely in your browser and stays free to host on GitHub Pages:

1. Every lesson on this site is pre-indexed into a lightweight relevance index (`assets/embeddings/index.json`), built from the same Markdown files you're reading.
2. When you ask a question, your browser scores every indexed passage against your question locally and shows the best-matching excerpts, with a link to the full lesson.
3. If you paste your own Anthropic API key above (used only for that request, straight from your browser to Anthropic — never sent to or stored on any server this site controls), the assistant will also ask Claude to synthesize a short answer from the retrieved passages, with citations back to the source lessons.
4. Without a key, you still get ranked, cited source passages — genuinely useful on its own, just not a written-out paragraph answer.

See the [architecture document](https://github.com/gsriidhar/fps-study-hub/blob/master/ARCHITECTURE.md) for the full design, including the production-hardened version of this (a small serverless proxy so users never need to paste their own key).
