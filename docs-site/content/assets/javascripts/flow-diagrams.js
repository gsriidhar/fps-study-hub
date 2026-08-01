/* ==========================================================================
   Flow diagrams — reusable animated SVG diagram engine.
   Renders three diagram types, driven entirely by a JSON config embedded
   in each page's markup (progressive-enhancement style, same pattern as
   assets/javascripts/assistant.js):

     <div class="flow-diagram" data-flow="pipeline" markdown="0">
       <script type="application/json">{ "nodes": [...], "edges": [...] }</script>
     </div>

     <div class="flow-diagram" data-flow="radial" markdown="0">
       <script type="application/json">{ "center": {...}, "spokes": [...] }</script>
     </div>

     <div class="flow-diagram" data-flow="stagepath" markdown="0">
       <script type="application/json">{ "stages": [{ "label": ..., "facts": [...] }, ...] }</script>
     </div>

   All three render a full SVG diagram for wider viewports (with an
   animated "flowing dash" effect along every connector) and a simpler
   vertical stacked fallback for narrow viewports — toggled purely by CSS
   media query in flow-diagrams.css, so no JS resize handling is needed.
   Animation respects prefers-reduced-motion (handled in the CSS).
   ========================================================================== */

(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var XHTML_NS = "http://www.w3.org/1999/xhtml";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function svgEl(tag, attrs) {
    var e = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
      }
    }
    return e;
  }

  function nodeInnerHTML(node) {
    var html = "";
    if (node.label) html += '<span class="fd-node-label">' + escapeHtml(node.label) + "</span>";
    if (node.sublabel) html += '<span class="fd-node-sublabel">' + escapeHtml(node.sublabel) + "</span>";
    if (node.facts && node.facts.length) {
      html +=
        '<ul class="fd-facts">' +
        node.facts.map(function (f) {
          return "<li>" + escapeHtml(f) + "</li>";
        }).join("") +
        "</ul>";
    }
    return html;
  }

  function foreignNode(x, y, w, h, innerHTML, extraClass) {
    var fo = svgEl("foreignObject", { x: x, y: y, width: w, height: h });
    var body = document.createElementNS(XHTML_NS, "div");
    body.setAttribute("class", "fd-node" + (extraClass ? " " + extraClass : ""));
    body.innerHTML = innerHTML;
    fo.appendChild(body);
    return fo;
  }

  function pathBetween(x1, y1, x2, y2) {
    return "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
  }

  function labelText(x, y, text, className) {
    var t = svgEl("text", { x: x, y: y, "text-anchor": "middle", class: className });
    t.textContent = text;
    return t;
  }

  function titleEl(title, eyebrow) {
    var div = document.createElement("div");
    div.className = "fd-title";
    var html = "";
    if (eyebrow) html += '<span class="fd-eyebrow">' + escapeHtml(eyebrow) + "</span>";
    html += escapeHtml(title);
    div.innerHTML = html;
    return div;
  }

  function tagEl(text, muted) {
    var span = document.createElement("span");
    span.className = "fd-tag" + (muted ? " fd-tag--muted" : "");
    span.textContent = text;
    return span;
  }

  // -------------------------------------------------------------------
  // Pipeline: a left-to-right chain of nodes with animated forward
  // (and optional return) message paths between each adjacent pair.
  // -------------------------------------------------------------------
  function renderPipeline(container, cfg) {
    var nodes = cfg.nodes || [];
    var edges = cfg.edges || [];
    if (!nodes.length) return;

    if (cfg.title) container.appendChild(titleEl(cfg.title, cfg.eyebrow));

    var n = nodes.length;
    var boxW = 172;
    var boxH = 102;
    var gap = 104;
    var totalW = n * boxW + (n - 1) * gap + 40;
    var totalH = boxH + 76;
    var y = 44;

    var svg = svgEl("svg", {
      class: "fd-pipeline-svg",
      viewBox: "0 0 " + totalW + " " + totalH,
      role: "img",
      "aria-label": cfg.ariaLabel || cfg.title || "Pipeline diagram",
    });

    var xs = [];
    var i;
    for (i = 0; i < n; i++) xs.push(20 + i * (boxW + gap));

    for (i = 0; i < n - 1; i++) {
      var x1 = xs[i] + boxW;
      var x2 = xs[i + 1];
      var midY = y + boxH / 2;
      var fwdY = midY - 11;
      var retY = midY + 13;
      var edge = edges[i] || {};

      svg.appendChild(svgEl("path", { d: pathBetween(x1, fwdY, x2, fwdY), class: "fd-flow-path" }));
      if (edge.label) {
        svg.appendChild(labelText((x1 + x2) / 2, fwdY - 8, edge.label, "fd-edge-label"));
      }
      if (edge.returnLabel) {
        svg.appendChild(
          svgEl("path", { d: pathBetween(x2, retY, x1, retY), class: "fd-flow-path fd-flow-path--return" })
        );
        svg.appendChild(labelText((x1 + x2) / 2, retY + 16, edge.returnLabel, "fd-edge-label fd-edge-label--muted"));
      }
    }

    for (i = 0; i < n; i++) {
      var extra = nodes[i].accent ? "fd-node--accent" : "";
      svg.appendChild(foreignNode(xs[i], y, boxW, boxH, nodeInnerHTML(nodes[i]), extra));
    }

    container.appendChild(svg);
    container.appendChild(renderPipelineStack(nodes, edges));
  }

  function renderPipelineStack(nodes, edges) {
    var stack = document.createElement("div");
    stack.className = "fd-pipeline-stack";
    nodes.forEach(function (node, idx) {
      var card = document.createElement("div");
      card.className = "fd-node fd-stack-node" + (node.accent ? " fd-node--accent" : "");
      card.innerHTML = nodeInnerHTML(node);
      stack.appendChild(card);

      if (idx < nodes.length - 1) {
        var edge = edges[idx] || {};
        var connector = document.createElement("div");
        connector.className = "fd-stack-connector";
        var line = document.createElement("div");
        line.className = "fd-stack-connector-line";
        var tags = document.createElement("div");
        tags.className = "fd-stack-connector-tags";
        if (edge.label) tags.appendChild(tagEl(edge.label, false));
        if (edge.returnLabel) tags.appendChild(tagEl(edge.returnLabel, true));
        connector.appendChild(line);
        connector.appendChild(tags);
        stack.appendChild(connector);
      }
    });
    return stack;
  }

  // -------------------------------------------------------------------
  // Radial: a hub-and-spoke mind map — one center node, N evenly spaced
  // spoke nodes around it, each with its own short fact list.
  // -------------------------------------------------------------------
  function renderRadial(container, cfg) {
    var spokes = cfg.spokes || [];
    var center = cfg.center || {};
    if (!spokes.length) return;

    if (cfg.title) container.appendChild(titleEl(cfg.title, cfg.eyebrow));

    var n = spokes.length;
    var R = 208;
    var boxW = 182;
    var boxH = 154;
    var centerSize = 120;
    var pad = 26;
    var size = 2 * (R + boxW / 2) + pad * 2;
    var cx = size / 2;
    var cy = size / 2;

    var svg = svgEl("svg", {
      class: "fd-radial-svg",
      viewBox: "0 0 " + size + " " + size,
      role: "img",
      "aria-label": cfg.ariaLabel || cfg.title || "Radial diagram",
    });

    var positions = [];
    var i;
    for (i = 0; i < n; i++) {
      var angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      positions.push({
        x: cx + R * Math.cos(angle),
        y: cy + R * Math.sin(angle),
        angle: angle,
      });
    }

    var centerR = centerSize / 2;
    positions.forEach(function (p) {
      var edgeX = cx + centerR * Math.cos(p.angle);
      var edgeY = cy + centerR * Math.sin(p.angle);
      svg.appendChild(
        svgEl("path", {
          d: pathBetween(edgeX, edgeY, p.x, p.y),
          class: "fd-flow-path fd-flow-path--spoke",
        })
      );
    });

    svg.appendChild(
      foreignNode(
        cx - centerR,
        cy - centerR,
        centerSize,
        centerSize,
        '<span class="fd-node-label fd-radial-center-label">' + escapeHtml(center.label || "") + "</span>",
        "fd-node--accent fd-radial-center"
      )
    );

    positions.forEach(function (p, idx) {
      svg.appendChild(foreignNode(p.x - boxW / 2, p.y - boxH / 2, boxW, boxH, nodeInnerHTML(spokes[idx])));
    });

    container.appendChild(svg);
    container.appendChild(renderRadialStack(center, spokes));
  }

  function renderRadialStack(center, spokes) {
    var stack = document.createElement("div");
    stack.className = "fd-radial-stack";

    var centerCard = document.createElement("div");
    centerCard.className = "fd-node fd-node--accent fd-stack-center";
    centerCard.innerHTML = '<span class="fd-node-label">' + escapeHtml(center.label || "") + "</span>";
    stack.appendChild(centerCard);

    spokes.forEach(function (spoke) {
      var row = document.createElement("div");
      row.className = "fd-stack-spoke";
      var bar = document.createElement("div");
      bar.className = "fd-stack-spoke-bar";
      var card = document.createElement("div");
      card.className = "fd-node fd-stack-spoke-card";
      card.innerHTML = nodeInnerHTML(spoke);
      row.appendChild(bar);
      row.appendChild(card);
      stack.appendChild(row);
    });

    return stack;
  }

  // -------------------------------------------------------------------
  // Stage path: a numbered vertical spine (a linear roadmap/timeline)
  // where each stage branches sideways to a labelled card with its own
  // short fact list. Used for ordered, multi-step curricula/journeys.
  // -------------------------------------------------------------------
  function renderStagePath(container, cfg) {
    var stages = cfg.stages || [];
    if (!stages.length) return;

    if (cfg.title) container.appendChild(titleEl(cfg.title, cfg.eyebrow));

    var n = stages.length;
    var circleR = 20;
    var cardW = 460;
    var cardH = 100;
    var branchLen = 46;
    var spineX = 30;
    var cardX = spineX + circleR + branchLen;
    var totalW = cardX + cardW + 24;
    var firstY = 40;
    var stageGap = cardH + 34;
    var totalH = firstY + (n - 1) * stageGap + cardH / 2 + 34;

    var svg = svgEl("svg", {
      class: "fd-stagepath-svg",
      viewBox: "0 0 " + totalW + " " + totalH,
      role: "img",
      "aria-label": cfg.ariaLabel || cfg.title || "Stage path diagram",
    });

    var ys = [];
    var i;
    for (i = 0; i < n; i++) ys.push(firstY + i * stageGap);

    if (n > 1) {
      svg.appendChild(
        svgEl("path", {
          d: pathBetween(spineX, ys[0], spineX, ys[n - 1]),
          class: "fd-flow-path fd-flow-path--spine",
        })
      );
    }

    for (i = 0; i < n; i++) {
      var y = ys[i];
      var accent = !!stages[i].accent;

      svg.appendChild(
        svgEl("path", {
          d: pathBetween(spineX + circleR, y, cardX, y),
          class: "fd-flow-path fd-flow-path--branch",
        })
      );

      svg.appendChild(
        svgEl("circle", {
          cx: spineX,
          cy: y,
          r: circleR,
          class: "fd-stage-circle" + (accent ? " fd-stage-circle--accent" : ""),
        })
      );
      svg.appendChild(
        labelText(spineX, y + 4, stages[i].number != null ? String(stages[i].number) : String(i + 1), "fd-stage-number")
      );

      svg.appendChild(
        foreignNode(cardX, y - cardH / 2, cardW, cardH, nodeInnerHTML(stages[i]), accent ? "fd-node--accent" : "")
      );
    }

    container.appendChild(svg);
    container.appendChild(renderStagePathStack(stages));
  }

  function renderStagePathStack(stages) {
    var stack = document.createElement("div");
    stack.className = "fd-stagepath-stack";

    stages.forEach(function (stage, idx) {
      var row = document.createElement("div");
      row.className = "fd-stagepath-row";

      var badge = document.createElement("div");
      badge.className = "fd-stage-number-badge" + (stage.accent ? " fd-stage-number-badge--accent" : "");
      badge.textContent = stage.number != null ? String(stage.number) : String(idx + 1);

      var card = document.createElement("div");
      card.className = "fd-node fd-stack-node" + (stage.accent ? " fd-node--accent" : "");
      card.innerHTML = nodeInnerHTML(stage);

      row.appendChild(badge);
      row.appendChild(card);
      stack.appendChild(row);

      if (idx < stages.length - 1) {
        stack.appendChild(document.createElement("div")).className = "fd-stagepath-connector";
      }
    });

    return stack;
  }

  // -------------------------------------------------------------------
  // Auto-init: find every undressed .flow-diagram[data-flow] on the page,
  // read its embedded JSON config, and render into it.
  // -------------------------------------------------------------------
  function init() {
    var containers = document.querySelectorAll(".flow-diagram[data-flow]");
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      if (container.getAttribute("data-fd-rendered") === "true") continue;

      var type = container.getAttribute("data-flow");
      var cfgScript = container.querySelector('script[type="application/json"]');
      if (!cfgScript) continue;

      var cfg;
      try {
        cfg = JSON.parse(cfgScript.textContent);
      } catch (e) {
        continue;
      }

      if (type === "pipeline") renderPipeline(container, cfg);
      else if (type === "radial") renderRadial(container, cfg);
      else if (type === "stagepath") renderStagePath(container, cfg);

      container.setAttribute("data-fd-rendered", "true");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Material's instant-navigation feature (if enabled) swaps page content
  // via an observable rather than a full reload — re-run defensively so
  // diagrams still render after a client-side navigation.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  }
})();
