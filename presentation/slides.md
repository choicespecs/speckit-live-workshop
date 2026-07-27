---
accentColor: "#1d6fbc"
paletteName: "Ocean Slate Light"
fontPersonality: professional
presentationType: design-pattern
audience: conference-meetup
depth: high-level
---

## Slide 1 — Spec-Driven Development with GitHub Spec-Kit
**Layout:** default
**Visual:** Title slide. Category badge "WORKFLOW" top-left. Title centered. Tagline beneath.
**Speaker notes:** Open with energy — this is a pattern talk, not a system-design talk. There's no running app to architect here; the URL shortener is just the example feature name that makes the six commands concrete.
- Category: Development Workflow / AI-Assisted Engineering
- Tagline: "Constitution to code: six commands, zero improvisation"
- Running example (illustrative only): a URL shortener — submit a long URL, get a short code back

---

## Slide 2 — The Problem: Prompt and Hope
**Layout:** default
**Visual:** Plain bullet list, no jargon yet
**Speaker notes:** Land the pain before naming the solution. Everyone in a conference room has felt this: an AI agent that produces something plausible-looking with no way to explain a single choice it made.
- You type one big prompt, the agent writes a feature, it runs — great, for about ten minutes
- Two weeks later: why is storage a global mutable object? Why is the code 8 characters, not 6? Nobody knows — there's no artifact, only chat scrollback
- Ask two different people to prompt the same agent for the same feature and you get two different implementations, with two different unwritten assumptions baked in
- The problem isn't the AI — it's that nothing was decided *before* the code, so nothing can be checked *after* it

---

## Slide 3 — What Spec-Driven Development Is
**Layout:** default
**Visual:** One-liner definition, then a 2-column table mapping each question (why/what/how/order) to its artifact
**Speaker notes:** Give the audience the one-sentence definition they'll repeat later, then walk the table top to bottom — this is the single clearest map of the whole pipeline onto four questions. Mention the skill mechanic briefly — it lands better once the pipeline is on screen.
- **Spec-Driven Development (SDD):** a discipline that separates why, what, how, and order into distinct, written artifacts — all produced before any implementation code exists

| Question | Artifact |
|---|---|
| Why | **constitution** — the non-negotiable principles |
| What | **spec** — the requirements and user stories, in testable language |
| How | **plan** — the technical design, gated against the constitution |
| Order | **tasks** — a dependency-ordered checklist the implementation just executes |

- GitHub Spec-Kit is one concrete implementation of this pattern: six slash-commands, run in a fixed order, one Claude Code skill per command

---

## Slide 4 — [The Pipeline]
**Layout:** section-break
**Visual:** Large centered section title "The Pipeline" with subtitle "Six commands, one direction"
**Speaker notes:** Transition into the mechanics — how the six commands actually chain together.

---

## Slide 5 — Six Commands, One Direction
**Layout:** diagram
**Visual:** Horizontal flow of the six commands with one annotated branch point
**Speaker notes:** Walk the pipeline left to right. The one thing worth pausing on: there is exactly one place a "go back and revise" branch can happen, and it's buried inside the plan step, not scattered everywhere.

```text
specify init --> /speckit-constitution --> /speckit-specify --> /speckit-plan --> /speckit-tasks --> /speckit-implement
                                                                       |
                                                            [Constitution Check: PASS/FAIL]
```
- `specify init` scaffolds a constitution *template* (full of `[BRACKET_PLACEHOLDER]` tokens) and a set of skills — writes zero feature content, pure setup
- Each command is a Claude Code skill: a `SKILL.md` file of plain-language instructions the agent follows — "a playbook, not a program"
- Only `/speckit-plan` has a hard gate; everything else just flows forward, file to file
- On this URL-shortener example, the whole sequence — constitution through a working `curl` call — runs in about 35 minutes, start to finish

---

## Slide 6 — specify init
**Layout:** default
**Visual:** Plain bullet list — the command itself as a one-line sample
**Speaker notes:** The first step is deliberately boring — it's worth saying out loud that nothing about the actual feature exists yet after this command runs.
- Reads: nothing — there's no prior artifact yet; this is the very first step
- Writes: a `.specify/` folder structure and a skill file for each of the six commands
- Also writes a constitution *template*, full of `[BRACKET_PLACEHOLDER]` tokens — not real principles yet
- Writes zero feature content — no spec, no plan, no code; pure scaffolding

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init --here --integration claude
```
- Why it exists: every other command in this pipeline assumes this folder structure and these skills are already in place

---

## Slide 7 — /speckit-constitution
**Layout:** two-column
**Visual:** Left: real excerpt from `constitution.md`. Right: what it reads, what it writes, and why it exists.
**Speaker notes:** This is the first command that writes real content. It reads nothing — there's nothing upstream of it — and everything downstream reads it first.

```text
### I. Simplicity & Legibility (NON-NEGOTIABLE)
Every artifact in this repository — constitution, spec, plan, tasks, and code — MUST be
readable in a single pass by someone who has never seen spec-kit before.

