# Entrepreneurship Architecture Studio

React / Vite / Tailwind CSS / Framer Motion. An editable, source-backed entrepreneurship portfolio explorer.

## Run locally (Windows CMD)
Install Node.js 22 LTS, extract this project, then open CMD in its folder:

```cmd
npm ci
npm run dev
```
Open the local address printed by Vite. Do not double-click index.html: this is a bundled web application.

## Build and preview
```cmd
npm run build
npm run preview
```
Production files are in `dist`. Deploy the contents of dist to a static HTTPS host.

## Included experiences
Executive overview, ten-stage journey, maturity/program matrix, six program architecture pages, entry/exit gate explorer, advisory qualification simulator, routing explorer, specialist services, program comparison, KPI hierarchy, design rationale, governance, assumptions, risks, definitions, complete source archive, framework editor, JSON import/export and presentation mode.

## Editing and persistence
Enable Edit mode from the top bar. The Framework studio provides Add/Edit/Delete/Reorder for structured collections. Direct Edit links are also available in detail views. Relationship arrays can be reordered and edited. Invalid references are rejected; deleting referenced parent entities is blocked until their references are removed. Export a JSON backup before large edits or imports. Undo retains up to 20 revisions during the current session.

The original seed is `src/data/framework.json`. Browser edits are stored in localStorage under `mcit-architecture-workspace-v1`. They are local to this browser and origin, not shared with other browsers or team members. Edit mode is NOT authentication or authorization. Do not enter confidential startup records. JSON import/export transfers the complete model, including original source sections. Source archive content is not overwritten by individual entity edits.

## Presentation
Click Present. Left/Right arrows and PageUp/PageDown move through the presentation sequence. Escape exits. Fullscreen is optional. Editing controls are hidden. Reduced-motion settings are respected. Deep links use hash routing, avoiding static-host refresh failures.

## GitHub Pages deployment
1. Create a repository and upload all project files, including the `.github` folder, excluding node_modules.
2. In repository Settings > Pages, choose GitHub Actions as the deployment source.
3. Push to the `main` branch. The included workflow installs dependencies, runs unit tests, builds, and publishes dist.
4. Open the deployment address shown by GitHub. Asset paths are relative by default; hash routes work beneath repository paths.

Optional CMD commands from the extracted project folder:
```cmd
git init
git add .
git commit -m "Add entrepreneurship architecture studio"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```
Replace YOUR_REPOSITORY_URL with your own repository URL. If the repository already has commits, clone it first and copy these files into the clone rather than force-pushing.

## Architecture
- `src/data/framework.json`: central structured model with stable entity IDs and explicit relationships.
- `src/lib/model.js`: reference validation, lookups, gate rules, export.
- `src/lib/repository.js`: asynchronous persistence adapter; replace for remote storage.
- `src/lib/context.jsx`: workspace state, validated commits, revision history.
- `src/components/`: reusable journey, program, gate, routing, strategy and editor experiences.
- `src/App.jsx`: navigation, search, presentation sequence and contextual routing.
- `src/styles.css`: institutional visual system, responsive layout, focus states and reduced motion.
- `docs/source-extracted.json`: complete extracted source blocks.
- `docs/`: source ambiguity handling, build and QA records.

No decorative imagery or external fonts are required. Visuals are semantic UI components, CSS stage bands and relationship lines. No KPI performance data has been fabricated.

## Source ambiguities
See Framework Logic > Implementation. Mandatory exit failures never automatically graduate despite conflicting fallback wording in X1/X2/X3. E2/E4 weights are incomplete and no score bands are defined: weights are shown but no numeric eligibility score is invented. Gate-check results are advisory and require human evidence verification and panel review. Completion and next-program qualification are separate decisions. Navigation relationships derived from source intervention descriptions do not create new eligibility rules.

## Testing
```cmd
npm test
npm run build
```
For browser QA:
```cmd
npx playwright install chromium
npm run preview -- --port 4174
```
In a second CMD window:
```cmd
npm run test:browser
```
Browser tests expect port 4174. Optional PLAYWRIGHT_EXECUTABLE_PATH selects an existing Chromium executable. Tests cover 39 routes, program tabs, gate expansion, mandatory failure, edit/save/reload, presentation keys, reduced motion, and desktop/tablet/mobile overflow. Test screenshots are temporary and not included in the project.

## Supabase migration
1. Keep the existing structured JSON contract and repository load/save/reset interface.
2. Add a `framework_versions` table with id, framework_id, revision, payload JSONB, created_at and created_by. Keep approved baseline versions immutable.
3. Add Supabase Auth and memberships/roles for viewer/editor/approver. Enforce access with database Row Level Security; never rely on the Edit toggle.
4. Replace localRepository with an authenticated adapter. Load the active version; save a new version using optimistic revision checks to prevent overwrites.
5. Add server-side validation, audit history, approval/publish workflow, conflict resolution and rollback.
6. Store only the public anon key in frontend configuration. Never expose service-role credentials.
7. Test role isolation and concurrent edits before shared use. This release does not implement a remote database or secure authorization.

## QA scope
Production build and 15 unit tests passed. Browser QA passed on 39 routes and widths 1920, 1024 and 390. This is not a formal WCAG certification; conduct organizational accessibility and security review before production deployment.
"# Entrepreneurship_Architecture_Studio" 
