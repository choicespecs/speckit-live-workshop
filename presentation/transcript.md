[SLIDE 1 — Spec-Driven Development with GitHub Spec-Kit]

Alright, before we open a terminal and do anything live, I want to spend about ten minutes on why we're going to type the commands we're about to type. [PAUSE] The topic is spec-driven development, using GitHub's spec-kit toolchain specifically — and the tagline I'd put on this whole idea is: decide once, in writing, before you type a single line of code. That's it, that's the entire pitch. Everything in this deck is building up to a live demo right after — we're going to build a small URL-shortener API from a completely empty repo, using the real command sequence, no simulation. So think of this less as "theory before practice" and more as "here's what you're about to watch happen, and why it's built this way."

[SLIDE 2 — The Problem: What Vibe-Coding Produces]

Let's start with the honest baseline, which is how most of us actually build things day to day: one-shot prompting. Vibe-coding. You describe a feature in a sentence or two to an AI assistant, and you get a working app back. [PAUSE] And I want to be clear — this isn't a strawman, and it isn't wrong. It's fast, and for a lot of what we build, fast is the right trade-off.

But here's what it tends to produce. Implicit decisions get baked in with no record of them anywhere — naming conventions, error response shapes, how edge cases get handled — all decided invisibly, inside a single generation pass, by whatever the model felt like doing in that moment. [CLICK] You end up with inconsistent naming and inconsistent error shapes across a codebase, because there was never one upstream decision that both of those places trace back to — each generation made its own call. And the big one: no paper trail. Ask "why is this built this way" six weeks later, and nobody — including the person who wrote the prompt — can answer with anything better than a guess. [PAUSE] That's the gap spec-driven development is trying to close.

[SLIDE 3 — What Is Spec-Driven Development?]

So what is it, conceptually? Spec-driven development is a discipline that separates four different questions — why, what, how, and order — into four distinct, written artifacts, all produced before any implementation code exists. [HIGHLIGHT: why / what / how / order]

Why becomes the constitution — the non-negotiable principles for this project. What becomes the spec — the requirements and user stories, written in testable language. How becomes the plan — the technical design, and critically, it's gated against the constitution before it's allowed to proceed. And order becomes tasks — a dependency-ordered checklist that the implementation step just executes. [PAUSE] The important structural idea here isn't the four documents themselves, it's the sequencing: nothing downstream gets written until everything upstream of it already exists. Implementation code is the very last artifact produced, not the first.

[SLIDE 4 — The Pipeline: Five Core Commands]

That sequencing is literal — it's five commands, run in a fixed order, each one reading what the last one wrote.

[SLIDE 5 — The Pipeline at a Glance]

Here's the whole pipeline at a glance. [CLICK] Before any of the five core commands run, there's a step zero: `specify init`. That one just scaffolds the machinery — a memory directory, per-command instruction files — and writes zero actual content. No spec, no code, just the harness everything else runs inside of.

Then the five: `/speckit-constitution`, `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`. [PAUSE] One direction only. The plan can't contradict the constitution. The tasks can't invent scope the spec didn't authorize. Each arrow on this diagram is a real file dependency — the next command literally reads the file the previous one wrote — not just a suggested order somebody wrote in a README. By the time `/speckit-implement` runs, every decision has already been made and written down somewhere upstream of it.

[SLIDE 6 — /speckit-constitution — Why, First and Non-Negotiable]

Let's walk each command. First one: `/speckit-constitution`. [PAUSE] It reads nothing — it's the first command, typically run against a near-empty repo. It writes `constitution.md`, the project's non-negotiable principles.

For a small demo feature like the one we're about to build, a plausible set of principles looks something like: Simplicity First — smallest implementation that satisfies the spec, no speculative abstraction. Testable Requirements — every requirement is phrased so it can pass or fail, not "should probably." And Illustrative Not Production — in-memory storage is fine, this is a teaching example, not a shipped service. [HIGHLIGHT: nothing downstream may contradict this file] Why does this command exist at all? Because it's the fixed point — every later command checks its own output against this file before doing anything else.

[SLIDE 7 — /speckit-specify — What, in Testable Language]

Next: `/speckit-specify`. It reads `constitution.md`, and it writes `spec.md` — user stories, each with a priority (P1, P2, P3) and something called an Independent Test, which just answers "would this story alone still be useful if we only shipped it by itself?" Plus FR-### functional requirements and SC-### success criteria. [PAUSE]

Here's the important detail for a team like ours: those FR-### IDs get assigned the instant the requirement is written — not retrofitted later for a postmortem. That ID is going to reappear, unchanged, in the plan, in the tasks, and eventually in a code comment. And notably, no framework names, no schema, no implementation language is allowed in this artifact at all — it forces "what" into testable language before anyone's allowed to touch "how."