### IV. Traceability From Spec to Code
Every meaningful implementation decision in `spec-driven/` MUST be traceable back to a
line in `spec.md`, `plan.md`, or `tasks.md`. If code does something the specs don't
explain, either the code or the specs are wrong.
```
- Reads: nothing — it's the first content-bearing command in the pipeline
- Writes: `constitution.md` — the project's non-negotiable rules
- Why: every later command (spec, plan, tasks, implement) reads this exact file before doing anything else — it's the constraint every design gets checked against

---

## Slide 8 — What's a Principle vs. an Implementation Choice?
**Layout:** default
**Visual:** Plain bullet list contrasting a real principle with the real implementation choice that satisfies it
**Speaker notes:** The single clearest concept slide in this deck — worth slowing all the way down for, especially for anyone who's never opened a spec-kit repo before.
- A **PRINCIPLE** is a non-negotiable, project-wide rule that constrains every later decision — it doesn't say what to build, it says what's off-limits or required, no matter what gets built
- An **IMPLEMENTATION CHOICE** is a specific technical decision made later that must satisfy the principles — but isn't itself a principle
- Real contrast from this exact demo — constitution, Principle V: "**Minimal Dependencies** — use vanilla JavaScript with Express only."  ← the PRINCIPLE
- `plan.md`, Technical Context: "**Primary Dependencies**: Express 4.x... per constitution Principle V"  ← the IMPLEMENTATION CHOICE that satisfies it
- Notice the principle never says "Express" — it only rules out everything except "minimal." The plan is where "minimal" becomes one specific, named choice
- Rule of thumb: if the same rule could hold across ten totally different features, it's a principle; if it's the specific thing picked for *this* feature, it's an implementation choice

---

## Slide 9 — /speckit-specify
**Layout:** two-column
**Visual:** Left: real excerpt from `spec.md`. Right: what it reads, what it writes, and why it exists.
**Speaker notes:** Third command — the constitution constrains what a requirement is even allowed to look like before this one gets typed.

```text
### User Story 1 - Add a task and see it in the list (Priority: P1)
A user wants to capture something they need to do, then confirm it was recorded.
**Independent Test**: Can be fully tested by adding a task and then retrieving
the list, and confirming the new task appears with the description provided.
```
- Reads: `constitution.md` — every requirement has to fit inside those non-negotiables
- Writes: `spec.md` — prioritized user stories (P1/P2/P3), each with acceptance scenarios and an Independent Test
- Why: turns a one-line feature idea into a checkable, prioritized breakdown before anyone designs a single endpoint

---

## Slide 10 — /speckit-plan
**Layout:** two-column
**Visual:** Left: real excerpt from `plan.md`'s Constitution Check. Right: what it reads, what it writes, and why it exists.
**Speaker notes:** The one command in the pipeline with a hard gate — worth pausing on, since it's the single branch point in an otherwise straight line.

```text
## Constitution Check
- **I. Simplicity & Legibility**: PASS — four small files total, plain Express
  routing, no framework magic or generated boilerplate.
- **V. Minimal Dependencies**: PASS — `express` is the only runtime dependency;
  no test framework, no build step, no TypeScript.
```
- Reads: `spec.md` and `constitution.md`
- Writes: `plan.md`, plus supporting `research.md`, `data-model.md`, and `contracts/`
- Why: every principle gets graded PASS or FAIL against the actual design — once before research, once after — before anyone moves on to tasks

---

## Slide 11 — /speckit-tasks
**Layout:** two-column
**Visual:** Left: real excerpt from `tasks.md`. Right: what it reads, what it writes, and why it exists.
**Speaker notes:** Fifth command — turns a design into something an agent, or a human, can literally check off one box at a time.

```text
## Phase 1: Setup
- [X] T001 Create `spec-driven/` directory with a `src/` and `src/routes/` subfolder
- [X] T002 Initialize `spec-driven/package.json` with `express` as the only dependency
```
- Reads: `plan.md` and `spec.md`
- Writes: `tasks.md` — a phased, dependency-ordered checklist, grouped by user story
- Why: it's the difference between "we designed something" and "here is the exact order to build it in"

---

## Slide 12 — /speckit-implement
**Layout:** default
**Visual:** Plain bullet list — the checkbox-flip idea as the "sample"
**Speaker notes:** Last command, and mechanically the simplest — by the time this runs, almost every real decision was already made upstream.
- Reads: `tasks.md` — and everything upstream by reference, since every task traces back to the plan, spec, and constitution
- Writes: the actual source code — the only command in this pipeline that produces working software
- Executes `tasks.md` phase by phase, flipping each box from `[ ]` to `[X]` as the task completes
- Why: there's almost nothing left to improvise at this point — every earlier command already decided what to build and why
- The real generated code from this exact run lives in `~/speckit-demo/spec-driven/`, if you want to look afterward

---

## Slide 13 — Key Concept: The Traceability Spine
**Layout:** two-column
**Visual:** Left: one real requirement ID (FR-001) traced through three real files from `~/speckit-demo`'s actual generated Task List API. Right: what that proves and why it matters.
**Speaker notes:** This is the payoff concept — the thing that turns "we wrote some docs" into "we can prove the code matches the docs." Walk this as one concrete story, not four abstract bullet points: one requirement, born in one file, ends up as one comment sitting directly above the code that satisfies it. This is real content from a real generated repo, not a hypothetical.

```text
spec.md
FR-001: System MUST allow a user to
add a new task with a non-empty
description.

