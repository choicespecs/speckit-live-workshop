#!/usr/bin/env node
"use strict";

const path = require("path");
const os   = require("os");
const { execSync } = require("child_process");

try { require.resolve("pptxgenjs"); } catch (e) {
  console.log("Installing pptxgenjs…");
  execSync("npm install pptxgenjs", { cwd: __dirname, stdio: "inherit" });
}

const PptxGenJS = require("pptxgenjs");
const {
  createHelpers, paletteByName, paletteFromAccent, fontPersonalityFromName,
} = require(path.join(os.homedir(), ".claude", "lib", "pptx-helpers"));

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.title  = "Spec-Driven Development Presentation";
pptx.author = "gen-presentation";

// Palette drives ALL colours — bg, cards, code area, text, accents.
const T = paletteByName("Cyan Matrix") || paletteFromAccent("00b4cc");

// Font personality drives ALL typefaces — title, body, code.
const fontP = fontPersonalityFromName("technical");

const {
  newSlide, addBadge, addTitle, addDivider,
  addBulletsDistributed, addCodeBlock,
  addTwoColumn, addCalloutBox, newSectionSlide, addFlowDiagram, addStatCard,
  autoCodeFontSize, fitCodeLayout,
  W, PAD, CONTENT_Y, SAFE_BOT, CONTENT_H,
} = createHelpers(pptx, T, { font: fontP });

const BADGE = "SPEC-DRIVEN DEV";

// ── Table helper (not provided by pptx-helpers — built locally) ──────────────
function headerCell(text, w) {
  return {
    text,
    options: {
      fontSize: 18, bold: true, fontFace: fontP.body, color: T.accentLight,
      fill: { color: T.accentBg }, align: "left", valign: "middle",
      border: [
        { type: "solid", color: T.accent, pt: 0.75 },
        { type: "solid", color: T.accent, pt: 0.75 },
        { type: "solid", color: T.accent, pt: 0.75 },
        { type: "solid", color: T.accent, pt: 0.75 },
      ],
    },
  };
}
function bodyCell(text, shaded) {
  return {
    text,
    options: {
      fontSize: 17, bold: false, fontFace: fontP.body, color: T.primary,
      fill: { color: shaded ? T.bgCard : T.bg }, align: "left", valign: "middle",
      border: [
        { type: "solid", color: T.accent, pt: 0.5 },
        { type: "solid", color: T.accent, pt: 0.5 },
        { type: "solid", color: T.accent, pt: 0.5 },
        { type: "solid", color: T.accent, pt: 0.5 },
      ],
    },
  };
}

// ── Slide 1 — Title ───────────────────────────────────────────────────────────
{
  const s = newSlide();
  s.addText("Spec-Driven Development", {
    x: PAD, y: 1.2, w: W - PAD * 2, h: 1.2,
    fontSize: 56, bold: fontP.titleBold, italic: fontP.titleItalic,
    fontFace: fontP.title, color: T.primary, align: "center",
    charSpacing: fontP.letterSpacing,
  });
  s.addText("with GitHub Spec-Kit", {
    x: PAD, y: 2.45, w: W - PAD * 2, h: 1.0,
    fontSize: 44, bold: true,
    fontFace: fontP.title, color: T.accentLight, align: "center",
  });
  s.addShape("rect", { x: 0, y: 3.75, w: W, h: 0.06, fill: { color: T.accent }, line: { color: T.accent } });
  s.addText("Decide once, in writing, before you type a single line of code.", {
    x: PAD, y: 4.0, w: W - PAD * 2, h: 0.7,
    fontSize: 22, fontFace: fontP.body, color: T.muted, align: "center", italic: true,
  });
  s.addText("A Conceptual Primer  ·  Up next: a live build of a URL shortener, from zero", {
    x: PAD, y: 4.75, w: W - PAD * 2, h: 0.5,
    fontSize: 16, fontFace: fontP.body, color: T.muted, align: "center",
  });
  s.addText(BADGE, {
    x: PAD, y: 6.9, w: W - PAD * 2, h: 0.4,
    fontSize: 14, fontFace: fontP.body, color: T.muted, align: "center",
    charSpacing: fontP.letterSpacing,
  });
  s.addNotes("This is the conceptual primer that runs immediately before a live terminal demo. Nothing here is abstract theory disconnected from practice — every command named in this deck is about to be typed for real, from an empty repo, right after this.");
}

