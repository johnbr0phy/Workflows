# Deploy to GitHub Pages

The exact recipe for taking a generated homepage live. Source = **GitHub Actions**
(no Jekyll, no branch-folder restriction — it can publish a subfolder).

## Recipe

1. **Add the workflow.** Copy `assets/deploy-pages.yml` to
   `.github/workflows/deploy-pages.yml`. Edit two values:
   - the `on.push.branches` entry → the branch you're working on (the repo's
     default branch is ideal; deploying from the default branch avoids the
     `github-pages` environment branch-policy gotcha).
   - the `upload-pages-artifact` `path:` → the course folder that contains
     `index.html` (e.g. `./my-course`). Use `.` if `index.html` is at the repo root.

2. **Commit and push.** Push to the branch. The `on: push` trigger starts the run.
   `actions/configure-pages@v5` with `enablement: true` turns Pages on via the
   workflow token if it isn't already.

3. **Watch the run.** Use the GitHub MCP tools (load via ToolSearch:
   `mcp__github__actions_list` / `mcp__github__actions_get`). Poll the latest run
   for `status: completed`, `conclusion: success`. If it failed, read job logs
   (`mcp__github__get_job_logs`).

4. **Give the URL.** A project site is at `https://<owner>.github.io/<repo>/`
   (case-insensitive owner; repo path as named). On the very first deploy the CDN
   may 404 for ~30–60s — note that.

## Common snags & fixes

- **First run fails with "Pages not enabled" / "Get Pages site failed."** Pages
  isn't on yet and the token couldn't self-enable. Tell the user to set
  **Settings → Pages → Source → GitHub Actions** (one dropdown), then re-trigger
  with a push (an empty commit is fine: `git commit --allow-empty`). After that
  it succeeds.
- **"Branch is not allowed to deploy to github-pages due to environment protection
  rules."** You're deploying from a non-default branch. Either deploy from the
  default branch, or have the user allow that branch in the `github-pages`
  environment settings.
- **MCP token can't dispatch/re-run workflows (403).** Don't rely on
  `run_workflow`/`rerun_workflow_run`; trigger via a **git push** (including an
  empty commit) instead.
- **Private repo.** GitHub Pages on private repos needs a paid plan. If the deploy
  is blocked for visibility, tell the user; the homepage files still work locally
  (`python3 -m http.server` in the course folder).

## Permission & scope notes

- Only deploy when the user has asked for it (this skill's intake covers that).
- Respect the session's branch rules — don't push to other branches without
  permission. Deploying from the current working branch is fine if that branch is
  (or becomes) the Pages source.
