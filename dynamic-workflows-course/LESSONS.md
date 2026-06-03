# LESSONS.md — Dynamic Workflows in Claude Code

> Full session plans for all 12 sessions. The instructor (see `CLAUDE.md`) runs
> one session at a time, guiding exercises step-by-step and waiting for the
> learner to paste what they saw. Every session ends in an 8-question quiz (rules
> in `CLAUDE.md`). All content here must stay accurate to `SOURCE.md`.

**Lesson format (every session):** Concept · Start with WHY · Exercise(s) ·
Key Tradeoff · Apply to Your Work · Quiz bank.

**Personalization (read this first):** Exercises below show a **generic default**
so they work out of the box. Once setup is done, the instructor **runs each
exercise on the learner's own recurring task** instead — using their
`recurring_task`, `task_concrete_example`, `task_inputs`, and `task_output` from
`user.json` (see "Personalize every exercise" in `CLAUDE.md`). Treat the generic
prompts as fallbacks, not the main path.

**Guardrails the instructor enforces in every exercise:**
- Workflows cost tokens. Always prompt a small budget (e.g. "use ~5k tokens")
  and prefer **quick workflows** for exercises.
- Warn the learner before any exercise that would fan out widely.
- In quarantine demos, never grant untrusted-content-reading agents
  high-privilege actions.
- Teach saving with `s` and `~/.claude/workflows` so exercises become reusable
  assets.

---

# PHASE 1 — FOUNDATIONS

## Session 1 — Why workflows exist

### Concept
Claude Code's **default harness plans AND executes inside one context window**.
That's great for most coding. But on tasks that are **long-running, massively
parallel, or highly structured / adversarial**, a single context window invites
three failure modes:

- **Agentic laziness** — stops early and declares "done" after partial progress
  (e.g. fixed 20 of 50 security items, then wraps up).
- **Self-preferential bias** — when asked to judge or verify its own output
  against a rubric, it prefers its own results.
- **Goal drift** — gradual loss of fidelity to the original goal over many turns,
  made worse by lossy compaction: edge-case requirements and "don't do X"
  constraints quietly get dropped.

A **dynamic workflow** fixes these by orchestrating **separate Claudes**, each
with its **own context window** and a **focused, isolated goal**.

### Start with WHY
You've probably watched a long Claude Code run drift, declare victory early, or
mark its own homework. Those aren't random — they're predictable consequences of
one context doing everything. Knowing the three failure modes by name lets you
recognize when a task has outgrown the default harness *before* it burns your time.

### Exercise 1 — Name the failure mode (no tokens spent)
Instructor presents three short real-world scenarios; learner labels each as
laziness / self-preferential bias / goal drift, and says **what a separate-Claude
workflow would change**. Example scenarios:
1. "Audit all 50 endpoints for auth" → it reports 18 done and stops.
2. "Grade your migration against this rubric" → it gives itself a 9/10.
3. After 40 turns, it's quietly ignoring the "never touch the legacy module" rule.

### Exercise 2 — Spot it in your own history
Ask the learner to recall (or scroll back to) one recent long Claude Code
session that went sideways. Which failure mode was it? Capture it — it's evidence
for whether your recurring task needs a workflow at all (Session 3).

### Key Tradeoff
One context window is **cheaper and simpler**, and right for most coding.
Separate-Claude orchestration **costs more tokens and coordination** — you only
reach for it when the task structure actually triggers the failure modes.

### Apply to Your Work
Open `MY_WORKFLOW.md`. Under "Does this even need a workflow?", note which of the
three failure modes most bites your recurring task today. (We decide for-real in
Session 3.)

### Quiz bank (instructor picks/shuffles 8)
- The default harness does what in one context window? → **plans AND executes**.
- "Fixed 20 of 50 items then stopped" is which failure mode? → **agentic laziness**.
- "Gives its own output a high score on the rubric" → **self-preferential bias**.
- What makes goal drift worse over a long run? → **lossy compaction** dropping
  edge-case / "don't do X" constraints.
