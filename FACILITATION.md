# Facilitation Guide: Running Spec-Kit Live

This is your run-of-show. Every command below is written exactly as you'll
type it — copy/paste or retype verbatim, nothing to decide live. Assumes
you're presenting from a terminal with Claude Code running in this
directory, an audience watching a shared screen, and — ideally — the concept
deck in [`presentation/`](./presentation/) already presented *before* you get
here.

Total time: roughly 48 minutes with every optional step included; the
required-only path (Steps 0, 1, 2, 4, 6, 8) runs about 35 minutes.

## Before you start

- [ ] `uvx` installed and network access confirmed (`uvx --version`) — the
      very first live command depends on pulling spec-kit from GitHub.
- [ ] This directory is otherwise empty except this guide, `README.md`, and
      `presentation/` — confirm with `find . -not -path './.git*' -not -path
      './presentation*' -type f` before you start talking; if it isn't
      empty, something from a rehearsal run got left behind.
- [ ] Font size big enough for the back row. Terminal and editor both.
- [ ] Know your fallback: if live coding hits a snag, `speckit-demo` and
      `speckit-complex-demo` are finished repos you can pivot to showing
      instead — see "Contingency" at the bottom.

## The example feature

A **URL shortener**: submit a long URL, get a short code back; visiting the
short code redirects to the original. One entity, two endpoints, no auth, no
persistence. Every command below is written specifically for this feature —
no improvising required.

## Timing overview

| Step | Command | ~Time | Optional? |
|---|---|---|---|
| 0 | `specify init` | 3 min | required |
| 1 | `/speckit-constitution` | 5 min | required |
| 2 | `/speckit-specify` | 7 min | required |
| 3 | `/speckit-clarify` | 3 min | skip if no ambiguity flagged |
| 4 | `/speckit-plan` | 6 min | required |
| 5 | `/speckit-checklist` | 3 min | optional, time-permitting |
| 6 | `/speckit-tasks` | 4 min | required |
| 7 | `/speckit-analyze` | 2 min | optional but recommended — fast, read-only |
| 8 | `/speckit-implement` | 10 min | required |
| 9 | `/speckit-converge` (bonus) | 5 min | optional, only with time to spare |

---

## Step 0 — `specify init`

**Type**:
```bash
uvx --from git+https://github.com/github/spec-kit.git specify init --here --integration claude
```

**Say**: "Before any of this exists, spec-kit is one command. It's going to
scaffold two things and write zero actual content — no spec, no code, just
the machinery."

**Then type**:
```bash
find . -not -path './.git*' -not -path './presentation*' -type f | sort
```

**Point at**: `.specify/memory/constitution.md` is a *template* right now,
full of `[BRACKET_PLACEHOLDER]` tokens — open it and show the brackets.
`.claude/skills/speckit-*/` — one skill per command; open one `SKILL.md` and
show that it's plain instructions, not code — "the command is a playbook the
agent follows, not a program."

---

## Step 1 — `/speckit-constitution`

**Type**:
```text
/speckit-constitution Simplicity First: choose the smallest implementation that satisfies the spec, no speculative abstraction. Testable Requirements: every requirement must be phrased so it can pass or fail, never "should probably." Illustrative Not Production: in-memory storage is fine, no real security hardening, this is a teaching example, not a shipped service.
```

**Say**: "Before we write a single feature, we decide what we're not willing
to compromise on — and every later command reads this file before doing
anything."

**Point at afterward**: the `Sync Impact Report` HTML comment at the top of
`constitution.md` — explain it's invisible when rendered but readable in
source; the version line at the bottom (`1.0.0` — first ratification, no
bump math needed yet).

---

## Step 2 — `/speckit-specify`

**Type**:
```text
/speckit-specify Build a URL shortener: a user submits a long URL and gets back a short code; visiting the short code redirects to the original URL. Keep it simple - in-memory storage is fine, no user accounts, no analytics, no link expiration for v1.
```

**While it's generating, narrate**: user stories get a priority (P1/P2/P3)
and an *Independent Test* — "if we only shipped the P1 story, would it still
be useful on its own?" Functional requirements get an `FR-###` ID the moment
they're written — that ID is going to show up again in the plan, the tasks,
and a code comment; that's the traceability principle in action.

**Point at**: `specs/001-.../spec.md` and its `checklists/requirements.md` —
explain the command validates its own output against a checklist before
declaring itself done.

**Check**: open `spec.md` and search for `NEEDS CLARIFICATION`. If it's
present anywhere, run Step 3 for real. If not, say so explicitly and skip to
Step 4 — "nothing ambiguous enough to flag this time."

---

## Step 3 — `/speckit-clarify`

**Only run this if Step 2 left a `NEEDS CLARIFICATION` marker in `spec.md`.**
Otherwise, skip straight to Step 4 and say why.

**Type**:
```text
/speckit-clarify
```

**Say**: "It asks up to five targeted questions and writes the answers back
into `spec.md` directly, so the resolution is part of the permanent record —
not a Slack thread nobody can find later." Answer whatever questions it asks
about the URL shortener spec, then continue.

---

## Step 4 — `/speckit-plan`

