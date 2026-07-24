---
title: Spec-Driven Development with GitHub Spec-Kit — A Conceptual Primer
category: Conceptual / Engineering Process
categoryBadge: SPEC-DRIVEN DEV
tagline: Decide once, in writing, before you type a single line of code.
accentHex: 00b4cc
paletteName: Cyan Matrix (dark theme, near-black teal background, electric cyan accent, aqua code highlights)
fontPersonality: technical (Arial titles + Consolas code)
presentationType: design-pattern
audience: team-knowledge-share
depth: high-level
---

## Slide 1 — Spec-Driven Development with GitHub Spec-Kit
**Layout:** default
**Visual:** Title card — topic name large and centered, category badge "SPEC-DRIVEN DEV" pinned top-right, tagline beneath the title in the accent cyan.
**Speaker notes:** This is the conceptual primer that runs immediately before a live terminal demo. Nothing here is abstract theory disconnected from practice — every command named in this deck is about to be typed for real, from an empty repo, right after this.
- Spec-Driven Development with GitHub Spec-Kit: A Conceptual Primer
- Category: Conceptual / Engineering Process
- "Decide once, in writing, before you type a single line of code."
- Up next after this deck: a live build of a URL shortener, from zero

## Slide 2 — The Problem: What Vibe-Coding Produces
**Layout:** default
**Visual:** Full-width bullet list, muted red/orange accent on the pain-point bullets to contrast with the deck's cyan.
**Speaker notes:** Frame this as a fair description of how most of us build things day to day, not a strawman. One-shot prompting works, and it's fast — the point isn't that it's wrong, it's that it's silent about its own decisions.
- One-shot prompting: describe a feature in a sentence or two, get a working app back
- Implicit decisions get baked in with no record of them — naming conventions, error shapes, edge-case handling, all decided invisibly, inside a single generation pass
- Inconsistent naming and error shapes across a codebase, because there was never one upstream decision they both trace back to
- No paper trail: ask "why is it built this way" six weeks later, and nobody — including the original author — can answer with anything but a guess

## Slide 3 — What Is Spec-Driven Development?
**Layout:** default
**Visual:** One-liner definition banner at top, four-item list below mapping question to artifact.
**Speaker notes:** This is the category the rest of the deck lives in — a discipline, not a specific tool, though we're going to walk it through GitHub's spec-kit implementation of it. The core move is sequencing: nothing downstream gets written until everything upstream of it exists.
- One-liner: a discipline that separates *why*, *what*, *how*, and *order* into distinct, written artifacts — all produced before any implementation code exists
- Why → constitution: the non-negotiable principles
- What → spec: the requirements and user stories, in testable language
- How → plan: the technical design, gated against the constitution
- Order → tasks: a dependency-ordered checklist the implementation just executes

## Slide 4 — The Pipeline: Five Core Commands
**Layout:** section-break
**Visual:** Large centered section title, subtitle "constitution → specify → plan → tasks → implement"
**Speaker notes:** Five commands, one direction, each one reading what the last one wrote.

## Slide 5 — The Pipeline at a Glance
**Layout:** diagram
**Visual:** Horizontal pipeline diagram — six boxes left to right, arrows between each, artifact name labeled under every box.
```
[specify init]  →  /speckit-constitution  →  /speckit-specify  →  /speckit-plan  →  /speckit-tasks  →  /speckit-implement
  (scaffolding,        constitution.md          spec.md          plan.md +          tasks.md            working code
   zero content)                                                 research.md,
                                                                  data-model.md,
                                                                  contracts/
```
**Speaker notes:** `specify init` is step zero — it scaffolds the machinery (a memory directory, per-command skill files) and writes zero actual content: no spec, no code, just the harness the rest of the pipeline runs inside. Everything after that is one of the five core commands, each command reading what the previous one wrote before it writes anything of its own.
- One direction only — plan can't contradict constitution, tasks can't invent scope the spec didn't authorize
- Each arrow is a real file dependency, not just a suggested order
- By the time `/speckit-implement` runs, every decision has already been made and written down somewhere upstream