// ── Slide 2 — The Problem: What Vibe-Coding Produces ─────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "The Problem: What Vibe-Coding Produces");
  addDivider(s);
  const bullets = [
    "One-shot prompting: describe a feature in a sentence or two, get a working app back",
    "Implicit decisions get baked in with no record of them — naming, error shapes, edge cases, all decided invisibly in a single generation pass",
    "Inconsistent naming and error shapes across a codebase, because there was never one upstream decision they both trace back to",
    "No paper trail: ask \"why is it built this way\" six weeks later, and nobody — including the original author — can answer with anything but a guess",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs, "e8836a");
  s.addNotes("Frame this as a fair description of how most of us build things day to day, not a strawman. One-shot prompting works, and it's fast — the point isn't that it's wrong, it's that it's silent about its own decisions.");
}

// ── Slide 3 — What Is Spec-Driven Development? ───────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "What Is Spec-Driven Development?");
  addDivider(s);
  const bullets = [
    "A discipline that separates why, what, how, and order into distinct, written artifacts — all produced before any implementation code exists",
    "Why → constitution: the non-negotiable principles",
    "What → spec: the requirements and user stories, in testable language",
    "How → plan: the technical design, gated against the constitution",
    "Order → tasks: a dependency-ordered checklist the implementation just executes",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs);
  s.addNotes("This is the category the rest of the deck lives in — a discipline, not a specific tool, though we're going to walk it through GitHub's spec-kit implementation of it. The core move is sequencing: nothing downstream gets written until everything upstream of it exists.");
}

// ── Slide 4 — The Pipeline: Five Core Commands (section break) ──────────────
{
  const s = newSectionSlide("The Pipeline: Five Core Commands", "constitution → specify → plan → tasks → implement");
  s.addNotes("Five commands, one direction, each one reading what the last one wrote.");
}

// ── Slide 5 — The Pipeline at a Glance (diagram) ─────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "The Pipeline at a Glance");
  addDivider(s);

  const steps = [
    "specify init\n(scaffolding)",
    "/speckit-\nconstitution\nconstitution.md",
    "/speckit-\nspecify\nspec.md",
    "/speckit-plan\nplan.md, research.md,\ndata-model.md, contracts/",
    "/speckit-tasks\ntasks.md",
    "/speckit-\nimplement\nworking code",
  ];
  const diagramH = 2.3;
  addFlowDiagram(s, steps, PAD, CONTENT_Y, W - PAD * 2, diagramH);

  const bullets = [
    "One direction only — plan can't contradict constitution, tasks can't invent scope the spec didn't authorize",
    "Each arrow is a real file dependency, not just a suggested order",
    "By the time /speckit-implement runs, every decision has already been made and written down upstream",
  ];
  const bulY = CONTENT_Y + diagramH + 0.25;
  const bulH = SAFE_BOT - bulY;
  addBulletsDistributed(s, bullets, PAD, bulY, W - PAD * 2, bulH, 18);
  s.addNotes("`specify init` is step zero — it scaffolds the machinery (a memory directory, per-command skill files) and writes zero actual content: no spec, no code, just the harness the rest of the pipeline runs inside. Everything after that is one of the five core commands, each command reading what the previous one wrote before it writes anything of its own.");
}

// ── Slide 6 — /speckit-constitution ──────────────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "/speckit-constitution — Why, First and Non-Negotiable");
  addDivider(s);
  const bullets = [
    "Reads: nothing — this is the first command run, typically against a near-empty repo",
    "Writes: constitution.md — the project's non-negotiable principles",
    "Example principles: Simplicity First (smallest implementation that satisfies the spec), Testable Requirements (every requirement can pass or fail), Illustrative Not Production (in-memory storage is fine — this is a teaching example)",
    "Why it exists: it's the fixed point everything downstream is checked against",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs);
  s.addNotes("This is the one document nothing else in the pipeline is allowed to contradict — every later command checks its output against this file before doing anything else. On a real project the principles are yours to set; here's a plausible, unglamorous set for a small demo feature.");
}