- Workflows fix the failure modes by…? → **orchestrating separate Claudes, each
  with its own context window and a focused goal**.
- Which task shapes invite the failure modes? → **long-running, massively
  parallel, highly structured/adversarial**.
- True/false: the default harness is bad for most coding. → **False** — it's
  great for most coding.
- Goal drift is specifically a loss of…? → **fidelity to the original goal**.

---

## Session 2 — Anatomy of a workflow

### Concept
A dynamic workflow is a **JavaScript file Claude writes on the fly**. It mixes:
- **Special functions** to **spawn and coordinate subagents**, and
- **standard JS** (JSON, Math, Array) to **process data** between agents.

Key knobs the harness controls:
- **Model per agent** — pick the intelligence level for each subagent.
- **Worktrees** — each subagent can run in its **own git worktree** for
  isolation (no stepping on each other's files).
- **Resumability** — if interrupted (you act, or quit the terminal), **resuming
  the session picks up where it left off**.

**Trigger** a workflow two ways: **ask Claude to make a workflow**, or use the
trigger word **`ultracode`**.

### Start with WHY
The harness being *plain JS that Claude wrote* is the whole point: you can read
it, see exactly which agents spawn, what model each uses, and where data flows.
No black box. Understanding the anatomy is what lets you prompt for the right
structure later.

### Exercise 1 — Trigger and READ the harness (budget ~5k tokens, quick workflow)
Have the learner run a tiny task with `ultracode`, e.g.:
> `ultracode` — quick workflow, use ~5k tokens: spawn 2 agents to each summarize
> one short file in this repo, then combine the two summaries.

When the harness/menu appears, the learner **pastes the generated JS** back.
Together, identify: where agents are **spawned**, where a **model** is chosen,
whether **worktrees** are used, and the **plain-JS** glue that merges results.

### Exercise 2 — Prove resumability
Mid-run (or right after), have the learner note: if they'd quit the terminal,
resuming the session would continue from the last completed step — not restart.
Discuss why per-agent context windows make that possible.

### Key Tradeoff
A custom JS harness is **maximally flexible and inspectable**, but it's **real
code that spawns real agents** — more moving parts than a single prompt. Read it
before you run it widely.

### Apply to Your Work
In `MY_WORKFLOW.md`, jot the *shape* of agents your task might need (how many
small steps? do they touch the same files → worktrees?). Don't design fully yet.

### Quiz bank
- A workflow harness is written in what language? → **JavaScript**.
- Two ways to trigger a workflow? → **ask Claude to make one, or say `ultracode`**.
- What does a worktree give a subagent? → **isolation (its own git worktree)**.
- Per-agent model choice controls…? → **intelligence level of that agent**.
- If you quit the terminal mid-run, resuming…? → **picks up where it left off**.
- Standard JS in the harness is used to…? → **process data (JSON/Math/Array)**.
- The special functions in the harness are for…? → **spawn and coordinate
  subagents**.
- True/false: the harness is an opaque binary you can't inspect. → **False**.

---

## Session 3 — Dynamic vs static + the cost mindset

### Concept
- **Static workflows** (Claude Agent SDK or `claude -p`) must **cover all edge
  cases up front**, so they're **generic**.
- **Dynamic workflows** exist because **Claude Opus 4.8 is smart enough to write
  a custom harness tailor-made for the specific use case** — no need to
  pre-imagine every edge case.
- **The cost mindset:** workflows are **new, not needed for every task, and can
  use significantly more tokens.** Always ask: **"Does this really need more
  compute?"** Most coding tasks don't need a panel of 5 reviewers.

### Start with WHY
The most valuable skill in this whole course is knowing when **not** to reach for
a workflow. A dynamic harness is powerful precisely because it's bespoke — but
bespoke compute is expensive. The pros gate every workflow behind one question.

### Exercise 1 — The gut-check, applied to YOUR task
Walk the learner through the question on their recurring task:
- Is it long-running / massively parallel / adversarially structured?
- Which failure mode (from S1) actually bites?
- Is the extra token cost worth it *here*?
Write a one-line **verdict** in `MY_WORKFLOW.md`.

### Exercise 2 — Static vs dynamic sorting (discussion + tiny demo)
Contrast: a `claude -p` script that must handle every input shape vs. an
`ultracode` workflow Claude writes fresh for *this* dataset. When would the
generic static script actually be the better, cheaper choice? (Answer: stable,
repeated, well-bounded tasks where you don't want fresh compute each run.)

### Key Tradeoff
**Dynamic = tailored but pricier and freshly generated each time.**
**Static = generic and cheap to re-run but must anticipate every edge case.**
Pick by how bounded and repeated the task is.

### Apply to Your Work
Lock the **verdict** line in `MY_WORKFLOW.md`. If the honest answer is "doesn't
need a workflow," say so — and we'll still use it as a teaching example, choosing
the lightest pattern (often a single **quick workflow**).

### Quiz bank
- Static workflows are generic because they must…? → **cover all edge cases**.
- What makes dynamic workflows possible? → **Opus 4.8 writes a custom harness
  for the specific use case**.
- The one question to ask before any workflow? → **"does this really need more
  compute?"**
- Two ways to build a static workflow? → **Claude Agent SDK or `claude -p`**.
- Workflows can use significantly more…? → **tokens**.
- Best fit for a static script over a dynamic workflow? → **stable, repeated,
  well-bounded task**.
- True/false: most coding tasks need a panel of 5 reviewers. → **False**.
- "Tailor-made for the specific use case" describes…? → **dynamic** workflows.

---

# PHASE 2 — THE SIX PATTERNS

## Session 4 — Fan-out-and-synthesize (the barrier)

### Concept
**Split a task into many small steps, run one agent per step, then synthesize.**
Use it when there are many small steps, or when each step **needs a clean context
window** so the agents don't cross-contaminate each other.

The **synthesize step is a BARRIER**: it **waits for ALL fan-out agents to
finish**, then **merges their structured outputs into one result**. Nothing
downstream runs until every fan-out agent reports.

### Start with WHY
Two wins at once: parallelism (many steps at the same time) and *cleanliness*
(each agent starts fresh, so step 7's noise never pollutes step 2's reasoning).
The barrier is what turns N messy parallel outputs into one coherent answer.

### Exercise 1 — Fan-out over files (budget ~5k tokens; WARN: this fans out)
> Warn the learner first: this spawns several agents.
> `ultracode` — use ~5k tokens: fan out one agent per file in `templates/`, each
> returns a 1-line structured summary `{file, purpose}`; synthesize into a single
> table.
Learner pastes the result. Identify the **barrier** in the harness: where does
the synthesize step *wait* for all agents?

### Exercise 2 — Break the barrier on paper
Ask: what would happen if synthesize ran before all agents finished? (Partial /
inconsistent merge.) This cements why the barrier exists.

### Key Tradeoff
Clean per-agent context + parallel speed, **but** you pay for N agents and a
synthesis pass. Worth it when steps are many or must not contaminate each other;
overkill for a 2-step task.

### Apply to Your Work
In `MY_WORKFLOW.md` (Fan-out line): can your task be cut into independent small
steps? What's the **structured output** each fan-out agent should return so
synthesis is clean?

### Quiz bank
- The synthesize step is a…? → **barrier**.
- A barrier does what before merging? → **waits for ALL fan-out agents**.
- Fan-out is good when steps need…? → **a clean context window (no
  cross-contamination)**.
- Synthesize merges what into one result? → **the agents' structured outputs**.
- Besides cleanliness, fan-out gives you…? → **parallelism / speed**.
- Run synthesize before all agents finish → risk of…? → **partial/inconsistent
  merge**.
- Fan-out-and-synthesize is overkill for…? → **a tiny 2-step task**.
- "One agent per small step" is which pattern? → **fan-out-and-synthesize**.

---

## Session 5 — Adversarial verification (+ skeptic persona)

### Concept
**For each spawned agent, run a SEPARATE agent to adversarially verify its output
against a rubric.** A separate verifier sidesteps **self-preferential bias** — the
verifier has no stake in the work it's checking.

**Skeptic persona:** when verifying *rules* (or any check prone to false alarms),
add a skeptic reviewer whose job is to **cut false positives** — challenge weak
flags so you don't drown in noise.

### Start with WHY
Remember self-preferential bias from S1? The fix is structural, not a better
prompt: a different Claude, with its own context and a rubric, judging the work.
The skeptic persona then keeps that verification honest in the other direction.

### Exercise 1 — Verify one assumption (quick workflow, ~5k tokens)
> `ultracode` — quick workflow, ~5k tokens: take one claim in this repo's
> `README.md`, spawn a separate agent to adversarially verify it against a rubric
> (accurate? supported? overstated?). Return verdict + evidence.
Discuss: why a *separate* agent, not the same one re-reading its work?

### Exercise 2 — Add a skeptic
Re-run (or extend) with a skeptic persona reviewing the verifier's flags. Did any
borderline flag get dropped as a false positive? That's the skeptic earning its keep.

### Key Tradeoff
Adversarial verification dramatically cuts self-graded errors **but** doubles
agent count (worker + verifier, sometimes + skeptic). Reserve for outputs where
being wrong is costly.

### Apply to Your Work
`MY_WORKFLOW.md` (Adversarial line): which outputs in your task most need an
independent check? Would a skeptic persona reduce false alarms there?

### Quiz bank
- Adversarial verification uses what kind of agent to check work? → **a separate
  one**.
- It directly counters which failure mode? → **self-preferential bias**.
- The verifier checks output against a…? → **rubric**.
- A skeptic persona's job is to…? → **cut false positives**.
- Why not have the worker verify itself? → **self-preferential bias / no
  independence**.
- Adversarial verification's main cost? → **roughly doubles the agent count**.
- When is a skeptic persona most useful? → **rule-checking / false-positive-prone
  checks**.
- True/false: a better prompt to the same agent fixes self-grading bias as well as
  a separate verifier. → **False** (the fix is structural).

---

## Session 6 — Generate-and-filter + Tournament (comparative judgment)

### Concept
- **Generate-and-filter** — generate **many** ideas, **filter by
  rubric/verification, dedupe**, and return **only the highest-quality, tested
  ideas**.
- **Tournament** — spawn **N agents that attempt the same task with different
  approaches**, then a **judging agent compares results pairwise until a winner
  remains**. The key insight: **comparative judgment beats absolute scoring** —
  it's easier and more reliable to say "A is better than B" than to score each in
  isolation.

### Start with WHY
Quality rarely comes from one good try; it comes from many tries plus a good
filter. And when you must pick a winner, humans and models both judge *relatively*
far better than *absolutely* — that's why tournaments use pairwise comparison.

### Exercise 1 — Generate-and-filter names (quick workflow, ~5k tokens)
> `ultracode` — quick workflow, ~5k tokens: generate ~6 candidate names for the
> learner's recurring-task workflow, filter by a short rubric, dedupe, return the
> top 2 with reasons.
Inspect: where does it filter? where does it dedupe?

### Exercise 2 — Tournament (WARN: spawns N; ~5k tokens)
> `ultracode` — ~5k tokens: 3 agents each draft a one-paragraph description of the
> learner's task using a different angle; a judge does **pairwise** comparisons to
> a single winner.
Confirm in the harness that judging is **pairwise**, not absolute scores.

### Key Tradeoff
More candidates + comparison = better output, **but** generating N attempts and
running a comparison bracket costs the most tokens of the patterns so far. Match N
to how much the quality matters.

### Apply to Your Work
`MY_WORKFLOW.md` (Generate-and-filter / Tournament line): does your task produce
*options* (designs, names, drafts) where many-then-filter or a tournament would
raise quality?

### Quiz bank
- Generate-and-filter returns…? → **only the highest-quality, tested ideas**.
- Two filtering moves after generating? → **filter by rubric + dedupe**.
- A tournament's agents attempt the same task with…? → **different approaches**.
- A tournament judge compares results how? → **pairwise, until a winner remains**.
- Core insight behind tournaments? → **comparative judgment beats absolute
  scoring**.
- Which costs more tokens: one draft, or generate-and-filter? → **generate-and-
  filter**.
- "Score each option 1–10 in isolation" violates which principle? → **comparative
  beats absolute**.
- Generate-and-filter is best when the task produces…? → **many candidate ideas**.

---

## Session 7 — Classify-and-act + model/intelligence routing

### Concept
- **Classify-and-act** — a **classifier agent decides the task type and routes**
  to different agents/behavior. You can also **classify at the END** to shape the
  output format.
- **Model/intelligence routing** — a classifier **researches the task**, then
  **routes to Sonnet vs Opus based on expected complexity**. Cheap model for easy
  items, smart model for hard ones.

### Start with WHY
Not every item deserves the same treatment — or the same model. Routing is how a
workflow spends compute where it matters and saves it where it doesn't. It's the
cost mindset (S3) made automatic.

### Exercise 1 — Classify then route (quick workflow, ~5k tokens)
> `ultracode` — quick workflow, ~5k tokens: classify 3 sample requests from the
> learner's domain into types, and for each say which agent/behavior **and which
> model (Sonnet vs Opus)** it should route to, with a one-line reason.
Inspect: the classifier is its own agent; routing happens *after* it returns.

### Exercise 2 — Classify-at-the-end
Discuss/try shaping a final output by classification (e.g. "is this a bug or a
feature request?" → different report template). Note it's the same pattern,
applied at the end.

### Key Tradeoff
Routing saves money and improves fit, **but** the classifier itself costs a step
and can misroute. Keep the classifier prompt crisp; a wrong class sends work to
the wrong agent/model.

### Apply to Your Work
`MY_WORKFLOW.md` (Classify/route line): do items in your task fall into types that
deserve different handling or different models? Sketch the routing table.

### Quiz bank
- A classifier agent's job is to…? → **decide the task type and route**.
- Routing to Sonnet vs Opus is based on…? → **expected complexity**.
- Classifying at the END is used to…? → **shape the output**.
- Before routing by model, the classifier first…? → **researches the task**.
- Model routing is the cost mindset made…? → **automatic**.
- Main risk of classify-and-act? → **misrouting (wrong class → wrong agent/model)**.
- Send easy items to which model? → **Sonnet** (cheaper); hard → **Opus**.
- True/false: classification can only happen at the start. → **False** (also at
  the end).

---

## Session 8 — Loop-until-done (+ /goal and /loop)

### Concept
**Loop-until-done** — when the **volume of work is unknown**, **loop spawning
agents until a stop condition** (no new findings / no more errors) rather than
running a **fixed number of passes**.

Combine with two commands for repeatable workflows:
- **`/goal`** — a **hard completion requirement** (the bar the loop must clear).
- **`/loop`** — **run at intervals** (repeat the workflow on a schedule).
- Set a **token budget** by prompting a cap (e.g. "use 10k tokens") so an open
  loop can't run away.

### Start with WHY
A fixed "do 3 passes" either stops too early (laziness, S1) or wastes passes. A
stop condition matches effort to reality: keep going while there's signal, stop
when there isn't. `/goal` and `/loop` make it a dependable, recurring tool — and a
token cap keeps the open-endedness safe.

### Exercise 1 — Loop with a stop condition (WARN: open-ended; HARD cap ~10k tokens)
> Warn the learner: loops are open-ended — we cap tokens.
> `ultracode` — use AT MOST 10k tokens: loop a "find issues in this file" agent
> until a pass returns **no new findings**, then stop and summarize.
Inspect the **stop condition** in the harness and confirm the **token cap** was
honored.

### Exercise 2 — Make it repeatable
Show how `/goal` would set the hard bar ("zero lint errors") and how `/loop`
would re-run it on an interval. (Discuss; only run `/loop` if the learner wants a
live recurring task.)

### Key Tradeoff
Loop-until-done matches effort to actual work **but** is open-ended — without a
**token budget** (and ideally a `/goal`) it can over-spend. Always cap it.

### Apply to Your Work
`MY_WORKFLOW.md` (Loop line): does your task have unknown volume? Define a **stop
condition**, a **`/goal`** bar, whether **`/loop`** fits, and a **token cap**.

### Quiz bank
- Loop-until-done is for tasks with…? → **unknown work volume**.
- It loops until a…? → **stop condition (no new findings / no more errors)**.
- `/goal` provides a…? → **hard completion requirement**.
- `/loop` does what? → **runs the workflow at intervals**.
- How do you keep an open loop from running away? → **set a token budget /cap**.
- Loop-until-done beats which naive approach? → **a fixed number of passes**.
- Stopping after a fixed 3 passes risks which failure mode? → **agentic laziness**.
- Combining `/goal` + `/loop` gives you a…? → **repeatable workflow**.

---

# PHASE 3 — APPLIED + SHIPPING

## Session 9 — Deep research + deep verification

### Concept
- **Deep research** (the **`/deep-research`** skill): **fan out web searches,
  fetch sources, adversarially verify claims, synthesize a cited report.** It also
  works on **Slack context** or **codebase exploration** — same shape, different
  source.
- **Deep verification**: **one agent identifies all factual claims**, then a
  **subagent checks each claim in detail**; optionally a **verifier checks the
  source-checker's source quality** (verify the verifier).

Notice this is the earlier patterns combined: **fan-out** (S4) + **adversarial
verification** (S5) + **synthesize barrier** (S4).

### Start with WHY
Research and fact-checking are exactly where a single context drifts and
self-approves. Splitting "find claims" from "check each claim" from "judge source
quality" is what produces a report you can actually trust the citations in.

### Exercise 1 — A scoped deep-research run (WARN: fans out; ~5–10k tokens)
> Warn: fans out web searches.
> Use **`/deep-research`** (or `ultracode`, ~10k tokens) on a small, well-scoped
> question from the learner's domain. Inspect: fan-out searches → fetch → verify →
> **synthesize barrier** → cited report.

### Exercise 2 — Deep verification of a short text
> `ultracode` — ~5k tokens: agent extracts the factual claims from a short
> paragraph; one subagent per claim checks it; note where a "verify the source
> quality" step would slot in.

### Key Tradeoff
Layered verification yields trustworthy, cited output **but** is one of the more
token-heavy shapes (search + per-claim checks + source-quality check). Scope the
question tightly.

### Apply to Your Work
`MY_WORKFLOW.md` (Deep research line): does your task involve gathering or
fact-checking? Which source — web, Slack, or codebase? Where does a "verify the
verifier" step add value?

### Quiz bank
- The deep-research skill is invoked as…? → **`/deep-research`**.
- Deep research's pipeline? → **fan out searches → fetch → adversarially verify →
  synthesize cited report**.
- Besides the web, deep research works on…? → **Slack context or codebase**.
- In deep verification, the first agent…? → **identifies all factual claims**.
- Then a subagent does what? → **checks each claim in detail**.
- "Verify the verifier" means…? → **a verifier checks the source-checker's source
  quality**.
- Deep research combines which two core patterns? → **fan-out + adversarial
  verification (with a synthesize barrier)**.
- True/false: deep research only works on web search. → **False**.

---

## Session 10 — Triage at scale + the quarantine (security) pattern

### Concept
- **Triage at scale**: for each item, **classify → dedupe against what's already
  tracked → act** (attempt a fix, or escalate). Pair with **`/loop`** for
  **continuous triage**.
- **Quarantine pattern (security):** agents that **read untrusted public content
  are barred from high-privilege actions**; **separate acting agents** perform the
  privileged steps. This contains prompt-injection / untrusted input: the reader
  can be fooled, but it can't *do* anything dangerous.

### Start with WHY
Triage is classify-and-act (S7) at volume with a dedupe step. The quarantine
boundary is the single most important safety habit in this course: untrusted text
can try to hijack an agent, so the agent that *touches* untrusted content must
never be the agent that *acts*.

### Exercise 1 — Triage three items (quick workflow, ~5k tokens)
> `ultracode` — quick workflow, ~5k tokens: classify 3 sample incoming items
> (issues/requests from the learner's domain), dedupe against a tiny "already
> tracked" list, and decide act-vs-escalate for each.

### Exercise 2 — Design the quarantine boundary (design only — DO NOT grant privilege)
> Reminder: never give an untrusted-content reader high-privilege actions.
Have the learner draw the boundary for a "read public comments → take action"
flow: which agent reads untrusted content (low privilege), which agent acts (high
privilege), and the structured hand-off between them.

### Key Tradeoff
Triage + quarantine scales safely **but** adds agents (reader, classifier,
deduper, actor) and a strict boundary to maintain. The safety is non-negotiable;
the cost is the price of touching untrusted input.

### Apply to Your Work
`MY_WORKFLOW.md` (Triage/quarantine line): does your task ingest items at volume?
Does any of it read untrusted/external content? If so, define the quarantine
boundary explicitly.

### Quiz bank
- Triage at scale's three steps? → **classify → dedupe → act**.
- Pair triage with which command for continuity? → **`/loop`**.
- The quarantine pattern bars which agents from privileged actions? → **those that
  read untrusted public content**.
- Who performs the high-privilege actions instead? → **separate acting agents**.
- The quarantine pattern defends against…? → **prompt injection / untrusted
  input**.
- Triage is essentially which earlier pattern at volume? → **classify-and-act**
  (plus dedupe).
- Why dedupe in triage? → **avoid re-acting on what's already tracked**.
- True/false: it's fine to let the untrusted-content reader also deploy code if
  it's convenient. → **False** (never).

---

## Session 11 — Big structured tasks

### Concept
Applying the patterns to large, real, structured work:
- **Migrations/refactors** (e.g. Bun's Zig→Rust rewrite): break into **units**
  (callsites, failing tests, modules); **one subagent per fix in a worktree →
  adversarial review → merge.** Tell agents to **avoid resource-intensive
  commands** so you can **maximize parallelism without exhausting the machine**.
- **Sorting**: use a **tournament** or a **pipeline of pairwise-comparison
  agents** (comparative beats absolute), or **bucket-rank in parallel then
  merge**. **Each comparison is its own agent; the deterministic loop holds the
  bracket so only the running order stays in context. Don't sort 1000+ rows in one
  prompt.**
- **Root-cause investigation**: generate **several independent hypotheses from
  disjoint evidence** (separate agents for logs, files, data); each hypothesis
  **faces a panel of verifiers and refuters.** Works for sales/data/post-mortems
  too.
- **Evals**: spin agents in **worktrees**, then **comparison agents grade outputs
  against a rubric** (e.g. to refine a skill).
- **Memory & rule adherence**: one **verifier agent per rule** (+ skeptic to cut
  false positives); reverse direction — **mine sessions + review comments for
  repeated corrections, cluster with parallel agents, adversarially verify each
  candidate rule ("would this have prevented a real mistake?"), distill survivors
  into CLAUDE.md.**

### Start with WHY
This is where the six patterns stop being abstract. Every big task here is a
*combination*: worktrees + adversarial review for migrations; pairwise + a
deterministic bracket for sorting; fan-out + verifier/refuter panels for
root-cause. Seeing the recombination is the point.

### Exercise 1 — Map a big task to patterns (discussion, low tokens)
Pick the structured task closest to the learner's world (migration / sorting /
root-cause / evals / rule-mining). Together, decompose it into **units**, name the
**pattern per stage**, and mark where **worktrees** and **avoid-heavy-commands**
matter for parallelism.

### Exercise 2 — Tiny pairwise sort (quick workflow, ~5k tokens)
> `ultracode` — quick workflow, ~5k tokens: sort ~5 short items by a stated
> criterion using **pairwise comparison agents**; the deterministic loop holds the
> order. Confirm: only the running order stays in context, not all items at once.

### Key Tradeoff
Decomposition + worktrees + panels make huge tasks tractable and trustworthy,
**but** they're the heaviest setups (most agents, most tokens, machine-resource
care). Reserve for genuinely large structured work — and throttle parallelism so
you don't exhaust the machine.

### Apply to Your Work
`MY_WORKFLOW.md` (Big structured task line): if your task is large/structured,
break it into units and assign a pattern per stage. If it's small, note that — and
prefer a quick workflow.

### Quiz bank
- In a migration, each fix runs where? → **its own git worktree**.
- After each migration fix, before merge? → **adversarial review**.
- Why tell agents to avoid resource-intensive commands? → **maximize parallelism
  without exhausting the machine**.
- Best approach to sorting many items? → **pairwise-comparison agents / tournament
  / bucket-rank-then-merge (comparative beats absolute)**.
- In sorting, what stays in context during the loop? → **only the running order
  (the bracket is held deterministically)**.
- Don't sort how many rows in one prompt? → **1000+**.
- Root-cause investigation generates hypotheses from…? → **disjoint evidence
  (separate agents for logs/files/data)**.
- Reverse rule-mining distills survivors into…? → **CLAUDE.md**.

---

## Session 12 — Capstone: ship a workflow

### Concept
Put it together: **build → set a token budget → save (`s`) → package as a skill**
for YOUR recurring task.
- **Save a workflow** by pressing **`s`** in the workflow menu → it's stored in
  **`~/.claude/workflows`**.
- **Share via a skill**: put the **JS workflow files in the skill folder** and
  **reference them in `SKILL.md`**; **prompt Claude to treat them as templates,
  not verbatim scripts**.
- **Detailed prompting using the named techniques gives the best results.** Use a
  **quick workflow** for the small pieces. Combine with **`/goal`** and **`/loop`**
  for a repeatable tool.

### Start with WHY
A workflow you ran once and lost is a demo. A workflow you **saved** and **packaged
as a skill** is a durable asset — your team can reuse it, and Claude can adapt it
per situation because it's a template, not a frozen script. The capstone turns the
course into something you keep.

### Exercise 1 — Build the real thing (token budget REQUIRED)
Using `MY_WORKFLOW.md`, the learner prompts a workflow for their recurring task —
**naming the specific patterns** (fan-out, adversarial verify, classify/route,
loop-until-done, etc.), choosing **models per agent**, deciding **worktrees**,
adding a **quarantine boundary if it reads untrusted content**, and **setting a
token budget** in the prompt. Run it on a real (small) instance.

### Exercise 2 — Save and package as a skill
1. **Save with `s`** → confirm it's in **`~/.claude/workflows`**.
2. **Package as a skill**: create a skill folder, drop the **JS files** in,
   reference them in **`SKILL.md`**, and **instruct Claude to treat them as
   templates**.
3. Optionally wire **`/goal`** (the completion bar) and **`/loop`** (interval).
Update the **Capstone — shipped** checklist in `MY_WORKFLOW.md`.

### Key Tradeoff
Packaging as a template skill maximizes reuse and adaptability **but** a template
is only as good as its prompting — vague templates drift. Keep the named
techniques explicit in `SKILL.md`, and keep the token budget in the prompt.

### Apply to Your Work
This IS your work. Finish `MY_WORKFLOW.md`: patterns combined, models, worktrees,
stop condition, token budget, quarantine boundary, and where the saved
workflow/skill lives and what it saves you each run.

### Quiz bank
- Save a workflow by pressing…? → **`s`** (in the workflow menu).
- Saved workflows are stored in…? → **`~/.claude/workflows`**.
- To share via a skill you put the JS files where? → **in the skill folder,
  referenced in `SKILL.md`**.
- How should Claude treat the workflow files in a skill? → **as templates, not
  verbatim scripts**.
- What gives the best workflow results? → **detailed prompting using the named
  techniques**.
- Two commands that make a workflow repeatable? → **`/goal` and `/loop`**.
- How do you cap a workflow's spend? → **prompt a token budget (e.g. "use 10k
  tokens")**.
- Risk of a vague template skill? → **it drifts (only as good as its prompting)**.