## Slide 6 — /speckit-constitution — Why, First and Non-Negotiable
**Layout:** default
**Visual:** Bullet list with a small "reads / writes" label pair at top.
**Speaker notes:** This is the one document nothing else in the pipeline is allowed to contradict — every later command checks its output against this file before doing anything else. On a real project the principles are yours to set; here's a plausible, unglamorous set for a small demo feature.
- Reads: nothing — this is the first command run, typically against a near-empty repo
- Writes: `constitution.md` — the project's non-negotiable principles
- Example principles for a small feature: **Simplicity First** (smallest implementation that satisfies the spec, no speculative abstraction), **Testable Requirements** (every requirement can pass or fail, not "should probably"), **Illustrative Not Production** (in-memory storage is fine, this is a teaching example, not a shipped service)
- Why it exists: it's the fixed point everything downstream is checked against

## Slide 7 — /speckit-specify — What, in Testable Language
**Layout:** default
**Visual:** Bullet list with a small "reads / writes" label pair at top.
**Speaker notes:** This is where requirements get numbered the moment they're written — not retrofitted later for a postmortem, assigned live as the spec is drafted. No framework names, no schema, no implementation language allowed in this artifact at all.
- Reads: `constitution.md`
- Writes: `spec.md` — user stories (each with a priority, P1/P2/P3, and an Independent Test: "would this story alone still be useful if shipped by itself?"), FR-### functional requirements, SC-### success criteria
- Why: forces the "what" into testable, numbered language before anyone touches "how"
- FR-### IDs get assigned the instant a requirement is written — that ID is going to reappear in the plan, the tasks, and eventually a code comment

## Slide 8 — /speckit-plan — How, Gated by the Constitution
**Layout:** default
**Visual:** Bullet list with a small "reads / writes" label pair at top.
**Speaker notes:** This is the only command with a hard gate — the design gets checked against the constitution before research starts, and again after. If a plan fails that check, it gets revised before it's allowed to become tasks, not after code has already been written against it.
- Reads: `spec.md`, `constitution.md`
- Writes: `plan.md` (with a **Constitution Check** table — every principle gets a PASS/FAIL verdict), `research.md` (Decision / Rationale / Alternatives considered, per technical choice — e.g., short-code generation: random string vs. incrementing counter vs. hash), `data-model.md`, `contracts/`
- Why: this is where "how" gets decided — and justified, in writing, before a line of code exists
- Technology choices get made once, here, not improvised per-route later

## Slide 9 — /speckit-tasks — Order, Dependency-Mapped
**Layout:** default
**Visual:** Bullet list with a small "reads / writes" label pair at top.
**Speaker notes:** This is the last artifact before code — a literal checklist, not a vague plan of attack. Every task is tagged with the user story it belongs to, so you can always answer "why does this task exist" by pointing at a US# and, behind it, an FR-###.
- Reads: `plan.md`, `spec.md`
- Writes: `tasks.md` — phased (Setup, Foundational/blocking, one phase per user story, Polish), dependency-ordered checklist
- `[P]` marks tasks that are parallelizable; `[US1]` / `[US2]` labels tie every task back to the story it satisfies
- Why: turns "how" into an explicit, ordered execution plan an agent — or a human — can just follow top to bottom

## Slide 10 — /speckit-implement — Execute, Top to Bottom
**Layout:** default
**Visual:** Bullet list with a small "reads / writes" label pair at top.
**Speaker notes:** By design, this is the least interesting command in the pipeline to talk about — and that's the entire point. All the hard thinking already happened in the four commands before it; this one just works the checklist.
- Reads: `tasks.md` (and everything upstream, by reference)
- Writes: the actual source code
- Executes `tasks.md` phase by phase, checking off each box — `[ ]` becomes `[X]` — as it completes it, not from memory, from a passing check right now
- Why it's boring on purpose: every naming decision, every error shape, every technology choice was already made and written down before this command ever ran

