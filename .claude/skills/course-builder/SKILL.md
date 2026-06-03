---
name: course-builder
description: >-
  Build a complete, self-paced, hands-on training course where Claude Code is the
  instructor — modeled on the AIPM and Dynamic Workflows courses. Turns a topic or
  body of source material into a teachable, interactive course: a self-contained
  course folder (README, instructor CLAUDE.md, full LESSONS, canonical SOURCE,
  progress-tracking templates), a personalized running-example that every session
  applies to, 8-question quizzes, and an optional browsable homepage that can be
  deployed live to GitHub Pages. Use when the user wants to create/build/generate a
  course, curriculum, lesson plan, training, or its website from some context they
  provide.
---

# Course Builder

You build (do not teach) a self-paced, hands-on course in the style of the AIPM /
Dynamic Workflows courses: **Claude Code is the instructor, learners learn by
DOING, every concept ties to one real thing the learner brings, and each session
ends in an 8-question quiz.** You can also generate and deploy a homepage.

This file is the procedure. Three reference docs carry the detail — read the
relevant one before that step:

- `reference/course-anatomy.md` — exact file structure, lesson format, quiz rules,
  tracking files, guardrails. **Read before generating course files.**
- `reference/homepage.md` — how to fill and ship the data-driven homepage. **Read
  before generating the homepage.**
- `reference/deploy-pages.md` — the exact GitHub Pages deploy recipe. **Read before
  deploying.**

Templates live in `templates/`; the homepage shell and CI workflow in `assets/`.

---

## Step 1 — Intake (gather context)

Use whatever the user already gave you; only ask for what's missing. Ask briefly,
grouped, and don't interrogate — infer sane defaults and confirm.

Collect:
1. **Topic / subject** of the course.
2. **Source material** — the authoritative content the course must stay accurate
   to. Paste, a file, a URL, or "use your own knowledge of X." This becomes
   `SOURCE.md` and is the source of truth for every lesson and quiz.
3. **Audience & their goal** — who it's for and what they'll be able to do after.
4. **Where they PRACTICE** — the hands-on environment every exercise runs in
   (e.g. the Anthropic Console, Claude Code itself, a notebook, a CLI, a sandbox).
   Exercises must be native to this environment.
5. **The running example** — the ONE real thing each learner brings that every
   session applies to (a product, a recurring task, a dataset, a repo, a paper…).
   This drives personalization and the capstone. Name the tracking file after it
   (e.g. `MY_PRODUCT.md`, `MY_WORKFLOW.md`, `MY_DATASET.md`).
6. **Size & shape** — number of sessions and phases. Default: derive from the
   source material; if unsure, ~10–12 sessions across 3 phases ending in a
   capstone. Each session ≈ 1 hour.
7. **Homepage?** — generate a homepage (default yes) and whether to deploy it live
   to GitHub Pages (default: offer it).
8. **Any guardrails** specific to the domain (cost, safety, tool limits) to bake
   into the instructor.

## Step 2 — Propose the outline, then confirm

Draft a session list: title + one-line description per session, grouped into
phases, with the final session as a capstone that ships the learner's running
example. State the running example and where exercises will be practiced. Get a
quick thumbs-up (and let them adjust) **before** writing full content.

## Step 3 — Generate the course folder

Read `reference/course-anatomy.md`. Create a self-contained `<slug>-course/`
folder at the repo root (don't modify unrelated files). Produce, as **real
content, not stubs**:

- `SOURCE.md` — the canonical source material, faithfully.
- `LESSONS.md` — every session in full, each with: **Concept · Start with WHY ·
  one or two environment-native Exercises · Key Tradeoff · Apply to Your Work ·
  Quiz bank**.
- `CLAUDE.md` — the instructor: setup flow, how to run a session, commands, the
  8-question quiz rules, the personalization rule, and domain guardrails.
- `README.md` — overview, quick start, the session list, prerequisites.
- `templates/` — `user.json`, `progress.json`, `PROGRESS.md`, and the running-
  example file (`MY_*.md`).

Adapt the templates in this skill's `templates/` folder; fill every placeholder.
Keep explanations short and practical — "why this matters" over theory.

## Step 4 — Generate the homepage (if wanted)

Read `reference/homepage.md`. Copy `assets/index.html` into the course folder and
fill its `SITE` config + `phases` data from `LESSONS.md`. It's a single
self-contained file (React + Tailwind via CDN, no build step). Validate the JSX
transpiles before finishing.

## Step 5 — Deploy live (if wanted)

Read `reference/deploy-pages.md` and follow it exactly. Copy
`assets/deploy-pages.yml` to `.github/workflows/`, point it at the course folder
and the current branch, push to trigger it, confirm the run is green, and give the
user the live URL. If Pages isn't enabled yet, tell the user the one setting to
flip (Settings → Pages → Source → **GitHub Actions**) and re-trigger with a push.

## Step 6 — Finish

Print the final file tree and the **exact first command the learner types to
start** (e.g. `"Let's get started"`). If you deployed, give the live URL.

**Do not start teaching. Build the course, then stop.**

---

## Principles (carry through every step)

- **Build, don't teach.** This skill produces the course; the generated `CLAUDE.md`
  is what teaches later.
- **Learn by doing, in their environment.** Every exercise is hands-on and native
  to the practice environment from intake.
- **One running example, everywhere.** Personalization is the spine: capture the
  learner's real thing up front and apply each session's concept to it; the
  capstone ships it.
- **Self-contained & non-destructive.** Everything lives in the new course folder
  (plus an optional workflow under `.github/`). Don't touch unrelated files.
- **Faithful to source.** `SOURCE.md` wins any disagreement; lessons and quizzes
  must stay accurate to it.
