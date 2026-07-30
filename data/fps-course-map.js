// Roadmap for the dedicated FPS analyst deep-dive (separate from the general
// CPCM curriculum) — sourced from "FPS - Faster Payments System", rewritten
// in original wording per your instruction not to reproduce paid course text.
const FPS_COURSE_MAP = [
  { id: "F1", title: "FPS Fundamentals", lessons: [1,2,3,4,5], desc: "What FPS is, the full ecosystem of participants, direct vs indirect access, and how a payment gets initiated and validated.", status: "ready" },
  { id: "F2", title: "Checks, Submission & Settlement", lessons: [6,7,8,9,10], desc: "Confirmation of Payee, fraud & risk controls, FPS submission, receiving-bank processing, settlement & reconciliation.", status: "ready" },
  { id: "F3", title: "Payment Data & Operations", lessons: [11,12,13,14,15], desc: "Payment fields, statuses, references, the Ops team's role, and exception queues.", status: "ready" },
  { id: "F4", title: "Investigations", lessons: [16,17,18,19,20,21], desc: "Payment returns and rejections, and how to investigate missing, delayed, duplicate, and fraudulent payments.", status: "ready" },
  { id: "F5", title: "Reconciliation & Architecture", lessons: [22,23,24,25], desc: "Reconciliation fundamentals, breaks, Nostro/settlement reconciliation, and typical bank system architecture.", status: "ready" },
  { id: "F6", title: "Systems & SQL", lessons: [26,27,28,29,30], desc: "Middleware, databases in FPS systems, SQL basics, and failed-payment analysis using SQL.", status: "ready" },
  { id: "F7", title: "Testing FPS", lessons: [31,32,33,34,35,36], desc: "Happy-path, negative, CoP, and fraud testing for FPS payments.", status: "ready" },
  { id: "F8", title: "Monitoring & Live Simulation", lessons: [37,38,39,40], desc: "Monitoring FPS systems in production, and an end-to-end investigation simulation.", status: "ready" },
];
