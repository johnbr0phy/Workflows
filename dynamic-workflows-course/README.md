# Dynamic Workflows in Claude Code

A self-paced, **hands-on** course that teaches you to design and ship **dynamic
workflows** in Claude Code. Unlike a typical course, you don't just read about
workflows — **you build them inside Claude Code itself**: you trigger real
workflows (`ultracode`), read the JavaScript harness Claude writes, and watch
subagents coordinate. Claude Code is your instructor.

> Sibling to the [AIPM](https://github.com/johnbr0phy/AIPM) course (which
> practices in the Anthropic Console). **This course practices inside Claude
> Code.** Same spirit: learn by DOING, tie every concept to your real work, end
> each session with an 8-question quiz.

---

## Quick start

From inside this folder, in Claude Code, just say:

```
Let's get started
```

On first run, the instructor will ask you five quick questions (name, role, what
you mostly do in Claude Code, **one recurring task** you want to make faster or
more reliable, and your comfort with terminal/JS 1–5). That recurring task becomes
your running example and your **capstone**.

Then, any time:

- **"Let's do Session X"** — start a specific session
- **"Continue my course"** — resume from where you left off
- **"Show my progress"** — see your checkmark view
- **"What's next?"** — get the next session
- **"I'm stuck on X"** — debug a workflow that didn't behave

Each session is roughly an hour: a concept, one or two hands-on exercises, the key
tradeoff, applying it to your task, and an 8-question quiz.

---

## What you'll learn

How to recognize when a task has outgrown Claude Code's single context window, and
how to orchestrate **separate Claudes** — each with its own context and a focused
goal — using six core patterns, then ship a saved, reusable workflow as a skill.

## The 12 sessions

**Phase 1 — Foundations**
1. **Why workflows exist** — the single-context-window ceiling + the three failure
   modes (agentic laziness, self-preferential bias, goal drift)
2. **Anatomy of a workflow** — the JS harness, spawn/coordinate, model choice,
   worktrees, resumability, and `ultracode`
3. **Dynamic vs static + the cost mindset** — "does this really need more
   compute?"

**Phase 2 — The six patterns**
4. **Fan-out-and-synthesize** — and the synthesize **barrier**
5. **Adversarial verification** — + a skeptic persona to cut false positives
6. **Generate-and-filter + Tournament** — comparative judgment beats absolute
   scoring
7. **Classify-and-act + model/intelligence routing** — Sonnet vs Opus by
   complexity
8. **Loop-until-done** — stop conditions, + `/goal` and `/loop`

**Phase 3 — Applied + shipping**
9. **Deep research + deep verification** — fan out, fetch, verify, synthesize a
   cited report
10. **Triage at scale + the quarantine (security) pattern**
11. **Big structured tasks** — migrations/refactors, sorting, root-cause, evals
12. **Capstone — ship a workflow** — build → set a token budget → save (`s`) →
    package as a skill for **your** recurring task

---

## Prerequisites

- **Claude Code** with dynamic workflows available (you can trigger one with the
  word `ultracode`, or by asking Claude to make a workflow). Best results on
  **Claude Opus 4.8**, which writes the custom harness.
- A **git repo** to experiment in (this folder is fine). Workflows can run
  subagents in their own git worktrees.
- Basic comfort in a terminal. **JavaScript is helpful but not required** — the
  instructor calibrates harness depth to your comfort level (1–5).
- An awareness that **workflows cost tokens.** Every exercise uses a small budget
  and prefers "quick workflows"; the instructor warns you before anything fans out
  widely.

---

## What's in this folder

```
dynamic-workflows-course/
├── README.md          ← you are here
├── CLAUDE.md          ← instructor instructions (setup, session flow, quiz, guardrails)
├── LESSONS.md         ← full plans for all 12 sessions
├── SOURCE.md          ← canonical source material (lessons stay accurate to this)
└── templates/
    ├── user.json      ← your profile (created on setup)
    ├── progress.json  ← per-session status, checkpoints, quiz scores
    ├── PROGRESS.md    ← human-readable checkmark view
    └── MY_WORKFLOW.md ← your recurring task → your shipped capstone workflow
```

On first run, the instructor copies the templates into working files
(`user.json`, `progress.json`, `PROGRESS.md`, `MY_WORKFLOW.md`) at the course
root.

---

## A note on cost and safety

Dynamic workflows are powerful but **not needed for every task** and can use
**significantly more tokens**. This course teaches you to ask *"does this need more
compute?"* before reaching for one. Exercises always set a token budget, and the
quarantine pattern (Session 10) teaches you to keep untrusted-content-reading
agents away from high-privilege actions. The goal isn't to use workflows
everywhere — it's to use the right amount of compute, safely, on the tasks that
actually warrant it.

To get started, open this folder in Claude Code and say **"Let's get started."**
