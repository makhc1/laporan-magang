# Unresolved Security Leads (Needs Validation) — Laporan Magang PKL

This document inventories candidates where source-code inspection identified a security-sensitive boundary or potential operational risk, but a decisive verdict requires facts regarding the target deployment environment, network infrastructure, or operational policy that are absent from the source repository.

These leads carry **no severity rating** and must not be treated as confirmed vulnerabilities until verified against the target environment.

---

## Lead 1: PRIVACY-UNSPLASH-REFERRER-LEAK-001

### Summary
- **Title:** Potential Outbound Referrer and IP Leakage via External Unsplash Image Assets in Kedinasan Presentation Context
- **Affected Boundary:** Client Browser $\rightarrow$ External CDN (`images.unsplash.com`) Network Boundary
- **Claimed Root Cause:**
  Default activity logs and project showcase cards use hardcoded external image URLs hosted on `https://images.unsplash.com/...`. When rendered, the client browser initiates direct outbound HTTPS GET requests to third-party servers, transmitting the client's public IP address, browser User-Agent, and potentially the host `Referer` header.

### Source Trace & Evidence
```text
[1. Entrypoint]
File: src/App.jsx:100, 111, 122, 133, 146, ...
Description: Static dataset INITIAL_LOGS contains external URLs pointing to images.unsplash.com.

[2. Propagation]
File: src/App.jsx:2082-2084
Description: Log item accordion expansion checks 'if (log.imageUrl)'.

[3. Sink]
File: src/App.jsx:2085
Description: <img src={log.imageUrl} alt={log.title} className="..." onError={...} />
             initiates direct outbound network request from client device.
```

- **Source Reference:** [`src/App.jsx:100`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L100), [`src/App.jsx:2082-2085`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L2082-L2085)

### Decisive Blocker
The source repository does not define the target deployment architecture:
1. If deployed on a standard public web server (e.g., Vercel, GitHub Pages), external image fetching is normal behavior, though adding `referrerpolicy="no-referrer"` is advised.
2. If deployed in an **isolated military intranet (intranet Kemhan) or air-gapped network** where outbound internet access is strictly blocked or prohibited, external asset requests will immediately fail (rendering fallback broken image placeholders) and may trigger security gateway alerts for unauthorized external connection attempts.

### Safe Validation Plan

#### A. Bounded Local Verification (Developer / Operator)
1. Disconnect the local testing machine from the internet (airplane mode or disable network adapter).
2. Start the local server (`npm run preview`) and inspect the presentation.
3. Open Developer Tools Network tab. Verify that Unsplash images fail with `ERR_INTERNET_DISCONNECTED` and confirm whether the UI fallback (`.img-error-fallback`) gracefully displays without layout breakage.
4. Replace remote URLs in `INITIAL_LOGS` with local SVG or local images bundled in the `public/` directory (e.g., `/assets/docs/log-1.jpg`).

#### B. Owner-Observed Deployment Verification (Kemhan IT / Evaluator)
1. Confirm with Ditjen Kuathan Kemhan IT network administrators whether the presentation laptop will be connected to the internet during the evaluation defense or operated in an offline/air-gapped room.
2. If air-gapped, verify that all documentation images are bundled locally within the static build directory.
3. Check if server response headers can include `Referrer-Policy: no-referrer` to prevent host URL disclosure.
