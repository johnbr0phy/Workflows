import React, { useState } from 'react';
import {
  Workflow, Terminal, Github, ChevronRight, ChevronDown, CheckCircle, Zap,
  Cpu, Layers, Shield, Package, ArrowLeft, X, Menu, ExternalLink, BookOpen, GitBranch
} from 'lucide-react';

/* lucide icon lookup for dynamic names (the "What You'll Learn" cards) */
const LUCIDE = { cpu: Cpu, layers: Layers, shield: Shield, package: Package };
function NamedIcon({ name, className }) {
  const C = LUCIDE[name] || Cpu;
  return <C className={className} />;
}

/* ------ Data ------ */
const phases = [
  {
    id: 1, name: "Foundations", color: "purple",
    sessions: [
      {
        id: 1,
        title: "Why Workflows Exist",
        desc: "The single-context-window ceiling + the three failure modes",
        duration: "~1 hour",
        running: "Spot which of the three failure modes bites your recurring task today.",
        keyTradeoff: "One context window is cheaper and right for most coding; separate-Claude orchestration costs more tokens but fixes the failure modes.",
        topics: [
          "Why the default harness plans AND executes in one context window",
          "Agentic laziness — stops early and declares done after partial progress",
          "Self-preferential bias — prefers its own results when asked to judge",
          "Goal drift — fidelity lost over many turns, worsened by lossy compaction",
          "How orchestrating separate Claudes, each with its own context, fixes it",
        ],
        exercises: [
          "Name the failure mode in three real scenarios (no tokens spent)",
          "Find a failure mode in one of your own past Claude Code runs",
        ],
        outcome: "Recognize — by name — when a task has outgrown Claude Code's single context window, before it burns your time.",
      },
      {
        id: 2,
        title: "Anatomy of a Workflow",
        desc: "JS harness, spawn/coordinate, model choice, worktrees, resumability, ultracode",
        duration: "~1 hour",
        running: "Trigger ultracode on a tiny version of your task and read the harness Claude writes.",
        keyTradeoff: "A custom JS harness is maximally flexible and inspectable, but it's real code spawning real agents — read it before running it wide.",
        topics: [
          "The harness is JavaScript Claude writes on the fly",
          "Special functions spawn & coordinate subagents; standard JS processes data",
          "Pick the model per agent (controls intelligence level)",
          "Run each subagent in its own git worktree (isolation)",
          "Workflows are resumable — quit the terminal and pick up where you left off",
          "Trigger by asking Claude to make one, or with the word `ultracode`",
        ],
        exercises: [
          "Run a quick ultracode workflow (~5k tokens) and paste the generated harness",
          "Identify where agents spawn, where a model is chosen, and where data is merged",
        ],
        outcome: "Read a real workflow harness and point to spawn, model choice, worktrees, and the data-processing glue.",
      },
      {
        id: 3,
        title: "Dynamic vs Static + the Cost Mindset",
        desc: "Does this really need more compute?",
        duration: "~1 hour",
        running: "Write the honest verdict: does your recurring task even need a workflow?",
        keyTradeoff: "Dynamic = tailored but pricier and freshly generated each run; static = generic and cheap to re-run but must anticipate every edge case.",
        topics: [
          "Static workflows (Agent SDK / claude -p) must cover all edge cases → generic",
          "Dynamic = Opus 4.8 writes a custom harness for the specific use case",
          "Workflows are new, not needed for every task, and can use far more tokens",
          "The one gating question before any workflow: does this need more compute?",
        ],
        exercises: [
          "Run the gut-check on your recurring task and write a one-line verdict",
          "Contrast a static claude -p script vs a dynamic ultracode workflow",
        ],
        outcome: "Decide for real whether a task warrants a workflow — and know that recognizing when NOT to is half the skill.",
      },
    ],
  },
  {
    id: 2, name: "The Six Patterns", color: "blue",
    sessions: [
      {
        id: 4,
        title: "Fan-out-and-Synthesize",
        desc: "Split into many small steps, run an agent each, then synthesize",
        duration: "~1 hour",
        running: "Fan out over your task's inputs; synthesize one clean structured result.",
        keyTradeoff: "Clean per-agent context plus parallel speed, but you pay for N agents and a synthesis pass — overkill for a 2-step task.",
        topics: [
          "One agent per small step, then synthesize",
          "Use it for many small steps, or when each step needs a clean context window",
          "The synthesize step is a BARRIER",
          "The barrier waits for ALL fan-out agents, then merges their structured outputs",
        ],
        exercises: [
          "Fan out one agent per file, synthesize a single table (~5k tokens — warns: fans out)",
          "Reason through what breaks if synthesize runs before the barrier",
        ],
        outcome: "Turn N parallel, non-contaminating agents into one coherent answer with a synthesis barrier.",
      },
      {
        id: 5,
        title: "Adversarial Verification",
        desc: "A separate agent verifies each output against a rubric (+ skeptic persona)",
        duration: "~1 hour",
        running: "Add an independent verifier to the riskiest output in your task.",
        keyTradeoff: "Cuts self-graded errors sharply but roughly doubles agent count — reserve it for outputs where being wrong is costly.",
        topics: [
          "For each spawned agent, a SEPARATE agent verifies its output against a rubric",
          "A separate verifier structurally sidesteps self-preferential bias",
          "A skeptic persona challenges weak flags to cut false positives",
        ],
        exercises: [
          "Adversarially verify one claim in the repo against a rubric (quick workflow, ~5k tokens)",
          "Add a skeptic persona and watch a borderline false positive get dropped",
        ],
        outcome: "Replace self-graded homework with an independent verifier — and keep it honest with a skeptic.",
      },
      {
        id: 6,
        title: "Generate-and-Filter + Tournament",
        desc: "Many ideas → filter & dedupe; or N approaches → pairwise judging",
        duration: "~1 hour",
        running: "Generate options for your task and let comparative judgment pick the winner.",
        keyTradeoff: "More candidates plus comparison raises quality but costs the most tokens so far — match N to how much the quality matters.",
        topics: [
          "Generate-and-filter: many ideas → filter by rubric → dedupe → keep only the best",
          "Tournament: N agents try different approaches; a judge compares pairwise to a winner",
          "Comparative judgment beats absolute scoring",
        ],
        exercises: [
          "Generate-and-filter candidate names for your workflow (quick workflow, ~5k tokens)",
          "Run a 3-agent tournament with pairwise judging (~5k tokens — warns: spawns N)",
        ],
        outcome: "Produce higher-quality output via many tries + a good filter, and pick winners by comparison.",
      },
      {
        id: 7,
        title: "Classify-and-Act + Model Routing",
        desc: "A classifier routes each item to the right agent — and the right model",
        duration: "~1 hour",
        running: "Sketch a routing table for the item types in your task.",
        keyTradeoff: "Routing saves money and improves fit, but the classifier itself costs a step and a wrong class sends work to the wrong place.",
        topics: [
          "A classifier agent decides the task type and routes to different behavior",
          "You can also classify at the END to shape the output",
          "Model routing: the classifier researches the task, routes Sonnet vs Opus by complexity",
          "The cost mindset, made automatic",
        ],
        exercises: [
          "Classify 3 sample requests and route each to an agent + model (quick workflow, ~5k tokens)",
          "Try classify-at-the-end to pick an output template",
        ],
        outcome: "Spend compute where it matters by routing items — and models — by type and complexity.",
      },
      {
        id: 8,
        title: "Loop-until-Done",
        desc: "Loop spawning agents until a stop condition (+ /goal and /loop)",
        duration: "~1 hour",
        running: "Define a stop condition, a /goal bar, and a token cap for your task.",
        keyTradeoff: "Matches effort to actual work but is open-ended — without a token budget (and ideally a /goal) it can over-spend. Always cap it.",
        topics: [
          "For unknown work volume, loop until a stop condition (no new findings / no errors)",
          "Beats running a fixed number of passes",
          "/goal sets a hard completion requirement",
          "/loop runs the workflow at intervals",
          "Cap an open loop by prompting a token budget",
        ],
        exercises: [
          "Loop a 'find issues' agent until no new findings — HARD cap ~10k tokens",
          "Design how /goal + /loop turn it into a repeatable tool",
        ],
        outcome: "Match effort to the real work with a stop condition, and make it repeatable and safe with /goal, /loop, and a cap.",
      },
    ],
  },
  {
    id: 3, name: "Applied + Shipping", color: "emerald",
    sessions: [
      {
        id: 9,
        title: "Deep Research + Deep Verification",
        desc: "Fan out searches, fetch, verify claims, synthesize a cited report",
        duration: "~1 hour",
        running: "Apply deep research / verification to the gathering part of your task.",
        keyTradeoff: "Layered verification yields trustworthy, cited output but is one of the more token-heavy shapes — scope the question tightly.",
        topics: [
          "/deep-research: fan out searches → fetch → adversarially verify → synthesize cited report",
          "Also works on Slack context or codebase exploration",
          "Deep verification: one agent finds all factual claims, a subagent checks each",
          "Optionally verify the verifier — check the source-checker's source quality",
        ],
        exercises: [
          "Run a scoped /deep-research on a small question (~10k tokens — warns: fans out)",
          "Extract and individually verify the claims in a short text (~5k tokens)",
        ],
        outcome: "Build research and fact-checking workflows whose citations you can actually trust.",
      },
      {
        id: 10,
        title: "Triage at Scale + the Quarantine Pattern",
        desc: "Classify → dedupe → act, safely, with a security boundary",
        duration: "~1 hour",
        running: "Map your intake to triage; draw a quarantine boundary if it reads untrusted content.",
        keyTradeoff: "Scales safely but adds agents and a strict boundary to maintain — the safety is non-negotiable; the cost is the price of untrusted input.",
        topics: [
          "Triage: classify each item → dedupe against what's tracked → act (fix or escalate)",
          "Pair with /loop for continuous triage",
          "Quarantine: agents that read untrusted public content are barred from high-privilege actions",
          "Separate acting agents perform the privileged steps",
        ],
        exercises: [
          "Triage 3 incoming items: classify, dedupe, act-vs-escalate (quick workflow, ~5k tokens)",
          "Design a quarantine boundary — design only, never grant privilege to readers",
        ],
        outcome: "Triage items at volume and contain prompt-injection by keeping untrusted readers away from privileged actions.",
      },
      {
        id: 11,
        title: "Big Structured Tasks",
        desc: "Migrations/refactors, sorting, root-cause, evals",
        duration: "~1 hour",
        running: "Decompose your task into units and assign a pattern per stage.",
        keyTradeoff: "Decomposition + worktrees + panels make huge tasks tractable and trustworthy, but they're the heaviest setups — throttle parallelism so you don't exhaust the machine.",
        topics: [
          "Migrations: one subagent per fix in a worktree → adversarial review → merge",
          "Tell agents to avoid resource-intensive commands to maximize parallelism safely",
          "Sorting: pairwise-comparison agents; the loop holds the bracket; don't sort 1000+ rows in one prompt",
          "Root-cause: independent hypotheses from disjoint evidence, faced by verifiers & refuters",
          "Evals: agents in worktrees, then comparison agents grade outputs against a rubric",
        ],
        exercises: [
          "Map a big task from your world to a pattern per stage (discussion, low tokens)",
          "Run a tiny pairwise sort of ~5 items (quick workflow, ~5k tokens)",
        ],
        outcome: "See the six patterns recombine into migrations, sorting, root-cause investigations, and evals.",
      },
      {
        id: 12,
        title: "Capstone — Ship a Workflow",
        desc: "Build → set a token budget → save (s) → package as a skill",
        duration: "~1–2 hours",
        running: "Ship the workflow for YOUR recurring task — saved and packaged for reuse.",
        keyTradeoff: "Packaging as a template skill maximizes reuse and adaptability, but a template is only as good as its prompting — keep the named techniques explicit.",
        topics: [
          "Build it: name the patterns, choose models, decide worktrees, add a quarantine boundary if needed",
          "Set a token budget in the prompt",
          "Save with `s` → stored in ~/.claude/workflows",
          "Package as a skill: JS files + SKILL.md, treated as templates not verbatim scripts",
          "Combine with /goal and /loop for a repeatable tool",
        ],
        exercises: [
          "Build and run your workflow on a real, small instance (token budget required)",
          "Save it with `s`, then package it as a reusable skill",
        ],
        outcome: "Walk away with a saved, packaged workflow that automates the exact task you came to make faster.",
      },
    ],
  },
];

