# Homepage

The homepage is a single self-contained `index.html` — a three-panel course site
(left phase nav · main content · right "on this page" nav) with click-through
session detail views. It uses React + Tailwind + Babel via CDN, so it renders on
GitHub Pages with **no build step**.

## How to generate it

1. Copy `assets/index.html` into the course folder.
2. Edit exactly **two things** near the top of the `<script type="text/babel">`
   block — everything else is generic and reads from them:
   - **`SITE`** — the site-level config object (branding, hero copy, cards,
     personalization example, prerequisites, get-started steps, links).
   - **`phases`** — the course data, derived directly from `LESSONS.md`. One entry
     per phase; each with a `sessions` array.
3. Leave the components, layout, and CSS alone.

### Filling `phases`

Mirror `LESSONS.md`. Each session object:

```js
{
  id: 1,
  title: "Short Session Title",
  desc: "One-line description",
  duration: "~1 hour",
  running: "How this session's concept applies to the learner's running example.",
  keyTradeoff: "The Key Tradeoff from the lesson.",
  topics: ["Concept bullet", "Concept bullet", ...],      // from Concept
  exercises: ["Hands-on exercise", ...],                   // from Exercise(s)
  outcome: "By the end of this session, the learner can …",
}
```

Each phase: `{ id, name, color, sessions: [...] }`. **`color` must be one of**
`purple`, `blue`, `emerald`, `amber`, `rose` (these are safelisted for Tailwind).
Use a different color per phase; `purple` is the primary accent used throughout.

### Filling `SITE`

The config block is commented field-by-field in `assets/index.html`. Key fields:
`brandFull`, `brandShort`, `ascii` (a short ANSI-Shadow-style banner of a 4–6
letter word from the topic), `heroTitle`, `heroTagline` (e.g. "12 Sessions ·
Hands-On · <environment>"), `heroHeading`, `heroLede`, `calloutHtml` (the amber
"bring your own…" box), `heroChecklist`, `learnCards` (four `{icon,color,title,
body}`; allowed icons: `cpu,layers,shield,package,bookOpen,zap,terminal,workflow,
gitBranch`), `personalization` (heading, lede, three steps, and a worked example
mapping the running example onto two sessions), `prereqs`, `prereqNote`,
`getStarted` (three steps), `shellLines`, `about`, `startCommand`, `githubUrl`,
and optional `siblingLink`.

### ASCII banner

A short block-letter banner in the hero (the reference courses used "AI PM" and
"FLOWS"). Generate one for a 4–6 letter word tied to the topic, in the
ANSI-Shadow style (`█`, `╗`, `╝`, `═`). If unsure, keep it to one short word; a
plain styled title is an acceptable fallback.

## Validate before finishing

The JSX must transpile. Extract the `text/babel` script and run it through Babel:

```bash
# from a scratch dir
npm i @babel/core @babel/preset-react >/dev/null 2>&1
node -e 'const b=require("@babel/core");const fs=require("fs");
const h=fs.readFileSync(process.argv[1],"utf8");
const m=h.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
b.transformSync(m[1],{presets:["@babel/preset-react"]});
console.log("JSX OK");' /path/to/index.html
```

Fix any error before moving on. Also sanity-check that `{`,`(`,`[` counts balance.

## Notes

- The site is one file with no local asset references, so it works at a project
  Pages path like `https://<user>.github.io/<repo>/`.
- Dynamic Tailwind color classes (`bg-<color>-100`) are covered by a hidden
  safelist div in the template — keep it, and only use safelisted colors.
- Optionally also emit `course-site.jsx` (the same component with `lucide-react`
  imports instead of the inline icon set) for users who prefer a real build. This
  is optional polish, not required.