[SLIDE 8 — /speckit-plan — How, Gated by the Constitution]

Third command: `/speckit-plan`. This is the only command in the pipeline with a hard gate. It reads `spec.md` and `constitution.md`, and it writes `plan.md` — which includes a Constitution Check table, where every principle gets an explicit PASS or FAIL verdict — plus `research.md`, which is a Decision / Rationale / Alternatives-considered writeup for each meaningful technical choice. For our URL shortener, that's things like: short-code generation — random string versus an incrementing counter versus a hash — pick one, and write down why. Then `data-model.md` and a `contracts/` directory for the exact request and response shapes. [PAUSE]

The gate matters: the design gets checked against the constitution before research even starts, and again after. If a plan fails that check, it gets revised right there — before it's allowed to become tasks, and definitely before any code gets written against it.

[SLIDE 9 — /speckit-tasks — Order, Dependency-Mapped]

Fourth: `/speckit-tasks`. Reads `plan.md` and `spec.md`, writes `tasks.md` — a phased, dependency-ordered checklist. The phases are Setup, Foundational or blocking work, then one phase per user story, then Polish. [CLICK] Tasks that can run in parallel get a `[P]` marker; every task gets tagged with the user story it belongs to, `[US1]`, `[US2]`, and so on. [PAUSE] This is the last artifact produced before any code — it turns "how" into an explicit, ordered execution plan that an agent, or honestly a human, can just follow top to bottom.

[SLIDE 10 — /speckit-implement — Execute, Top to Bottom]

And fifth: `/speckit-implement`. Reads `tasks.md`, writes the actual source code. It works through the checklist phase by phase, and as each task finishes, its checkbox flips from `[ ]` to `[X]` — and that's not decoration, it's a literal record that this specific box got checked because this specific piece of behavior was verified, right now, not from memory. [PAUSE] By design, this is the least interesting command in the pipeline to talk about, and that's the entire point — all the hard thinking already happened in the four commands before it. This one just executes.