// ── Slide 7 — /speckit-specify ───────────────────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "/speckit-specify — What, in Testable Language");
  addDivider(s);
  const bullets = [
    "Reads: constitution.md",
    "Writes: spec.md — user stories (each with priority P1/P2/P3 and an Independent Test), FR-### functional requirements, SC-### success criteria",
    "Why: forces the \"what\" into testable, numbered language before anyone touches \"how\"",
    "FR-### IDs get assigned the instant a requirement is written — that ID reappears in the plan, the tasks, and eventually a code comment",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs);
  s.addNotes("This is where requirements get numbered the moment they're written — not retrofitted later for a postmortem, assigned live as the spec is drafted. No framework names, no schema, no implementation language allowed in this artifact at all.");
}

// ── Slide 8 — /speckit-plan ───────────────────────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "/speckit-plan — How, Gated by the Constitution");
  addDivider(s);
  const bullets = [
    "Reads: spec.md, constitution.md",
    "Writes: plan.md (Constitution Check table — every principle gets a PASS/FAIL verdict), research.md (Decision / Rationale / Alternatives), data-model.md, contracts/",
    "Why: this is where \"how\" gets decided — and justified, in writing, before a line of code exists",
    "Technology choices get made once, here, not improvised per-route later",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs);
  s.addNotes("This is the only command with a hard gate — the design gets checked against the constitution before research starts, and again after. If a plan fails that check, it gets revised before it's allowed to become tasks, not after code has already been written against it.");
}

// ── Slide 9 — /speckit-tasks ───────────────────────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "/speckit-tasks — Order, Dependency-Mapped");
  addDivider(s);
  const bullets = [
    "Reads: plan.md, spec.md",
    "Writes: tasks.md — phased (Setup, Foundational, one phase per user story, Polish), dependency-ordered checklist",
    "[P] marks tasks that are parallelizable; [US1] / [US2] labels tie every task back to the story it satisfies",
    "Why: turns \"how\" into an explicit, ordered execution plan an agent — or a human — can just follow top to bottom",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs);
  s.addNotes("This is the last artifact before code — a literal checklist, not a vague plan of attack. Every task is tagged with the user story it belongs to, so you can always answer \"why does this task exist\" by pointing at a US# and, behind it, an FR-###.");
}

// ── Slide 10 — /speckit-implement ─────────────────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "/speckit-implement — Execute, Top to Bottom");
  addDivider(s);
  const bullets = [
    "Reads: tasks.md (and everything upstream, by reference)",
    "Writes: the actual source code",
    "Executes tasks.md phase by phase, checking off each box — [ ] becomes [X] — as it completes it, from a passing check right now",
    "Why it's boring on purpose: every naming decision, every error shape, every technology choice was already made and written down before this command ever ran",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs);
  s.addNotes("By design, this is the least interesting command in the pipeline to talk about — and that's the entire point. All the hard thinking already happened in the four commands before it; this one just works the checklist.");
}

// ── Slide 11 — Traceability: IDs That Don't Die at Handoff (two-column) ──────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Traceability: IDs That Don't Die at Handoff");
  addDivider(s);

  const chain =
`spec.md -> plan.md -> tasks.md -> src/

US1, FR-001, SC-001
  -> data-model.md refs FR-001
  -> T003 [US1] in tasks.md
  -> // FR-001: ... (real code
     comment, not added after)`;

  const grep =