**Type**:
```text
/speckit-plan Use Node.js with Express. Storage is in-memory only (a plain JS object or Map) - no database. No authentication. Short codes are 6-character random alphanumeric strings.
```

**Say**: "This is the only command with a hard gate — it checks the design
against the constitution *before* research starts, and again *after*."

**Point at**: the `Constitution Check` table in `plan.md` — each principle
gets a PASS/FAIL verdict. Then `research.md` — "Decision / Rationale /
Alternatives considered" for the short-code decision you just specified.
Then `data-model.md` and `contracts/` — the exact request/response shape,
decided once, here, not improvised per-route later.

---

## Step 5 — `/speckit-checklist`

**Optional — run if time allows, skip first if the session is tight.**

**Type**:
```text
/speckit-checklist requirement clarity and API contract completeness
```

**Say**: "This is a unit test for the *spec's writing*, not for the code — it
checks things like 'is the short code format ever quantified? length?
character set?' before that ambiguity becomes a coding decision made under
pressure."

---

## Step 6 — `/speckit-tasks`

**Type**:
```text
/speckit-tasks
```

**Point at**: the phase structure — Setup, Foundational (blocking), one phase
per user story, Polish. The `[P]` marker on tasks that can run in parallel;
the `[US1]`/`[US2]` labels tying every task back to a story. "This is the
literal checklist `/speckit-implement` is about to work through, top to
bottom, checking boxes as it goes."

---

## Step 7 — `/speckit-analyze`

**Optional but recommended — it's read-only, so there's zero risk to running
it even under time pressure.**

**Type**:
```text
/speckit-analyze
```

**Say**: "Before we write code, let's have the agent cross-check its own
spec, plan, and tasks against each other and against the constitution."
Point at the severity-graded findings table if anything comes back; a clean
result ("zero issues") is a fine outcome to show too.

---

## Step 8 — `/speckit-implement`

**Type**:
```text
/speckit-implement
```

**Say**: "Now it works through tasks.md exactly as written, phase by phase,
checking off each box as it finishes it."

**After it completes, run the app and prove it live**:

```bash
npm start &
```

```bash
curl -s -X POST localhost:3000/shorten \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com/a/very/long/path"}'
```
```text
# → { "code": "aB3xQ9", "url": "https://example.com/a/very/long/path" }
```

```bash
curl -s -i localhost:3000/aB3xQ9
```
```text
# → 302 redirect to https://example.com/a/very/long/path
```

(Replace `aB3xQ9` with whatever code the first `curl` actually returned.)

**Point at**: `tasks.md`'s checkboxes are now `[X]` — "that's not decoration,
that's a literal record that this specific box was checked because this
specific curl call passed, right now, not from memory."

---

## Step 9 — `/speckit-converge` (bonus)

**Only do this with 5 minutes to spare — strong closing beat.**

**Setup — type this exact edit** (comment out the 404 handling for an
unknown short code, without touching `tasks.md` or `spec.md`):
```bash
# Find the 404/not-found line for an unmatched short code in your redirect
# route and comment it out, e.g.:
#   if (!entry) return res.status(404).send('Not found');
# becomes:
#   // if (!entry) return res.status(404).send('Not found');
```

**Then type**:
```text
/speckit-converge
```

**Say**: "It's comparing what the spec/plan/tasks call for against what the
code actually does right now — not git history, not memory, the current
state." It should surface the missing-404 gap and append a new task for it,
without touching anything else in `tasks.md`. This is the clearest possible
demonstration that the spec is a live source of truth, not a document you
write once and forget.

---

## Talking points bank (use if discussion runs long, or to fill a gap)

- **"Why not just prompt an AI once?"** — that's exactly `speckit-demo`'s
  `vibe-coded/` vs. `spec-driven/` comparison; mention it by name, don't
  demo it live here (different repo).
- **"Does this fall apart with more than one person?"** — that's
  `speckit-complex-demo` — three contributors, concurrent branches, a
  constitution amendment mid-project, two real merge conflicts. Worth a
  one-line teaser if anyone asks, full walkthrough is a separate session.
- **Traceability, concretely**:
  ```bash
  grep -rn "FR-" src/
  ```
  shows every requirement ID sitting in a code comment at the exact line
  that satisfies it — the cheapest possible demo of "the code traces back to
  a decision," and audiences respond well to seeing it live.

## Contingency

- **`uvx` fails / no network**: pivot immediately to showing
  `speckit-complex-demo`'s already-built history instead
  (`git log --oneline --graph --all` there is a strong visual even without
  narration ready) — don't burn audience time troubleshooting a network issue
  live.
- **A command produces something unexpected**: read the output out loud
  before reacting — spec-kit's commands are verbose on purpose, and the
  explanation for "why did it do that" is usually in the text already on
  screen.
- **Running low on time**: the required-only path (Steps 0, 1, 2, 4, 6, 8) is
  a complete, honest arc in about 35 minutes — cut optional steps first,
  never cut Step 8's live `curl` proof, that's the payoff moment.

## After the session

Point attendees at `speckit-demo` (single feature, deep-dive docs on spec-kit
mechanics) and `speckit-complex-demo` (team scale, concurrent branches,
constitution amendments, real merge conflicts) for self-study — both are
finished, browsable on their own, no facilitator required.