[SLIDE 11 — Traceability: IDs That Don't Die at Handoff]

Now here's the throughline that makes all five of those commands more than paperwork: traceability. [HIGHLIGHT: FR-### / SC-### / US# / T###] These IDs — FR-### and SC-### born in `spec.md`, US# tagging a user story, T### tagging a task in `tasks.md` — aren't assigned retroactively for documentation's sake. They're assigned the moment a requirement or a task is written, and they ride all the way down into the implementation.

Concretely — and this is a genuinely satisfying thing to watch happen — once implementation is done, you run `grep -rn "FR-" src/`, and it shows you every single requirement ID sitting in a code comment at the exact line that satisfies it. [PAUSE] That's not a diagram I'm describing, that's real terminal output you're going to see later in this session. It's the cheapest possible demonstration that the code traces back to a decision somebody actually made.

[SLIDE 12 — Key Insight]

If your team remembers exactly one thing from this deck, make it this: the traceability IDs are the load-bearing wall of the whole approach. [PAUSE] The constitution, the spec, the plan, the tasks — all of that is scaffolding, built for one purpose: to make sure an FR-### number means the same thing in the requirement, in the design doc, in the checklist, and in the code comment. Take away the IDs, and you've just got four extra documents nobody reads after week one.

[SLIDE 13 — Optional Rigor & Team Scale]

Okay — that's the required backbone. What's left is optional rigor for a solo pass, and it becomes load-bearing the moment more than one person is involved.

[SLIDE 14 — Five Enhancement Commands, One Line Each]

Five more commands, quickly, one line each, because none of them are required for the solo single-session build you're about to watch. `/speckit-clarify` asks up to five targeted questions and writes the answers directly back into `spec.md` — so the resolution becomes part of the permanent record instead of living in a Slack thread nobody can find in three months. [CLICK] `/speckit-checklist` is basically a unit test for the spec's writing, not the code — it checks things like "is 'short code' ever actually quantified — letters only? some length?" — catching ambiguity before it becomes a coding decision made under deadline pressure. `/speckit-analyze` is read-only, and it cross-checks the spec, plan, and tasks against each other and against the constitution before any code exists — completely safe to run even under time pressure, because it can't write anything. `/speckit-converge` compares what the spec, plan, and tasks currently call for against what the code actually does right now — current state, not git history, not memory — and if it finds drift, it appends a new task rather than silently fixing anything. And `/speckit-taskstoissues` exports `tasks.md` into tracked issues, for teams that live in an issue tracker rather than a markdown checklist. [PAUSE] None required solo. All of them earn their keep the moment a team, a deadline, or genuine ambiguity is in the picture.

[SLIDE 15 — Teaser: This Doesn't Stay Solo]

One more thing before we get to the demo, and I'm going to keep this brief on purpose. Everything I've described assumes one person, one branch, one pass through the pipeline. [PAUSE] At team scale, you get concurrent branches each running their own spec-kit pipeline in parallel, a constitution amendment that lands mid-project and ripples into specs that are already in flight, and real merge conflicts — not just in source code, but in `plan.md` and `tasks.md` themselves. We don't cover that in depth here — there's a separate repo for it, `speckit-complex-demo`: three contributors, concurrent branches, a mid-project constitution amendment, and two real merge conflicts. What you're about to watch today is the on-ramp version. Worth seeing once, solo, before you go look at what changes at team scale.

[SLIDE 16 — When to Use / When Not to Use]

Let's talk trade-offs directly, because "always use spec-driven development" would be a bad take. [PAUSE] Use it for production features with real stakeholders, for cross-team surfaces where naming and contracts actually matter to more than one team, for anything you'll have to explain to somebody else in six months, and for features where "why did we do it this way" is going to get asked in a postmortem — or, frankly, in an interview.

Don't reach for it for true throwaway prototypes and spikes, for a single-file script nobody else is ever going to touch, for exploratory work where you genuinely don't know yet if you're keeping any of it, or in any situation where the ceremony costs you more time than the wrong shortcut would have cost you. This is a tool for matching process weight to actual stakes, not a religion.

[SLIDE 17 — Spec-Driven Dev vs. Vibe-Coding]

Here's the comparison laid out directly. [HIGHLIGHT: decision record / traceability / consistency] Vibe-coding has no decision record and no requirement traceability — spec-driven development has `constitution.md`, `research.md`, and that FR-### to code-comment chain we just walked. Vibe-coding is faster to first working code, full stop — spec-driven development is slower up front, and I won't pretend otherwise. Consistency across the codebase in vibe-coding depends entirely on what you happened to put in the prompt; in spec-driven development it's enforced by the constitution gate. And auditability six weeks later is approximately zero for vibe-coding, versus every decision having a written rationale in spec-driven development.

I'll point out — this exact comparison is what a sibling repo, `speckit-demo`, shows side by side: a `vibe-coded/` folder and a `spec-driven/` folder for the same feature, built both ways, so you can go diff them directly instead of just taking my table's word for it.

[SLIDE 18 — Real-World Analogies]

A few analogies that map cleanly onto the four artifacts, worth keeping in your back pocket. A building's code — fire code, load limits — is the constitution: nobody argues with it mid-construction, the whole design gets drawn to satisfy it first. A negotiated contract's terms are the spec: everyone agreed to them, in writing, before anyone signed anything. And an assembly line's work-instruction sheet is `tasks.md` — the order and the dependencies are already resolved before anyone picks up a tool.

[SLIDE 19 — Summary: Three Takeaways]

Three things to keep, before we go do this for real. [PAUSE] One: decide once, in writing, before you type a single line of code — why, what, how, and order, each one gating the next. Two: traceability IDs aren't documentation-as-an-afterthought, they're a literal, greppable line in the code that closes the loop back to a requirement. And three: solo usage is just the on-ramp — team-scale usage, with concurrent branches and mid-project constitution amendments and real merge conflicts, is what `speckit-complex-demo` covers next, if you want to go deeper on your own time.

[SLIDE 20 — Live Demo: The Numbers]

Quick numbers for what you're about to sit through, straight from the facilitation guide for this exact session — nothing invented here. Roughly thirty-five minutes, start to finish, for six commands — `specify init`, constitution, specify, plan, tasks, implement — and that's it, no optional detours built into this run. Every one of those six commands is scripted with its exact arguments ahead of time, so there's zero decisions left to make live. And the whole scope of the demo feature is one entity, two endpoints.

[SLIDE 21 — Up Next: Live Demo]

So here's exactly what you're about to watch. The feature is a URL shortener: submit a long URL, get a short code back; visit the short code, get redirected to the original. In-memory storage, no auth, no analytics, no link expiration — kept deliberately small so the process is the star of the demo, not the feature. [PAUSE] We're starting from this repo, which is intentionally almost empty right now — a starting line, not a finished demo. If you want a finished reference to study afterward on your own time, there's `speckit-demo` for the solo vibe-coded-versus-spec-driven comparison, and `speckit-complex-demo` for the team-scale version with concurrent branches and merge conflicts.

The command sequence, exactly as you're about to see it typed: `specify init`, then `/speckit-constitution`, `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`. [CLICK] And the payoff moment at the end — a live `curl` against the running service, proving that the checked boxes in `tasks.md` are real, not decorative. Let's go build it.