`grep -rn "FR-" src/
# -> every requirement ID sitting
#    in a code comment at the
#    exact line that satisfies it`;

  addTwoColumn(s,
    (s, x, y, w, h) => {
      const lines  = chain.split("\n").length;
      const maxLen = Math.max(...chain.split("\n").map(l => l.length));
      const fsV = Math.floor(72 * (h - 0.3) / (lines * 1.5));
      const fsH = Math.floor(72 * (w - 0.4) / (maxLen * 0.55));
      const fs  = Math.max(9, Math.min(14, Math.min(fsV, fsH)));
      addCodeBlock(s, chain, x, y, w, h, fs);
    },
    (s, x, y, w, h) => {
      const gH = 1.6;
      const gLines  = grep.split("\n").length;
      const maxLen  = Math.max(...grep.split("\n").map(l => l.length));
      const fsV = Math.floor(72 * (gH - 0.3) / (gLines * 1.5));
      const fsH = Math.floor(72 * (w - 0.4) / (maxLen * 0.55));
      const gfs = Math.max(9, Math.min(14, Math.min(fsV, fsH)));
      addCodeBlock(s, grep, x, y, w, gH, gfs);

      const bullets = [
        "FR-### and SC-### are born in spec.md; US# tags a user story; T### tags a task",
        "Every ID threads spec → plan → tasks → a literal code comment at the line that satisfies it",
        "Concretely, once implementation is done: this grep is the cheapest possible demo of \"the code traces back to a decision\" — real output, not a diagram",
      ];
      const bY = y + gH + 0.2;
      const bH = h - gH - 0.2;
      addBulletsDistributed(s, bullets, x, bY, w, bH, 16);
    }
  );
  s.addNotes("This is the throughline that makes every earlier slide more than paperwork. The IDs aren't assigned retroactively for documentation's sake — they're assigned the moment a requirement or task is written, and they ride all the way down into the implementation.");
}

// ── Slide 12 — Key Insight (callout) ─────────────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Key Insight");
  addDivider(s);
  addCalloutBox(s, [
    "The traceability IDs are the load-bearing wall.",
    "Constitution, spec, plan, and tasks are scaffolding built to make sure an FR-### number means the same thing in the requirement, the design, the checklist, and the code.",
  ], PAD, CONTENT_Y + 0.5, W - PAD * 2, CONTENT_H - 1.0, { fontSize: 22 });
  s.addNotes("If your team remembers one thing about spec-driven development, make it this — everything else in the pipeline exists to make sure these IDs mean something by the time they hit a code comment.");
}

// ── Slide 13 — Optional Rigor & Team Scale (section break) ──────────────────
{
  const s = newSectionSlide("Optional Rigor & Team Scale", "Five more commands, and what happens past one person");
  s.addNotes("Everything so far is the required backbone. What follows is optional rigor for a solo pass, and load-bearing once more than one person is involved.");
}

// ── Slide 14 — Five Enhancement Commands, One Line Each (table) ─────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Five Enhancement Commands, One Line Each");
  addDivider(s);

  const rows = [
    "/speckit-clarify",
    "/speckit-checklist",
    "/speckit-analyze",
    "/speckit-converge",
    "/speckit-taskstoissues",
  ];
  const purposes = [
    "Asks up to five targeted questions and writes the answers directly back into spec.md — part of the permanent record",
    "A unit test for the spec's writing: checks for unquantified terms before ambiguity becomes a coding decision made under pressure",
    "Read-only; cross-checks spec, plan, and tasks against each other and against the constitution before any code exists",
    "Compares what spec/plan/tasks call for against what the code actually does right now, and appends a task if it finds drift",
    "Exports tasks.md into tracked issues for teams that live in an issue tracker rather than a checklist file",
  ];

  const tableRows = [[headerCell("Command", 3.0), headerCell("Purpose", 8.33)]];
  rows.forEach((cmd, i) => {
    tableRows.push([bodyCell(cmd, i % 2 === 0), bodyCell(purposes[i], i % 2 === 0)]);
  });

  const rowH = CONTENT_H / tableRows.length;
  s.addTable(tableRows, {
    x: PAD, y: CONTENT_Y, w: W - PAD * 2, colW: [3.0, 8.33],
    rowH, autoPage: false,
  });
  s.addNotes("None of these are required for a solo, single-session build like the one you're about to watch — but each one earns its keep the moment a team, a deadline, or an ambiguous spec is in the picture.");
}

