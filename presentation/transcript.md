[SLIDE 1 — Spec-Driven Development with GitHub Spec-Kit]

Quick show of hands, if this were in a room: who's used an AI coding agent
for something more than an autocomplete-sized edit — an actual feature?
[PAUSE] Keep your hand up if, at some point, you typed one big prompt,
watched it write the whole thing, hit run, and it just... worked. Great
feeling. Lasts about ten minutes.

Today I want to talk about a pattern for that exact moment — not a
framework, not a service, nothing you install and run. It's called
Spec-Driven Development, and the concrete implementation we're looking at
is GitHub's Spec-Kit: six commands, run in a fixed order. [CLICK] The
running example throughout is a URL shortener — submit a long URL, get a
short code back, visit the short code, get redirected. I want to be upfront
about something: there's no actual running app behind this talk. That
feature gets built live, later, in a different session. Here, it's just the
example name that makes six abstract commands concrete.

[SLIDE 2 — The Problem: Prompt and Hope]

Let's name the problem before we name the fix. [PAUSE] You prompt an agent:
"build me a URL shortener." It writes something. It runs. Two weeks later,
someone asks: why is storage a plain global object instead of something
more structured? Why is the short code eight characters, not six? Nobody
knows. There's no artifact that says why — there's a chat log, scrolled
past, that nobody's going to re-read.

[HIGHLIGHT: the real failure] Here's the sharper version of this problem:
ask two different engineers to prompt the same agent for the same feature,
and you'll get two different implementations, with two different unwritten
assumptions baked into each one. That's not an AI problem. That's a
sequencing problem — nothing got decided *before* the code existed, so
there's nothing to check the code *against* afterward.

[SLIDE 3 — What Spec-Driven Development Is]

Here's the one-liner: Spec-Driven Development is a discipline that separates
why, what, how, and order into distinct, written artifacts — all produced
before any implementation code exists. [PAUSE]

That maps onto exactly four questions, and each one has a home: Why maps to
the constitution — the non-negotiable principles. What maps to the spec —
the requirements and user stories, in testable language. How maps to the
plan — the technical design, gated against the constitution. And Order maps
to tasks — a dependency-ordered checklist the implementation just executes.

GitHub Spec-Kit is one concrete way to run this pattern: six slash-commands,
always in the same order, and — this is worth knowing — each command is
implemented as a Claude Code skill. Not a program. A `SKILL.md` file full of
plain-language instructions the agent reads and follows. "A playbook, not a
program" is the mental model to keep.

[SLIDE 4 — [The Pipeline]]

Let's get into the mechanics — how these six commands actually chain
together.

[SLIDE 5 — Six Commands, One Direction]

[CLICK] Here's the whole pipeline, left to right: `specify init`, then
`/speckit-constitution`, `/speckit-specify`, `/speckit-plan`,
`/speckit-tasks`, `/speckit-implement`. [PAUSE] `specify init` is pure
setup — it scaffolds a constitution *template*, full of bracket
placeholders, and it scaffolds the skills folder, one skill per command.
Nothing about your actual feature exists yet.

[HIGHLIGHT: the one branch] Notice there's exactly one place in this entire
straight line where a "no, go back" decision can happen — it's buried
inside the plan step, a Constitution Check that either passes or fails.
Everywhere else, it's just forward motion, file to file. On the
URL-shortener example, this entire sequence — constitution through a
working `curl` call proving the redirect — runs in about thirty-five
minutes. That's not a coincidence; that's the whole point of writing things
down instead of negotiating them live with an agent.

Now let's slow down and walk through each of these six commands one at a
time — what each one reads, what it writes, and why it exists at all.

[SLIDE 6 — specify init]