const TOTAL = phases.reduce((n, p) => n + p.sessions.length, 0);

const navSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'who', label: 'Who This Is For' },
  { id: 'learn', label: "What You'll Learn" },
  { id: 'personalization', label: 'How It Adapts' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'prereqs', label: 'Prerequisites' },
  { id: 'start', label: 'Get Started' },
  { id: 'about', label: 'About' },
];
const sessionDetailSections = [
  { id: 'session-overview', label: 'Overview' },
  { id: 'session-outcome', label: 'Outcome' },
  { id: 'session-topics', label: 'What You\'ll Learn' },
  { id: 'session-exercises', label: 'Exercises' },
];

const colorMap = {
  purple:  { badge: 'bg-purple-100 text-purple-700', soft: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-100 text-purple-600' },
  blue:    { badge: 'bg-blue-100 text-blue-700',     soft: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-100 text-blue-600' },
  emerald: { badge: 'bg-emerald-100 text-emerald-700', soft: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-100 text-emerald-600' },
};

const GITHUB_URL = "https://github.com/johnbr0phy/workflows-course";

/* --------------------- Session detail view --------------------- */
function SessionDetailContent({ session, phase, onBack, onNavigate, allSessions }) {
  const colors = colorMap[phase.color];
  const prev = allSessions.find(s => s.session.id === session.id - 1);
  const next = allSessions.find(s => s.session.id === session.id + 1);

  return (
    <>
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Course Overview</span>
      </button>

      <section id="session-overview" className="mb-8 scroll-mt-20">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.badge}`}>
            Phase {phase.id}: {phase.name}
          </span>
          <span className="text-sm text-slate-500">Session {session.id} of {TOTAL}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{session.title}</h1>
        <p className="text-lg text-slate-600">{session.desc}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500 flex-wrap">
          <span>{session.duration}</span>
          <span>{(session.topics || []).length} concepts</span>
          <span>{(session.exercises || []).length} exercises</span>
        </div>
      </section>

      {session.outcome && (
        <section id="session-outcome" className={`mb-8 p-4 rounded-xl ${colors.soft} ${colors.border} border scroll-mt-20`}>
          <div className="flex items-start gap-3">
            <Icon name="checkCircle" className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
            <div>
              <div className={`font-semibold ${colors.text} mb-1`}>By the end of this session</div>
              <p className="text-slate-700">{session.outcome}</p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Applied to Your Task</div>
          <div className="font-medium text-slate-900">Your recurring task</div>
          <p className="text-sm text-slate-600 mt-1">{session.running}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Key Tradeoff</div>
          <p className="text-sm text-slate-700">{session.keyTradeoff}</p>
        </div>
      </div>

      <section id="session-topics" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">What You'll Learn</h2>
        <div className="space-y-2">
          {session.topics.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-sm font-mono text-slate-400 w-6">{i + 1}.</span>
              <span className="text-slate-700">{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="session-exercises" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Hands-On Exercises</h2>
        <div className="space-y-2">
          {session.exercises.map((e, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <Zap className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
              <span className="text-slate-700">{e}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
          <strong>Token-aware by design.</strong> Exercises run on a small budget and prefer "quick workflows." The instructor warns you before anything fans out widely.
        </div>
      </section>

      <div className="flex items-center justify-between pt-8 border-t border-slate-200 gap-4">
        {prev ? (
          <button onClick={() => onNavigate(prev.session, prev.phase)} className="text-sm text-slate-600 hover:text-purple-600 flex items-center gap-2 text-left">
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span>Session {prev.session.id}</span>
          </button>
        ) : <div />}
        {next ? (
          <button onClick={() => onNavigate(next.session, next.phase)} className="text-sm text-slate-600 hover:text-purple-600 flex items-center gap-2 text-right">
            <span>Session {next.session.id} →</span>
          </button>
        ) : <div />}
      </div>
    </>
  );
}

/* ----------------------------- App ----------------------------- */
export default function CourseSite() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState({ 1: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allSessions = phases.flatMap(phase => phase.sessions.map(session => ({ session, phase })));

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const togglePhase = (id) => setExpandedPhases(p => ({ ...p, [id]: !p[id] }));
  const openSession = (session, phase) => {
    setSelectedSession(session); setSelectedPhase(phase);
    setExpandedPhases(p => ({ ...p, [phase.id]: true }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goHome = () => { setSelectedSession(null); setSelectedPhase(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const currentNavSections = selectedSession ? sessionDetailSections : navSections;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-purple-600">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Workflow className="w-6 h-6 text-purple-600" />
          <span className="font-semibold text-slate-900 hidden sm:inline">Dynamic Workflows in Claude Code</span>
          <span className="font-semibold text-slate-900 sm:hidden">Workflows</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => scrollToSection('start')} className="text-sm text-slate-600 hover:text-purple-600 hidden sm:block">Get Started</button>
          <a href={GITHUB_URL} className="text-slate-400 hover:text-slate-600"><Github className="w-5 h-5" /></a>
        </div>
      </header>

      <div className="flex pt-14">
        {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

        {/* Left sidebar */}
        <aside className={`fixed left-0 top-14 bottom-0 w-80 bg-white border-r border-slate-200 overflow-y-auto p-4 z-40 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="space-y-1">
            <button onClick={() => { goHome(); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors ${!selectedSession ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              Home
            </button>
            {phases.map(phase => (
              <div key={phase.id} className="mt-3">
                <button onClick={() => togglePhase(phase.id)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors gap-2">
                  <span className="text-left">Phase {phase.id}: {phase.name}</span>
                  {expandedPhases[phase.id] ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>
                {expandedPhases[phase.id] && (
                  <div className="mt-1 ml-2 border-l border-slate-200 pl-2">
                    {phase.sessions.map(session => (
                      <button key={session.id} onClick={() => { openSession(session, phase); setMobileMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors leading-tight ${selectedSession?.id === session.id ? 'bg-purple-50 text-purple-700 font-medium' : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'}`}>
                        <span className="text-slate-400 mr-1">{session.id}.</span>{session.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:ml-80 lg:mr-56 max-w-4xl mx-auto lg:mx-0">
          {selectedSession && selectedPhase ? (
            <SessionDetailContent session={selectedSession} phase={selectedPhase} onBack={goHome} onNavigate={openSession} allSessions={allSessions} />
          ) : (
          <>
            {/* Hero */}
            <section id="overview" className="mb-16 scroll-mt-20">
              <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 mb-8 text-center overflow-x-auto">
                <pre className="text-purple-400 text-[10px] sm:text-xs font-mono leading-tight mb-4 inline-block text-left">
{`███████╗██╗      ██████╗ ██╗    ██╗███████╗
██╔════╝██║     ██╔═══██╗██║    ██║██╔════╝
█████╗  ██║     ██║   ██║██║ █╗ ██║███████╗
██╔══╝  ██║     ██║   ██║██║███╗██║╚════██║
██║     ███████╗╚██████╔╝╚███╔███╔╝███████║
╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝`}
                </pre>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dynamic Workflows</h1>
                <p className="text-purple-300">12 Sessions · Hands-On · Inside Claude Code</p>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-4 font-mono">The Course Taught INSIDE Claude Code</h2>
              <p className="text-lg text-slate-600 mb-6">
                Learn to orchestrate fleets of Claudes by actually doing it — trigger real workflows with <code className="bg-slate-100 px-2 py-0.5 rounded text-purple-600">ultracode</code>, read the JavaScript harness Claude writes, and watch subagents coordinate.
              </p>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-900 font-medium">
                  <strong>Bring your own recurring task.</strong> At setup you describe one real task you'd love to make faster or more reliable. Every session applies a pattern to YOUR task — and you ship it as a reusable workflow in the capstone.
                </p>
              </div>

              <ul className="space-y-3 text-slate-700 mb-8">
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Open the course folder, type <code className="bg-slate-100 px-2 py-0.5 rounded text-purple-600">"Let's get started"</code> to begin setup</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Tell Claude about <strong>your recurring task</strong> — its inputs, its output, and where it's slow</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Every exercise runs on <strong>your task</strong>, on a small token budget, with warnings before anything fans out wide</span></li>
              </ul>

              <button onClick={() => scrollToSection('start')} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors">
                Get Started <ChevronRight className="w-4 h-4" />
              </button>
            </section>

            {/* Who */}
            <section id="who" className="mb-16 scroll-mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 font-mono">Who This Course Is For</h2>
              <p className="text-slate-600 mb-4">
                <strong>Engineers, researchers, and operators</strong> who already use Claude Code and want to push past the single-context-window ceiling — orchestrating separate Claudes for long-running, massively parallel, or adversarial work.
              </p>
              <p className="text-slate-600 mb-6">By the end, you'll be able to:</p>
              <ul className="space-y-2 text-slate-700 mb-6">
                <li className="flex items-start gap-3"><Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" /><span>Recognize when a task has outgrown one context window — and when it hasn't</span></li>
                <li className="flex items-start gap-3"><Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" /><span>Apply all six patterns: fan-out, adversarial verification, generate-and-filter, tournament, classify-and-act, loop-until-done</span></li>
                <li className="flex items-start gap-3"><Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" /><span>Build deep-research, triage, migration, and sorting workflows</span></li>
                <li className="flex items-start gap-3"><Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" /><span>Ship a saved, reusable workflow packaged as a skill</span></li>
              </ul>
              <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-600">
                <strong>JavaScript helps but isn't required.</strong> The instructor calibrates how deep it goes on the harness to your comfort level (1–5).
              </div>
            </section>

            {/* Learn */}
            <section id="learn" className="mb-16 scroll-mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: 'cpu', color: 'purple', title: 'Separate Context Windows', body: 'Why one context window drifts, stops early, and grades its own work — and how separate Claudes fix it.' },
                  { icon: 'layers', color: 'blue', title: 'The Six Patterns', body: 'Fan-out-and-synthesize, adversarial verification, generate-and-filter, tournament, classify-and-act, loop-until-done.' },
                  { icon: 'shield', color: 'emerald', title: 'Verification & Safety', body: 'Adversarial verifiers, skeptic personas, and the quarantine pattern that keeps untrusted content away from privileged actions.' },
                  { icon: 'package', color: 'amber', title: 'Ship Reusable Workflows', body: 'Set token budgets, save with s, and package workflows as skills your whole team can reuse.' },
                ].map((c, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-${c.color}-100 flex items-center justify-center`}>
                        <NamedIcon name={c.icon} className={`w-5 h-5 text-${c.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-slate-900">{c.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section id="curriculum" className="mb-16 scroll-mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Curriculum</h2>
              <p className="text-slate-600 mb-6">12 sessions across 3 phases. Each session is ~1 hour of hands-on work. <strong>Click any session</strong> to see full details.</p>
              {phases.map(phase => (
                <div key={phase.id} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorMap[phase.color].badge}`}>Phase {phase.id}</span>
                    <h3 className="font-semibold text-slate-900">{phase.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {phase.sessions.map(session => (
                      <button key={session.id} onClick={() => openSession(session, phase)}
                        className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-left group">
                        <span className="text-sm font-mono text-slate-400 w-6">{session.id}</span>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">{session.title}</div>
                          <div className="text-sm text-slate-500">{session.desc}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400 mt-1 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Personalization */}
            <section id="personalization" className="mb-16 scroll-mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">How It Adapts to You</h2>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100 mb-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" /> Your Recurring Task = Your Curriculum
                </h3>
                <p className="text-slate-600">
                  This isn't a course with generic "build a workflow" examples. At setup you describe one real recurring task — its inputs, its output, and where it's slow today. Every session then applies that session's pattern to <strong>your task</strong>, and the capstone ships it as a reusable workflow.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { n: 1, t: 'Setup: Describe Your Task', b: <>Claude asks for one recurring task plus a concrete recent example, its inputs and its output. Saved to <code className="text-xs bg-slate-100 px-1 rounded">MY_WORKFLOW.md</code></> },
                  { n: 2, t: 'Diagnose: Does It Need a Workflow?', b: <>Session 3's gut-check decides honestly whether your task warrants more compute — knowing when <strong>not</strong> to is half the skill.</> },
                  { n: 3, t: 'Build: Applied to Your Task', b: <>Every "Apply to Your Work" section maps that session's pattern onto your task; the capstone ships it.</> },
                ].map(s => (
                  <div key={s.n} className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center mb-3">{s.n}</div>
                    <h4 className="font-semibold text-slate-900 mb-2">{s.t}</h4>
                    <p className="text-sm text-slate-600">{s.b}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Example</div>
                <p className="text-sm text-slate-700 mb-2"><strong>Your task:</strong> "Triage the incoming GitHub issue queue every morning"</p>
                <p className="text-sm text-slate-600">
                  → Session 4 (Fan-out) becomes: "One agent per new issue returns a structured summary; synthesize a single triage table"<br/>
                  → Session 10 (Triage + quarantine) becomes: "Classify → dedupe against tracked issues → act, with issue-readers barred from privileged actions"
                </p>
              </div>
            </section>

            {/* Prereqs */}
            <section id="prereqs" className="mb-16 scroll-mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 font-mono">Prerequisites</h2>
              <ul className="space-y-3 text-slate-700 mb-6">
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" /><span><strong>Claude Code with dynamic workflows</strong> — you can trigger one with the word <code className="bg-slate-100 px-1 rounded text-purple-600">ultracode</code>, or by asking Claude to make a workflow</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" /><span>Best results on <strong>Claude Opus 4.8</strong>, which writes the custom harness</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" /><span>A <strong>git repo</strong> to experiment in (the course folder is fine) — workflows can run agents in their own worktrees</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" /><span>Basic terminal comfort; JavaScript helpful but not required</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" /><span>~12 hours to complete (about 1 hour per session)</span></li>
              </ul>
              <div className="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-800 border border-emerald-100">
                <strong>Workflows cost tokens.</strong> Every exercise uses a small budget and prefers "quick workflows" — the instructor warns you before anything fans out wide.
              </div>
            </section>

            {/* Get Started */}
            <section id="start" className="mb-16 scroll-mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Get Started</h2>
              <div className="space-y-4">
                <a href="https://docs.claude.com/en/docs/claude-code" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors"><Terminal className="w-5 h-5 text-purple-600" /></div>
                  <div className="flex-1"><div className="font-semibold text-slate-900">1. Install Claude Code</div><div className="text-sm text-slate-500">Confirm <code className="text-xs bg-slate-100 px-1 rounded">ultracode</code> triggers a workflow</div></div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
                <a href={GITHUB_URL} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors"><Github className="w-5 h-5 text-blue-600" /></div>
                  <div className="flex-1"><div className="font-semibold text-slate-900">2. Get the Course Folder</div><div className="text-sm text-slate-500">Clone the repo; the course lives in <code className="text-xs bg-slate-100 px-1 rounded">dynamic-workflows-course/</code></div></div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
                <a href={GITHUB_URL} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors"><BookOpen className="w-5 h-5 text-emerald-600" /></div>
                  <div className="flex-1"><div className="font-semibold text-slate-900">3. Start Session 1</div><div className="text-sm text-slate-500">Open Claude Code and say "Let's get started"</div></div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>
              <div className="mt-6 p-4 bg-slate-100 rounded-xl">
                <p className="text-sm text-slate-600 font-mono">
                  <span className="text-slate-400">$</span> cd dynamic-workflows-course &amp;&amp; claude<br/>
                  <span className="text-slate-400">You:</span> <span className="text-purple-600">"Let's get started"</span>
                </p>
              </div>
            </section>

            {/* About */}
            <section id="about" className="mb-16 scroll-mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 font-mono">About This Course</h2>
              <p className="text-slate-600 mb-4">Built for people who already live in Claude Code and want to <strong>orchestrate</strong> it, not just prompt it.</p>
              <p className="text-slate-600 mb-4">A sibling to the <a href="https://johnbr0phy.github.io/AIPM/" className="text-purple-600 hover:underline">AIPM</a> course — same hands-on, learn-by-doing spirit and 8-question quizzes, but every exercise runs <em>inside Claude Code itself</em>, triggering real workflows.</p>
              <div className="text-sm text-slate-500">Questions or feedback? <a href={GITHUB_URL + "/issues"} className="text-purple-600 hover:underline">Open an issue on GitHub</a>.</div>
            </section>
          </>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="hidden lg:block fixed right-0 top-14 bottom-0 w-56 bg-white border-l border-slate-200 overflow-y-auto p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">On This Page</div>
          <nav className="space-y-1">
            {currentNavSections.map(section => (
              <button key={section.id} onClick={() => scrollToSection(section.id)}
                className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                {section.label}
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
