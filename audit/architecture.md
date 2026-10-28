# Architecture Summary — Laporan Magang PKL (Ditjen Kuathan Kemhan)

## 1. Product, Principals, and Authority
- **Product**: Interactive Logbook & Presentation Defense Single-Page Application (SPA) designed for students undergoing Internship (Praktik Kerja Lapangan / PKL) at Ditjen Kuathan Kemhan RI (Kementerian Pertahanan Republik Indonesia). The application showcases team member profiles, interactive 3D/GSAP character selection, weekly activity logbooks, project showcases, and presentation defense guidelines.
- **Principals & Normal Authority**:
  - `Viewer / Audience`: Can navigate slides, switch contestant cards, filter and search logs, and view documentation without state-mutating privileges.
  - `Operator / Presenter`: Can deliver the presentation using keyboard hotkeys (`1`-`5`, `Ctrl+M`, `Ctrl+A`, `<`/`>`).
  - `Admin / Evaluator`: Can trigger the admin drawer to create, update, or delete member records, activity logs, and project deliverables, as well as export/import JSON backups or reset data to the default template.
- **Protected Resources**:
  - Local state integrity and persistence in browser `localStorage` (`the_finals_pkl_kemhan_v4`, `the_finals_pkl_logs_kemhan_v4`, `the_finals_pkl_projects_kemhan_v4`).
  - Client application availability (preventing client-side application crashes/lockouts).
  - Kedinasan operational data and personnel information displayed during evaluation.

## 2. Comparable Software Baseline
Comparable modern single-page presentation dashboards (e.g., reveal.js, Slidev, Next.js static portfolios, and local electron/kiosk dashboards). Standard client-side presentation software traditionally relies on static markdown/json data bundled at build time; dynamic client-side `localStorage` CRUD with JSON import introduces runtime deserialization boundaries uncommon in purely read-only slide decks.

## 3. Tech Stack and Deployment Paths
- **Framework & Libraries**: React 19 (`^19.3.1`), Vite (`^8.3.5`), Tailwind CSS v4 (`^4.3.3`), GSAP (`^3.15.0`), Lenis (`^1.3.27`), Lucide React (`^1.61.0`).
- **Deployment Models**: Static site bundle (`npm run build` -> `dist/`) deployable to any static web host (GitHub Pages, Vercel, Netlify, or local offline web server / file origin).
- **Build / Test Capabilities**: Offline deterministic build (`npm run build`) runs without external network dependencies.

## 4. Entry Surfaces and Data Sinks
- **Entry Surfaces**:
  - JSON Backup Import: `handleImportJSON` parsing raw text input from user textarea.
  - Admin Drawer Form Inputs: Inputs for contestant name, role, division, bio, tintColor, log title, date, month, activity description, and image URL.
  - Search & Filter Controls: Substring query string for filtering log titles and descriptions.
  - Browser Storage: `localStorage.getItem(...)` executed during initial React state hydration.
  - Keyboard Events: `window.addEventListener('keydown')` listening for hotkeys (`1`-`5`, `Ctrl+M`, `Ctrl+A`, `<`/`>`).
- **Data Sinks**:
  - React DOM Rendering: Standard JSX text nodes (`{m.name}`, `{log.title}`) automatically escaped by React.
  - Image Element Attributes: `<img src={log.imageUrl} />` with error fallback handling.
  - State Persistence: `localStorage.setItem(...)` saving serialized state.
  - File Download Anchor: `a.setAttribute('href', dataStr)` for JSON export.

## 5. Trust Boundaries and Source-Visible Controls
1. **User JSON Input -> Application State & Storage**:
   - Boundary: Untrusted JSON string parsed into internal JavaScript objects.
   - Visible Control: `JSON.parse(jsonInputText)` inside `try/catch` block, followed by basic `Array.isArray()` checks. (Control gap: object schema and nullity are not checked, allowing state corruption).
2. **Viewer / Audience -> Admin Privilege Boundary**:
   - Boundary: Transition from read-only presentation viewing to data mutation.
   - Visible Control: Hidden UI trigger (gear icon) and keyboard shortcut (`Ctrl+A`/`Ctrl+M`). (Control gap: no passphrase, session, or cryptographic token gates administrative state transitions).
3. **External Asset Loading -> Client Network Origin**:
   - Boundary: Outbound network request to Unsplash image CDN (`https://images.unsplash.com`).
   - Visible Control: Preconnect links in `index.html`; `onError` handler hiding broken images.

## 6. Repository-Relative Starting Paths
- `src/App.jsx` (L30-L100: Initial state definitions & storage keys; L535-L565: LocalStorage initialization; L660-L750: Admin state; L1350-L1400: Export/import and data handlers; L2075-L2105: Log rendering and image sink)
- `index.html` (L1-L22: HTML shell, fonts, scroll restoration script)
- `package.json` (L1-L25: Project dependencies and build scripts)

## 7. Prior Coverage & Gap Ledger
- This is run 1 (`run-1`) for repository `laporan-magang`. No prior ledger exists.
- Profile: `quick` with standard sandboxed-source-and-local-only inspection policy.

## 8. Selected Companion Files
- `CLIENT-SIDE.md`: Single-page app architecture, DOM rendering, `localStorage` lifecycle, and browser storage boundaries.
- `ATTACK-CLASSES.md`: General attack classes covering Injection, Access Control, and Resource/File Handling.
- `DATA-ISOLATION-AND-LIFECYCLE.md`: State backup/export/import mechanisms and data persistence lifecycles.
- `SUPPLY-CHAIN-AND-RELEASE.md`: Third-party npm dependencies and build verification (`npm audit` clean).
