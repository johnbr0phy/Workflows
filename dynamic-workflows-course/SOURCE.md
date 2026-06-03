# SOURCE.md — Canonical Source Material

> This is the authoritative source for the course. All lessons, quizzes, and
> exercises must stay accurate to the material below. If a lesson and this file
> ever disagree, this file wins. Do not paraphrase away the meaning.

---

## What a dynamic workflow is

- Claude writes its own harness on the fly: a JavaScript file with special
  functions to spawn and coordinate subagents, plus standard JS (JSON, Math,
  Array) for processing data.
- The workflow can pick which model each agent uses and whether each subagent
  runs in its own git worktree (controls intelligence level + isolation).
- Workflows are resumable: if interrupted (user action / quit terminal),
  resuming the session picks up where it left off.
- Trigger by asking Claude to make a workflow, or with the trigger word
  `ultracode`.

## Why they exist

- The default harness plans AND executes in one context window. Great for most
  coding, but breaks down on long-running, massively parallel, and/or highly
  structured adversarial tasks.
- Three failure modes a single context window invites:
  - **Agentic laziness** — stops early and declares done after partial progress
    (e.g. 20 of 50 security items).
  - **Self-preferential bias** — prefers its own results when asked to
    judge/verify against a rubric.
  - **Goal drift** — gradual loss of fidelity to the original goal across many
    turns; worsened by lossy compaction (edge-case requirements and "don't do
    X" constraints get dropped).
- Workflows fix these by orchestrating separate Claudes, each with its own
  context window and a focused, isolated goal.

## Dynamic vs static

- Static workflows (Claude Agent SDK or `claude -p`) must cover all edge cases,
  so they're generic.
- Claude Opus 4.8 is smart enough to write a custom harness tailor-made for the
  specific use case = dynamic.

## The six patterns

1. **Classify-and-act** — a classifier agent decides the task type and routes to
   different agents/behavior; or classify at the end to shape output.
2. **Fan-out-and-synthesize** — split into many small steps, run an agent per
   step, then synthesize. Good when there are many small steps or each needs a
   clean context window (no cross-contamination). The synthesize step is a
   BARRIER: it waits for all fan-out agents, then merges their structured
   outputs into one result.
3. **Adversarial verification** — for each spawned agent, run a separate agent
   to adversarially verify its output against a rubric.
4. **Generate-and-filter** — generate many ideas, filter by rubric/verification,
   dedupe, return only the highest-quality tested ideas.
5. **Tournament** — agents compete: spawn N agents that attempt the same task
   with different approaches, then a judging agent compares results pairwise
   until a winner remains.
6. **Loop-until-done** — for unknown work volume, loop spawning agents until a
   stop condition (no new findings / no more errors) rather than a fixed number
   of passes.

## Use cases

- **Migrations/refactors** (e.g. Bun rewritten Zig→Rust): break into units
  (callsites, failing tests, modules); subagent per fix in a worktree →
  adversarial review → merge. Tell agents to avoid resource-intensive commands
  so you can maximize parallelism without exhausting the machine.
- **Deep research** (`/deep-research` skill): fan out web searches, fetch
  sources, adversarially verify claims, synthesize a cited report. Also works on
  Slack context or codebase exploration.
- **Deep verification**: one agent identifies all factual claims, a subagent
  checks each in detail; optionally a verifier checks the source-checker's
  source quality.
- **Sorting**: tournament or a pipeline of pairwise-comparison agents
  (comparative judgment beats absolute scoring), or bucket-rank in parallel then
  merge. Each comparison is its own agent; the deterministic loop holds the
  bracket so only the running order stays in context. Don't sort 1000+ rows in
  one prompt.
- **Memory & rule adherence**: a workflow with a list of rules, one verifier
  agent per rule; add a skeptic persona to review the rules to avoid false
  positives. Reverse direction: mine recent sessions + code-review comments for
  repeated corrections, cluster with parallel agents, adversarially verify each
  candidate ("would this rule have prevented a real mistake?"), distill
  survivors into CLAUDE.md.
- **Root-cause investigation**: generate several independent hypotheses from
  disjoint evidence (separate agents for logs, files, data); each hypothesis
  faces a panel of verifiers and refuters. Works for sales/data/post-mortems
  too.
- **Triage at scale**: classify each item, dedupe against what's tracked, act
  (attempt fix or escalate). **Quarantine pattern**: agents that read untrusted
  public content are barred from high-privilege actions; acting agents do those.
  Pair with `/loop` for continuous triage.
- **Exploration & taste**: explore many solutions (design, naming), give a
  review agent a rubric; done when criteria are met; order/select via
  tournament.
- **Evals**: spin agents in worktrees, then comparison agents grade outputs
  against a rubric (e.g. to refine a skill).
- **Model/intelligence routing**: a classifier agent researches the task, then
  routes to Sonnet vs Opus based on expected complexity.

## When NOT to use

- Workflows are new, not needed for every task, and can use significantly more
  tokens. Ask "does this really need more compute?" Most coding tasks don't need
  a panel of 5 reviewers.

## Tips

- Detailed prompting using the named techniques gives the best results.
- Use a "quick workflow" for small tasks (e.g. a quick adversarial review of one
  assumption).
- Combine with `/goal` (hard completion requirement) and `/loop` (run at
  intervals) for repeatable workflows.
- Set a token budget by prompting a cap, e.g. "use 10k tokens".
- Save a workflow by pressing `s` in the workflow menu → stored in
  `~/.claude/workflows` or distributed via a skill.
- Share via a skill: put the JS workflow files in the skill folder and reference
  them in `SKILL.md`; prompt Claude to treat them as templates, not verbatim
  scripts.