## Slide 11 — Traceability: IDs That Don't Die at Handoff
**Layout:** two-column
**Visual:** Left column — the ID-flow chain from requirement to code comment. Right column — annotated bullets and the real grep proof.
```
spec.md            plan.md / tasks.md          src/
US1, FR-001,   →    data-model.md refs      →   // FR-001: ...
SC-001              FR-001; T003 [US1]          (a real line, not a comment
                                                  written after the fact)
```
```bash
grep -rn "FR-" src/
# → every requirement ID sitting in a code comment
#   at the exact line that satisfies it
```
**Speaker notes:** This is the throughline that makes every earlier slide more than paperwork. The IDs aren't assigned retroactively for documentation's sake — they're assigned the moment a requirement or task is written, and they ride all the way down into the implementation.
- FR-### and SC-### are born in `spec.md`; US# tags a user story; T### tags a task in `tasks.md`
- Every ID threads spec → plan → tasks → a literal code comment at the line that satisfies it
- Concretely, once implementation is done: `grep -rn "FR-" src/` — that's the cheapest possible demo of "the code traces back to a decision," and it's real output, not a diagram

## Slide 12 — Key Insight
**Layout:** callout
**Visual:** Single bold statement, centered, large type.
**Speaker notes:** If your team remembers one thing about spec-driven development, make it this — everything else in the pipeline exists to make sure these IDs mean something by the time they hit a code comment.
- The traceability IDs are the load-bearing wall. Constitution, spec, plan, and tasks are scaffolding built to make sure an FR-### number means the same thing in the requirement, the design, the checklist, and the code.

## Slide 13 — Optional Rigor & Team Scale
**Layout:** section-break
**Visual:** Large centered section title, subtitle "Five more commands, and what happens past one person"
**Speaker notes:** Everything so far is the required backbone. What follows is optional rigor for a solo pass, and load-bearing once more than one person is involved.

## Slide 14 — Five Enhancement Commands, One Line Each
**Layout:** default
**Visual:** Table — command name, one-line purpose.
**Speaker notes:** None of these are required for a solo, single-session build like the one you're about to watch — but each one earns its keep the moment a team, a deadline, or an ambiguous spec is in the picture.
- `/speckit-clarify` — asks up to five targeted questions and writes the answers directly back into `spec.md`, so the resolution is part of the permanent record, not a Slack thread nobody can find later
- `/speckit-checklist` — a unit test for the spec's *writing*, not the code: checks things like "is `short code` ever quantified — letters-only? a length?" before ambiguity becomes a coding decision made under pressure
- `/speckit-analyze` — read-only; cross-checks spec, plan, and tasks against each other and against the constitution before any code exists
- `/speckit-converge` — compares what the spec/plan/tasks call for against what the code *actually does right now* — current state, not git history, not memory — and appends a new task if it finds drift
- `/speckit-taskstoissues` — exports `tasks.md` into tracked issues for teams that live in an issue tracker rather than a checklist file

## Slide 15 — Teaser: This Doesn't Stay Solo
**Layout:** default
**Visual:** Full-width bullet list.
**Speaker notes:** Deliberately brief — this is a name-drop, not a walkthrough. The live demo you're about to watch is the single-person, single-branch version of this process; it's worth seeing once before you see what changes when a team runs it in parallel.
- Everything up to this slide assumes one person, one branch, one pass through the pipeline
- At team scale: concurrent branches each running their own spec-kit pipeline, a constitution amendment landing mid-project that ripples into specs already in flight, real merge conflicts — in `plan.md` and `tasks.md`, not just source code
- Not covered in depth here — that's a separate repo, `speckit-complex-demo`: three contributors, concurrent branches, a constitution amendment mid-project, and two real merge conflicts
- Today's demo is the on-ramp version — worth running once solo before you watch the team-scale one

## Slide 16 — When to Use / When Not to Use
**Layout:** two-column
**Visual:** Left column: "When to Use." Right column: "When Not To."
**Speaker notes:** The trade-off isn't "always spec-driven" — it's matching the ceremony to the stakes. A one-off spike doesn't need a constitution; a feature that will get asked about in a postmortem does.
- **When to use it:** production features with real stakeholders; cross-team surfaces where naming and contracts matter; anything you'll have to explain to someone else in six months; features where "why did we do it this way" will get asked in a postmortem — or an interview
- **When not to use it:** true throwaway prototypes and spikes; single-file scripts nobody else will ever touch; exploratory work where you genuinely don't know yet if you're keeping it; situations where the ceremony costs more than the wrong shortcut would