// ── Slide 15 — Teaser: This Doesn't Stay Solo ────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Teaser: This Doesn't Stay Solo");
  addDivider(s);
  const bullets = [
    "Everything up to this slide assumes one person, one branch, one pass through the pipeline",
    "At team scale: concurrent branches each running their own spec-kit pipeline, a constitution amendment rippling into specs already in flight, real merge conflicts — in plan.md and tasks.md, not just source code",
    "Not covered in depth here — that's a separate repo, speckit-complex-demo: three contributors, concurrent branches, a mid-project constitution amendment, two real merge conflicts",
    "Today's demo is the on-ramp version — worth running once solo before you watch the team-scale one",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs);
  s.addNotes("Deliberately brief — this is a name-drop, not a walkthrough. The live demo you're about to watch is the single-person, single-branch version of this process; it's worth seeing once before you see what changes when a team runs it in parallel.");
}

// ── Slide 16 — When to Use / When Not to Use (two-column) ───────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "When to Use / When Not to Use");
  addDivider(s);

  addTwoColumn(s,
    (s, x, y, w, h) => {
      s.addText("When to Use", {
        x, y, w, h: 0.5, fontSize: 22, bold: true,
        fontFace: fontP.title, color: T.accentLight,
      });
      const bullets = [
        "Production features with real stakeholders",
        "Cross-team surfaces where naming and contracts matter",
        "Anything you'll have to explain to someone else in six months",
        "Features where \"why did we do it this way\" will get asked in a postmortem — or an interview",
      ];
      addBulletsDistributed(s, bullets, x, y + 0.65, w, h - 0.65, 18);
    },
    (s, x, y, w, h) => {
      s.addText("When Not To", {
        x, y, w, h: 0.5, fontSize: 22, bold: true,
        fontFace: fontP.title, color: T.muted,
      });
      const bullets = [
        "True throwaway prototypes and spikes",
        "Single-file scripts nobody else will ever touch",
        "Exploratory work where you genuinely don't know yet if you're keeping it",
        "Situations where the ceremony costs more than the wrong shortcut would",
      ];
      addBulletsDistributed(s, bullets, x, y + 0.65, w, h - 0.65, 18);
    }
  );
  s.addNotes("The trade-off isn't \"always spec-driven\" — it's matching the ceremony to the stakes. A one-off spike doesn't need a constitution; a feature that will get asked about in a postmortem does.");
}

// ── Slide 17 — Spec-Driven Dev vs. Vibe-Coding (table) ───────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Spec-Driven Dev vs. Vibe-Coding");
  addDivider(s);

  const data = [
    ["Decision record", "None", "constitution.md, research.md"],
    ["Requirement traceability", "None", "FR-###/SC-###/US#/T### → code comment"],
    ["Time to first working code", "Fastest", "Slower up front"],
    ["Consistency across the codebase", "Depends entirely on the prompt", "Enforced by the constitution gate"],
    ["Auditability six weeks later", "Approximately none", "Every decision has a written rationale"],
  ];
  const colW = [2.8, 4.6, 4.93];
  const tableRows = [[
    headerCell("Dimension"), headerCell("Vibe-Coding"), headerCell("Spec-Driven Development"),
  ]];
  data.forEach((row, i) => {
    tableRows.push(row.map(c => bodyCell(c, i % 2 === 0)));
  });

  const rowH = CONTENT_H / tableRows.length;
  s.addTable(tableRows, {
    x: PAD, y: CONTENT_Y, w: W - PAD * 2, colW,
    rowH, autoPage: false,
  });
  s.addNotes("This is exactly what a sibling reference repo, speckit-demo, shows side-by-side — a vibe-coded/ folder and a spec-driven/ folder for the same feature, built both ways, so you can diff them directly instead of taking this table's word for it.");
}

// ── Slide 18 — Real-World Analogies ──────────────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Real-World Analogies");
  addDivider(s);
  const bullets = [
    "A building's code (fire code, load limits) is the constitution — nobody argues with it mid-construction, the whole design is drawn to satisfy it first",
    "A negotiated contract's terms are the spec — everyone agreed to them, in writing, before anyone signed",
    "An assembly line's work-instruction sheet is tasks.md — order and dependencies already resolved before anyone picks up a tool",
  ];
  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, CONTENT_H, fs);
  s.addNotes("These map cleanly onto the four artifacts and are worth having in your back pocket the next time someone asks why this is worth the extra ceremony.");
}

