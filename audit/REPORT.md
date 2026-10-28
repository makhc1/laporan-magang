# Security Audit Report — Laporan Magang PKL (Ditjen Kuathan Kemhan)

**Audit Run ID:** `run-1`  
**Target Repository:** `C:\IMPORTANT_cOde\laporan-magang` (`laporan-magang`)  
**Audit Profile:** `quick` (Single-wave bounded audit with source-grounded verification)  
**Execution Policy:** `sandboxed-source-and-local-only` (Offline static source analysis & bounded local tests, zero remote endpoint probing)  
**Source Ref:** `local_directory`  
**Budget Allocated / Spent:** 10 / 4 agents  
**Status:** `complete` (All ledger units resolved and validated)

---

## 1. Executive Summary & Security Posture

The reviewed codebase is an interactive Single-Page Application (SPA) built with React 19, Vite, Tailwind CSS v4, GSAP, and Lenis. Its operational objective is to serve as a digital logbook and presentation defense platform for student interns assigned to the Directorate General of Defense Potential (Ditjen Kuathan), Ministry of Defense of the Republic of Indonesia (Kemhan RI).

Because the application runs entirely client-side without an active backend web server or remote database, traditional server-side web vulnerabilities (such as SQL injection, server-side remote code execution, server-side SSRF, and cross-site request forgery) are **not applicable**. React 19's native JSX escaping further eliminates standard stored and reflected Cross-Site Scripting (XSS) on text nodes.

However, the audit identified critical client-side state boundaries:
1. **Unvalidated JSON Deserialization (Medium Severity):** The backup import feature parses arbitrary JSON text and directly assigns it to React state. If the imported payload contains `null` items or malformed objects, subsequent render cycles throw unhandled TypeErrors. Because state is automatically mirrored to `localStorage`, the corrupted data persists across page reloads (including hard refresh), completely bricking the application in the victim's browser session until storage is manually cleared.
2. **Missing Administrative Access Control (Low Severity):** The administration drawer (which permits creating, editing, and deleting team logs, member profiles, and projects) is unprotected by any password, PIN, or cryptographic authorization token, relying solely on client-side UI toggles and keyboard shortcuts (`Ctrl+A`/`Ctrl+M`).
3. **Outbound Metadata Leakage via External CDNs (Needs Validation):** Default documentation entries load preview images from Unsplash CDNs (`images.unsplash.com`). In an isolated or air-gapped military network, these requests will fail or leak client IP addresses and referrer headers to third-party providers.

---

## 2. Confirmed Findings Summary

| Severity | Fingerprint | Title | Affected Boundary | Observed Result |
| :--- | :--- | :--- | :--- | :--- |
| **MEDIUM** | `CLIENT-JSON-DESERIALIZATION-DOS-001` | Unvalidated JSON Import and Deserialization Denial of Service | `handleImportJSON` $\rightarrow$ `localStorage` $\rightarrow$ React Render Tree | Malformed JSON imports cause unhandled `TypeError` crashes, persistently locking users out across page reloads. |
| **LOW** | `CLIENT-AUTH-ADMIN-BYPASS-001` | Unrestricted Client-Side Administrative State Manipulation | Viewer Mode $\rightarrow$ Admin Drawer Privilege Boundary | Any viewer or kiosk user can access the admin drawer via UI/hotkeys and delete or overwrite presentation data. |

---

## 3. Confirmed Vulnerability Details

### [MEDIUM] CLIENT-JSON-DESERIALIZATION-DOS-001: Unvalidated JSON Import and Deserialization Denial of Service

- **Location:** [`src/App.jsx:1370-1389`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L1370-L1389) and [`src/App.jsx:535-565`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L535-L565)
- **Lower-Trust Principal:** Any user or attacker providing a `.json` backup file or pasting JSON string into the Admin import field.
- **Affected Principal / Resource:** Legitimate presenter / evaluator and application availability in the client browser session.
- **Preconditions / Conditions:** User interaction (pasting or importing a malformed JSON string into the Backup & Data textarea and clicking "Import JSON").
- **Vulnerability Mechanics & Root Cause:**
  In `src/App.jsx`, the `handleImportJSON` handler parses user-supplied text with `JSON.parse(jsonInputText)`. While it checks `Array.isArray(parsed.members)`, it performs no element-level schema validation. If `parsed.members` contains `[null]` or objects without mandatory fields (`id`, `name`):
  1. `setMembers(parsed.members)` updates the React state.
  2. The synchronization hook (`useEffect` at line 707) immediately serializes this array into `localStorage` under `the_finals_pkl_kemhan_v4`.
  3. The next component render executes:
     ```javascript
     const activeMember = members.find((m) => m.id === selectedMemberId) || members[0] || ...
     ```
     When `m` is `null`, accessing `m.id` throws an unhandled `TypeError: Cannot read properties of null (reading 'id')`.
  4. The React root component unmounts with a blank screen.
  5. Because the corrupted array remains stored in `localStorage`, subsequent browser reloads reload the corrupted data during `useState` initialization (`localStorage.getItem(...)`), permanently locking the user out.