tasks.md
T006 [US1] POST /tasks: reject 400
when description is missing/empty
(FR-001, FR-006)

routes/tasks.js
// FR-001, FR-002, FR-006
router.post('/', (req, res) => {
  if (!description.trim())
    return res.status(400)...
```
- `FR-001` is born in `spec.md` as one plain-English rule — nothing about HTTP or JavaScript yet
- `tasks.md` turns it into an actual build step, still citing `FR-001` by name
- The generated code carries the same `FR-001` as a comment, directly above the `if` statement that enforces it
- Follow the ID and you can point at the exact line of running code that a one-sentence requirement turned into

---

## Slide 14 — Why This Matters: Closing the Loop
**Layout:** callout
**Visual:** Explicit callback to the opening problem, then the resolution, then the concrete payoff
**Speaker notes:** This slide only lands if the audience remembers the opening problem — say it out loud again before revealing the punchline. This is the moment the whole talk has been building to: the opening complaint about vibe-coding gets an actual mechanical answer, not just a process that feels more organized.

> Remember the opening problem with vibe-coding: nobody can check *why* the code is built a certain way, because nothing was written down to check it against.
>
> An `FR-###` ID is how SDD closes that exact gap. It isn't documentation — documentation can be wrong, stale, or unread, and nobody notices. It's a **promise**: a claim specific enough that `grep -rn "FR-" src/` either finds it satisfied in the code, or it doesn't. There's no third answer, and no one has to trust anyone's memory.
>
> Concretely: `FR-001` promised "a non-empty description is required." The check enforcing that sits right under the `// FR-001` comment in `routes/tasks.js` — so the promise isn't just made, it's verifiable, by anyone, at any time, with one command.

---

## Slide 15 — Spec-Driven Development vs. Vibe-Coding
**Layout:** default
**Visual:** Comparison table
**Speaker notes:** Vibe-coding — prompt an AI once and hope — isn't a strawman, it's the default most people are already doing. This table is the honest trade-off, not a case for SDD always winning.

| Dimension | Vibe-Coding | Spec-Driven Development |
|---|---|---|
| Speed to first line of code | Fastest — one prompt | Slower — four artifacts come first |
| Traceability | None — decisions live in chat scrollback | Every requirement carries an `FR-###` ID into the code |
| Team scale | Breaks down fast — every session reinvents assumptions | Shared constitution + spec are the source of truth |
| Revisability | Re-prompt and hope it's consistent this time | Amend the constitution, re-run the plan's gate |
| Best for | Spikes, exploration, throwaway scripts | Long-lived features, multi-person or multi-session work |

---

## Slide 16 — Five Enhancement Commands, One Line Each
**Layout:** default
**Visual:** Two-column table — command name, one-line purpose
**Speaker notes:** None of these five are needed for a single solo pass like the one this talk has walked through — they're optional rigor that earns its keep once a team, a deadline, or an ambiguous spec is in the picture. Say that plainly so the audience doesn't think they missed something required.
- Beyond the six required commands, spec-kit ships five optional enhancement commands

| Command | Purpose |
|---|---|
| `/speckit-clarify` | Asks up to five targeted questions and writes the answers directly back into `spec.md` — part of the permanent record |
| `/speckit-checklist` | A unit test for the spec's writing: checks for unquantified terms before ambiguity becomes a coding decision made under pressure |
| `/speckit-analyze` | Read-only; cross-checks spec, plan, and tasks against each other and against the constitution before any code exists |
| `/speckit-converge` | Compares what spec/plan/tasks call for against what the code actually does right now, and appends a task if it finds drift |
| `/speckit-taskstoissues` | Exports `tasks.md` into tracked issues for teams that live in an issue tracker rather than a checklist file |

---

## Slide 17 — Resources & Next Steps
**Layout:** default
**Visual:** Plain bullet list of follow-on material
**Speaker notes:** Send the audience somewhere concrete instead of ending on a slogan.
- `speckit-demo` — one feature, one person, a `vibe-coded/` vs. `spec-driven/` side-by-side you can browse
- `speckit-complex-demo` — three contributors, concurrent branches, a mid-project constitution amendment, two real merge conflicts
- `FACILITATION.md` in this repo — the exact live run-of-show, every command typed out, if you want to run this pipeline yourself from zero
