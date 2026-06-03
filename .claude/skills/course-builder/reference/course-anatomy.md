# Course Anatomy

The exact structure, formats, and rules every generated course follows. This is
the distilled blueprint behind the AIPM and Dynamic Workflows courses.

## File structure

```
<slug>-course/
├── README.md          # overview, quick start, session list, prerequisites
├── CLAUDE.md          # instructor: setup, session flow, commands, quiz rules, guardrails
├── LESSONS.md         # full plans for every session (real content, not stubs)
├── SOURCE.md          # canonical source material — lessons stay accurate to this
├── index.html         # (optional) browsable homepage, self-contained
└── templates/
    ├── user.json          # learner profile (copied to course root on setup)
    ├── progress.json      # per-session status, checkpoints, quiz scores
    ├── PROGRESS.md        # human-readable checkmark view
    └── MY_<THING>.md      # the learner's running example → capstone artifact
```

On first run the instructor copies the four templates into working files at the
course root (`user.json`, `progress.json`, `PROGRESS.md`, `MY_<THING>.md`).

`<slug>` is a kebab-case name from the topic (e.g. `dynamic-workflows-course`).
`MY_<THING>` is named after the running example (`MY_PRODUCT`, `MY_WORKFLOW`,
`MY_DATASET`, `MY_PAPER`, …).

## SOURCE.md

The authoritative material, reproduced faithfully (verbatim if the user supplied
it). Open with a short note: *"This is the source of truth. If a lesson and this
file disagree, this file wins."* Every lesson and quiz answer must trace back here.

## LESSONS.md — the lesson format

Top of file: name the lesson format and list the cross-cutting guardrails the
instructor enforces in every exercise. Then a section per phase, a subsection per
session. **Every session includes all six parts:**

1. **Concept** — what it is, in a few tight sentences. Bold the key terms.
2. **Start with WHY** — why this matters / the problem it solves, before mechanics.
3. **Exercise(s)** — one or two hands-on tasks native to the practice environment.
   The learner DOES something and reports back what they saw. Make them concrete
   and runnable. Add any safety/cost warning the domain needs.
4. **Key Tradeoff** — the honest "this vs that"; when NOT to use it counts too.
5. **Apply to Your Work** — update the relevant line in `MY_<THING>.md`, tying the
   session's concept to the learner's running example.
6. **Quiz bank** — ~8 question→answer pairs covering the session's core concepts,
   from which the instructor builds the live quiz.

Keep it practical and short. Concepts ground out in the running example and the
source material, never abstract theory for its own sake.

## CLAUDE.md — the instructor

Must contain these sections:

- **First-run setup flow** (when `user.json` is missing): ask, one question at a
  time, for the learner's name, role, relevant background, and — most important —
  a rich capture of their **running example** (a concrete recent instance, its
  inputs, its output, where it's slow/weak today) plus a 1–5 self-rating that
  calibrates depth. Then create `user.json` and copy the other three templates to
  the course root. Play the captured example back and confirm before starting.
- **Session execution sequence**: load `user.json` → load the lesson from
  `LESSONS.md` → check `progress.json` → state the objective in one sentence →
  guide exercises step-by-step, **one step then wait for the learner to paste what
  they saw** → discuss → do "Apply to Your Work" → run the quiz → update
  `progress.json` and `PROGRESS.md`.
- **Recognized commands**: "Let's do Session X", "Continue my course", "Show my
  progress", "What's next?", "I'm stuck on X".
- **Quiz rules** (see below).
- **Personalize every exercise** rule: once `user.json` exists, rewrite each
  exercise around the learner's real running example; the generic prompts in
  `LESSONS.md` are fallbacks only.
- **Guardrails**: any domain-specific cost/safety rules to enforce in exercises.
- **Teaching philosophy**: hands-on over lecture; proceed deliberately; stay
  concise; ground everything in the running example; surface tradeoffs; knowing
  when NOT to use a thing is a first-class goal.

## Quiz rules (copy into every CLAUDE.md)

The 8-question multiple-choice quiz must:
- Have **8 questions**, presented **one at a time** (wait for each answer, then say
  correct/incorrect with a one-line why before the next).
- Give **4 options** (A–D) each.
- **Vary the position** of the correct answer across questions.
- Keep wrong answers **plausible and relevant**.
- **Not** make the correct answer consistently the longest option.
- Draw from the session's **Quiz bank** in `LESSONS.md` (rephrase/shuffle freely).
- Record the score in `progress.json` and `PROGRESS.md` (e.g. "Quiz: 7/8").

## Tracking files

- **user.json** — name, role, background, the running-example capture, comfort
  rating, created date. Name the personalization fields after the running example.
- **progress.json** — one entry per session with `status`
  (`not_started`/`in_progress`/`completed`), `checkpoints`, `quiz_score`,
  `notes`, plus a top-level `current_session`.
- **PROGRESS.md** — checkmark view grouped by phase, with quiz scores.
- **MY_<THING>.md** — starts as the learner's running example; gains a line per
  session showing how that session's concept applies; ends as the capstone artifact.

## Personalization (the spine)

The single most important quality bar: the course must make sense **using the
learner's own example**. Capture it richly at setup, store it in `user.json` and
`MY_<THING>.md`, and have the instructor run every exercise on it. A course whose
exercises are generic toys is a failure of this skill.

## Quality bar / definition of done

- Self-contained folder; nothing unrelated modified.
- `LESSONS.md` has **full** content for **every** session (no "TODO"/stubs).
- Final session is a **capstone** that ships the learner's running example.
- All four templates present and internally consistent (session count matches
  across `progress.json`, `PROGRESS.md`, `LESSONS.md`, `README.md`).
- JSON validates.
- The instructor `CLAUDE.md` contains all required sections above.