// ── Slide 19 — Summary: Three Takeaways (callout) ────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Summary: Three Takeaways");
  addDivider(s);
  addCalloutBox(s, [
    "1. Decide once, in writing, before you type a single line of code — why, what, how, and order each gate the next",
    "2. Traceability IDs aren't documentation-as-an-afterthought — they're a literal, greppable line in the code that closes the loop back to a requirement",
    "3. Solo usage is the on-ramp — team-scale usage (concurrent branches, mid-project constitution amendments, real merge conflicts) is what speckit-complex-demo covers next",
  ], PAD, CONTENT_Y + 0.3, W - PAD * 2, CONTENT_H - 0.6, { fontSize: 19 });
  s.addNotes("If you only keep three things from this deck before we go type commands for real, make it these.");
}

// ── Slide 20 — Live Demo: The Numbers (stats) ────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Live Demo: The Numbers");
  addDivider(s);

  const stats = [
    { value: "~40 min", label: "Full pipeline, comfortable pace, incl. optional steps" },
    { value: "~25 min", label: "Required-only fast path (init → constitution → specify → plan → tasks → implement)" },
    { value: "4", label: "Optional commands on top (clarify, checklist, analyze, converge)" },
    { value: "1 / 2", label: "Entity / endpoints — the entire scope of the demo feature" },
  ];
  const n = stats.length;
  const cardW = (W - PAD * 2 - (n - 1) * 0.3) / n;
  const cardH = 2.8;
  const cardY = CONTENT_Y + (CONTENT_H - cardH) / 2;
  stats.forEach((st, i) => {
    addStatCard(s, st.value, st.label, PAD + i * (cardW + 0.3), cardY, cardW, cardH);
  });
  s.addNotes("These are real timing estimates from the facilitation guide for this exact workshop, not invented figures — they're what you should expect to see over the next stretch of the session.");
}

// ── Slide 21 — Up Next: Live Demo ────────────────────────────────────────────
{
  const s = newSlide();
  addBadge(s, BADGE);
  addTitle(s, "Up Next: Live Demo");
  addDivider(s);

  const bullets = [
    "Feature: URL shortener — long URL in, short code back; visiting it redirects. In-memory only, no auth or analytics for v1.",
    "Starting point: this repo, intentionally almost empty — a starting line, not a finished demo",
    "Reference repos: speckit-demo (vibe vs. spec-driven, side-by-side), speckit-complex-demo (team scale, merge conflicts)",
    "Payoff moment: a live curl against the running service — proof the checked boxes in tasks.md are real",
  ];

  const code =
`specify init
/speckit-constitution
/speckit-specify
/speckit-plan
/speckit-tasks
/speckit-implement`;
  const codeLines = code.split("\n").length;
  const codeFs = 14;
  const codeH = Math.max(1.5, codeLines * 1.5 * codeFs / 72 + 0.3);
  const gap = 0.15;
  const bulH = CONTENT_H - codeH - gap;

  const fs = Math.max(22, Math.floor(28 - bullets.length * 1.5));
  addBulletsDistributed(s, bullets, PAD, CONTENT_Y, W - PAD * 2, bulH, fs);
  addCodeBlock(s, code, PAD, CONTENT_Y + bulH + gap, W - PAD * 2, codeH, codeFs);
  s.addNotes("This is the handoff slide — everything from here happens live, in a terminal, from an empty repo. The feature is deliberately small: one entity, two endpoints, so the process is the star of the demo, not the feature itself.");
}

pptx
  .writeFile({ fileName: path.join(__dirname, "SpecDrivenDevelopment.pptx") })
  .then(() => console.log("✓  SpecDrivenDevelopment.pptx written to", __dirname))
  .catch((err) => { console.error(err); process.exit(1); });