- **Demonstrated Impact:** Complete denial of service and state lockout for the application on the victim's device, requiring manual developer tools intervention to clear storage.
- **Remediation Strategy:**
  1. Add strict item sanitization in `handleImportJSON` to ensure each item is a valid non-null object with non-empty string properties.
  2. Implement defensive fallbacks in `localStorage` hydration so malformed stored data reverts safely to `INITIAL_MEMBERS` / `INITIAL_LOGS`.
  3. Wrap the root application in a React Error Boundary with an automated "Reset Storage" recovery button.

---

### [LOW] CLIENT-AUTH-ADMIN-BYPASS-001: Unrestricted Client-Side Administrative State Manipulation

- **Location:** [`src/App.jsx:535`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L535), [`src/App.jsx:660`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L660), [`src/App.jsx:735`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L735)
- **Lower-Trust Principal:** Audience members, public visitors, or kiosk attendees viewing the presentation.
- **Affected Principal / Resource:** Presenter data integrity and state persistence.
- **Preconditions / Conditions:** Physical or browser access to the running application.
- **Vulnerability Mechanics & Root Cause:**
  Administrative actions (creating logs, modifying member profiles, editing projects, and resetting all data via `handleResetDefaultData`) are controlled purely by client-side React boolean state (`activeMode === 'admin'`). There is no passphrase challenge, PIN code, or authorization check gating this transition. Anyone who clicks the gear icon or presses `Ctrl+A` / `Ctrl+M` can access the drawer and delete or overwrite the entire logbook.
- **Demonstrated Impact:** Unauthorized modification or deletion of presentation data on shared kiosks or public display laptops. Because changes are client-local and not synced to a central server, impact is restricted to `LOW`.
- **Remediation Strategy:**
  Implement an optional local administrator PIN or passphrase prompt before toggling `activeMode` to `'admin'` or executing destructive operations (`handleResetDefaultData`).

---

## 4. Needs Validation Leads

| Fingerprint | Title | Trace Location | Decisive Blocker | Local Next Step | Deployment Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PRIVACY-UNSPLASH-REFERRER-LEAK-001` | Outbound Referrer & IP Leakage via External Unsplash Assets | [`src/App.jsx:100`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L100), [`src/App.jsx:2085`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L2085) | Target network topology (air-gapped defense network vs public internet) cannot be determined from source alone. | Bundle local fallback mock images in `public/` directory. | Verify whether Kemhan presentation laptops operate under air-gap isolation or allow outbound CDN traffic. |

---

## 5. Refuted & Rejected Candidates

| Fingerprint | Candidate Title | Reason for Rejection |
| :--- | :--- | :--- |
| `CLIENT-STORED-XSS-REJECTED-001` | Stored Cross-Site Scripting via Imported Log Descriptions | Refuted by architecture. React 19 automatically escapes all text nodes rendered via `{log.description}` and `{m.name}`. No `dangerouslySetInnerHTML`, `innerHTML`, or executable sinks are reachable. Bounded testing confirms `<script>` and `<img>` tags render as harmless string literals. |

---

## 6. Hardening Recommendations & Positive Patterns

### Positive Security Patterns Found in Source
- **Zero Third-Party Runtime Scripts:** No external analytics, ad trackers, or unpinned remote script tags exist in `index.html`.
- **Clean Dependency Tree:** `npm audit` reported **0 vulnerabilities** across all direct and transitive dependencies (`react@19.3.1`, `vite@8.3.5`, `gsap@3.15.0`, `lenis@1.3.27`).
- **No Insecure Sinks:** The application avoids `eval()`, `new Function()`, `dangerouslySetInnerHTML`, and `document.write`.
- **Safe Data Export:** Exporting JSON via `data:text/json;charset=utf-8` using an anchor tag avoids server-side storage risks.

### Hardening Recommendations
1. **Content Security Policy (CSP):**
   Add a strict CSP `<meta>` tag to `index.html` to prevent inline script execution and enforce default resource constraints:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https://images.unsplash.com; font-src https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self';">
   ```
2. **Offline Asset Bundling:**
   Replace external Unsplash URLs with local optimized images in `public/assets/` to ensure 100% offline functionality in secure defense environments.
3. **React Error Boundary:**
   Wrap `<App />` in a React Error Boundary component in `src/main.jsx` with an automatic "Emergency Storage Reset" button.

---

## 7. Coverage Ledger Summary

- **Total Ledger Units:** 4
- **Covered (Clean):** 1 unit (`package.json` supply chain & dependency manifest)
- **Candidate (Confirmed / Needs Validation / Disproved):** 3 units
- **Blocked / Deferred / Out-of-Scope:** 0 units
- **Final Coverage Critic:** Clean pass across all in-scope entry surfaces and trust boundaries.