## Slide 17 — Spec-Driven Dev vs. Vibe-Coding
**Layout:** default
**Visual:** Comparison table, five rows.
**Speaker notes:** This is exactly what a sibling reference repo, `speckit-demo`, shows side-by-side — a `vibe-coded/` folder and a `spec-driven/` folder for the same feature, built both ways, so you can diff them directly instead of taking this table's word for it.
| Dimension | Vibe-Coding (one-shot prompting) | Spec-Driven Development |
|---|---|---|
| Decision record | None | `constitution.md`, `research.md` |
| Requirement traceability | None | FR-###/SC-###/US#/T### → code comment |
| Time to first working code | Fastest | Slower up front |
| Consistency across the codebase | Depends entirely on the prompt | Enforced by the constitution gate |
| Auditability six weeks later | Approximately none | Every decision has a written rationale |

## Slide 18 — Real-World Analogies
**Layout:** default
**Visual:** Three short analogy blocks, full width.
**Speaker notes:** These map cleanly onto the four artifacts and are worth having in your back pocket the next time someone asks why this is worth the extra ceremony.
- A building's **code** (fire code, load limits) is the constitution — nobody argues with it mid-construction, the whole design is drawn to satisfy it first
- A negotiated **contract's terms** are the spec — everyone agreed to them, in writing, before anyone signed
- An assembly line's **work-instruction sheet** is `tasks.md` — order and dependencies already resolved before anyone picks up a tool

## Slide 19 — Summary: Three Takeaways
**Layout:** callout
**Visual:** Three numbered statements, large centered type.
**Speaker notes:** If you only keep three things from this deck before we go type commands for real, make it these.
- 1. Decide once, in writing, before you type a single line of code — why, what, how, and order each gate the next
- 2. Traceability IDs aren't documentation-as-an-afterthought — they're a literal, greppable line in the code that closes the loop back to a requirement
- 3. Solo usage is the on-ramp — team-scale usage (concurrent branches, mid-project constitution amendments, real merge conflicts) is what `speckit-complex-demo` covers next

## Slide 20 — Live Demo: The Numbers
**Layout:** stats
**Visual:** Four large stat blocks.
**Speaker notes:** These are real figures from the facilitation guide for this exact workshop, not invented — they're what you should expect to see over the next stretch of the session. No optional branches this time: six commands, each scripted with its exact arguments in advance, nothing left to decide live.
- ~35 min, start to finish — six commands, nothing optional
- 6 commands: `specify init` → constitution → specify → plan → tasks → implement
- 1 entity, 2 endpoints — the entire scope of the demo feature
- 0 live decisions — every command and its exact arguments scripted in advance

## Slide 21 — Up Next: Live Demo
**Layout:** default
**Visual:** Full-width bullet list with the command sequence as a terminal block at the bottom.
**Speaker notes:** This is the handoff slide — everything from here happens live, in a terminal, from an empty repo. The feature is deliberately small: one entity, two endpoints, so the process is the star of the demo, not the feature itself.
- Feature: a URL shortener — submit a long URL, get a short code back; visiting the short code redirects to the original. In-memory storage, no auth, no analytics, no link expiration for v1
- Starting point: this repo, intentionally almost empty — a starting line, not a finished demo
- Reference repos for later, self-guided study: `speckit-demo` (one feature, vibe-coded vs. spec-driven, side-by-side) and `speckit-complex-demo` (team scale, concurrent branches, constitution amendments, real merge conflicts)
- The payoff moment at the end: a live `curl` against the running service, proving the checked boxes in `tasks.md` are real, not decorative
```bash
specify init
/speckit-constitution
/speckit-specify
/speckit-plan
/speckit-tasks
/speckit-implement
```