[CLICK] First command, and it's deliberately boring. `specify init` reads
nothing — there's no prior artifact yet, this is the very first step. What
it writes is pure scaffolding: a `.specify/` folder structure, and a skill
file for every one of the six commands. It also drops in a constitution
*template* — full of bracket placeholders, not real principles yet. Here's
the actual command you'd type:

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init --here --integration claude
```

Zero feature content gets written at this step. No spec, no plan, no code.
It exists purely so every later command has the folder structure and the
skills it needs already sitting there.

[SLIDE 7 — /speckit-constitution]

[CLICK] Now the first command that writes something real. `/speckit-
constitution` reads nothing — it's the first content-bearing step in the
whole pipeline — and it writes `constitution.md`. Here's a real excerpt,
trimmed down, from an actual run of this against a small task-list API demo:

Principle one, Simplicity and Legibility — every artifact has to be
readable in a single pass by someone who's never seen spec-kit before.
Principle four, Traceability From Spec to Code — every meaningful
implementation decision has to be traceable back to a line in spec, plan,
or tasks; if code does something the specs don't explain, either the code
or the specs are wrong.

Why does this command exist at all? Because every later command in this
pipeline — spec, plan, tasks, implement — reads this exact file before it
does anything else. It's the one file that constrains every decision that
comes after it.

[SLIDE 8 — What's a Principle vs. an Implementation Choice?]

[PAUSE] This is worth slowing all the way down for, because "principle" can
sound like just a fancier word for "requirement," and it isn't. A principle
is a non-negotiable, project-wide rule that constrains every later
decision — it doesn't say what to build, it says what's off-limits or
required, no matter what gets built. An implementation choice is a specific
technical decision made later that has to satisfy the principle, but isn't
the principle itself.

[HIGHLIGHT: the real contrast] Here's the exact contrast from this same
demo. The constitution's Principle five says: "Minimal Dependencies — use
vanilla JavaScript with Express only." That's the principle — notice it
doesn't say Express is the point, it says minimal. Then, in `plan.md`'s
Technical Context, you get: "Primary Dependencies: Express 4.x... per
constitution Principle V." That's the implementation choice — the specific
thing chosen for this feature that happens to satisfy the rule.

Rule of thumb: if the same rule could hold true across ten completely
different features, it's a principle. If it's the specific thing picked for
this one feature, it's an implementation choice, and it belongs in the
plan, not the constitution.

[SLIDE 9 — /speckit-specify]

[CLICK] Third command. `/speckit-specify` reads `constitution.md` — every
requirement it writes has to fit inside those non-negotiables — and it
writes `spec.md`. Here's a real user story from that same run:

User Story 1, Add a task and see it in the list, priority P1. A user wants
to capture something they need to do, then confirm it was recorded.
Independent Test: can be fully tested by adding a task and then retrieving
the list, confirming the new task appears with the description provided.

Notice the shape: a priority, a plain-language want, and an Independent
Test — could this one story ship by itself and still be useful? That's what
turns a one-line feature idea into something checkable before anyone
designs a single endpoint.

[SLIDE 10 — /speckit-plan]

[CLICK] Fourth command, and the one with teeth. `/speckit-plan` reads both
`spec.md` and `constitution.md`, and writes `plan.md`, plus supporting
files — `research.md`, `data-model.md`, and a `contracts/` folder. Here's
the part that makes this command different from every other one in the
pipeline:

Constitution Check. Principle one, Simplicity and Legibility: PASS — four
small files total, plain Express routing, no framework magic. Principle
five, Minimal Dependencies: PASS — express is the only runtime dependency,
no test framework, no build step, no TypeScript.

This is the one hard gate in the entire six-command pipeline — every
principle gets graded PASS or FAIL against the actual design, once before
research and once again after. Fail one, and you fix the plan before tasks
ever gets written. Everywhere else in this pipeline, it's just forward
motion.

[SLIDE 11 — /speckit-tasks]

[CLICK] Fifth command. `/speckit-tasks` reads `plan.md` and `spec.md`, and
writes `tasks.md` — a phased, dependency-ordered checklist. Here's the very
start of a real one:

Phase 1, Setup. T-zero-zero-one, checked: create a spec-driven directory
with a src and src/routes subfolder. T-zero-zero-two, checked: initialize
spec-driven's package.json with express as the only dependency.

Notice those boxes are already checked in this excerpt — that's what a
completed run looks like. The whole point of this file is turning a plan
into something an agent, or a human, can execute one checkbox at a time,
grouped by user story.

[SLIDE 12 — /speckit-implement]

[CLICK] Sixth and last command. `/speckit-implement` reads `tasks.md` — and
everything upstream, by reference, since every task line traces back to the
plan and spec. It's the only command that writes actual source code.
Mechanically, it's almost boring: it works through `tasks.md` phase by
phase, flipping each box from an empty bracket to `[X]` as the task
completes.

That simplicity is the whole point. By the time this command runs, every
real decision — what to build, why, in what order — already got made in an
earlier file. There's almost nothing left for this step to improvise. If
you want to see what actually got generated from this exact run, the code
lives in `speckit-demo`'s `spec-driven/` folder.

[SLIDE 13 — Key Concept: The Traceability Spine]

Now that all six commands are on the table, let's zoom into the concept
that ties them together — honestly the best single demo in this whole
pattern. And instead of describing it abstractly, let's follow one real
requirement, from one real repo, all the way through. [CLICK]

This is `FR-001` from `speckit-demo`'s actual generated Task List API. It's
born in `spec.md` as one plain sentence: "System MUST allow a user to add a
new task by providing a non-empty text description." Nothing about HTTP,
nothing about JavaScript yet — just a rule.

That same ID shows up again in `tasks.md`, as an actual build step: "T006,
implement POST /tasks, reject 400 when description is missing or empty —
FR-001, FR-006." Still just a plan at this point.

And then it shows up a third time, in the generated code itself — a
comment, `// FR-001, FR-002, FR-006`, sitting directly above the `if`
statement that checks whether the description is empty and returns a 400
if it is. [PAUSE] Follow the ID, and you can point at the exact line of
running code that one sentence in a spec turned into. Run `grep -rn "FR-"
src/` across a whole codebase, and every requirement ID should show up
somewhere. If one doesn't, that's not a formality — that's code that
exists with nothing written down to justify it.

