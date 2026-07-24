# Spec-Kit Live Workshop

This directory is intentionally almost empty. That's the point: it's a
starting line, not a finished demo. `speckit-demo` and `speckit-complex-demo`
are both **finished** repos you study after the fact — this one is for
running the actual `specify init` → `/speckit-constitution` →
`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`
sequence **live**, in front of an audience, from nothing.

- **[`FACILITATION.md`](./FACILITATION.md)** — the run-of-show. Every command
  to type, in order, with talking points, suggested things to say when a
  command prompts you, and timing guidance. This is what you present from.
- **[`presentation/`](./presentation/)** — a standalone concept deck (slides +
  transcript + chapter markers) covering *what spec-driven development is*
  and *what each command does*, meant to be presented **before** you open a
  terminal and start typing. It doesn't reference this specific live session
  — it's the conceptual grounding, so the audience knows what they're about
  to watch happen.

## The example feature

Small on purpose, so it's fully buildable inside a single session: a **URL
shortener**. Submit a long URL, get a short code back; visiting the short
code redirects to the original. One entity, two endpoints, no auth, no
persistence. `FACILITATION.md` has the exact feature description to type when
`/speckit-specify` asks for one.

## If you want a finished reference instead

- `speckit-demo` — one feature, one person, vibe-coded vs. spec-driven
  side-by-side.
- `speckit-complex-demo` — three people, concurrent branches, a constitution
  amendment, real merge conflicts.

This repo is neither of those. It starts at zero every time you run it.