[SLIDE 14 — Why This Matters: Closing the Loop]

Let's connect this back to where we started. [PAUSE] The opening problem
with vibe-coding was that nobody can check why the code is built a certain
way, because nothing was written down to check it against — just chat
scrollback nobody re-reads.

This is how Spec-Driven Development actually closes that gap — and it's
worth being precise about the word here. An `FR-###` ID isn't
documentation. Documentation can be wrong, stale, or unread, and nobody
notices. It's a promise: `grep -rn "FR-" src/` either finds it satisfied in
the code, or it doesn't. There's no third answer, and nobody has to trust
anybody's memory of what was decided.

Concretely, using exactly what we just walked through: `FR-001` promised
that a non-empty description is required. The check enforcing that promise
sits right under the `// FR-001` comment in `routes/tasks.js`. If someone
had deleted the `if` statement but left the comment, the promise would be
broken — and the grep, not a reviewer's memory six weeks later, is what
would catch it. That's the whole pitch of this pattern in one slide: not
"more organized," but actually provable.

[SLIDE 15 — Spec-Driven Development vs. Vibe-Coding]

Let's put this side by side with what most people are already doing:
vibe-coding — prompt an AI once, hope for the best. [CLICK] It's not a
strawman, it's the default. Vibe-coding wins on raw speed to a first line of
code — one prompt, nothing else. But it has no traceability; the reasoning
lives in chat scrollback that nobody re-reads. It breaks down fast past one
person, because every new session re-derives its own assumptions from
scratch. And revising it means re-prompting and hoping the agent is
consistent with what it did last time.

Spec-Driven Development is slower to a first line of code — six commands
come before it — but every requirement carries a traceable ID all the way
into the source, the constitution and spec are a shared source of truth
across people and sessions, and revising means amending the constitution
and re-running the plan's gate, not re-rolling the dice. Vibe-coding is
right for spikes and throwaway scripts. This pattern is right for anything
that has to survive past the session that created it.

[SLIDE 16 — Five Enhancement Commands, One Line Each]

Everything so far is the required backbone — six commands, always run in
that order. Spec-kit also ships five more commands, and I want to be clear
up front: none of these are required for a single solo pass like the one
we've just walked through. They're optional rigor that earns its keep once
a team, a deadline, or an ambiguous spec is in the picture.

`/speckit-clarify` asks up to five targeted questions and writes the
answers directly back into `spec.md` — part of the permanent record, not a
side conversation. `/speckit-checklist` is a unit test for the spec's own
writing: it catches unquantified terms before they turn into a coding
decision made under pressure. `/speckit-analyze` is read-only — it
cross-checks spec, plan, and tasks against each other and against the
constitution before any code exists. `/speckit-converge` compares what the
spec, plan, and tasks call for against what the code actually does right
now, and appends a task if it finds drift. And `/speckit-taskstoissues`
exports `tasks.md` into tracked issues, for teams that live in an issue
tracker rather than a checklist file.

[SLIDE 17 — Resources & Next Steps]

If you want to go further than one talk: `speckit-demo` has a single
feature built both ways, side by side — `vibe-coded/` versus `spec-driven/`
— worth browsing on your own. `speckit-complex-demo` shows this at team
scale: three contributors, concurrent branches, a constitution amendment
happening mid-project, and two real merge conflicts, not staged ones. And
if you want to actually run this pipeline yourself, from absolutely
nothing, this repo's `FACILITATION.md` has every single command typed out,
exactly as you'd type it, no improvising required. [PAUSE] That's
Spec-Driven Development — six commands, one direction, and a promise you
can grep for.
