# Detailed Vulnerability Analysis — Laporan Magang PKL

This document provides exhaustive, source-grounded technical evidence, step-by-step reproduction instructions, and remediation specifications for all confirmed `MEDIUM` and higher severity findings identified in `run-1`.

---

## Finding: CLIENT-JSON-DESERIALIZATION-DOS-001

### 1. Title & Classification
- **Title:** Unvalidated JSON Import and Deserialization Leads to Persistent Client-Side Denial of Service (Application Brick)
- **Vulnerability Type:** CWE-502 (Deserialization of Untrusted Data) / CWE-754 (Improper Check for Unusual or Exceptional Conditions) / Client-Side State Corruption
- **Severity Rating:** **MEDIUM**
  - Likelihood: `medium`
  - Impact: `medium`
  - Overall Severity: `medium`
  - Confidence: `high`

---

### 2. Ordered Source Trace & Evidence

```text
[1. Entrypoint]
File: src/App.jsx:1370-1373 (handleImportJSON)
Description: User inputs arbitrary JSON text into textarea and triggers handleImportJSON.
             JSON.parse(jsonInputText) successfully parses the text into an object without schema validation.

[2. Propagation 1]
File: src/App.jsx:1374-1376 (handleImportJSON)
Description: The handler only checks 'Array.isArray(parsed.members) && parsed.members.length > 0'.
             It fails to check if elements are non-null or match the Member schema.
             setMembers(parsed.members) commits the unvalidated array into React component state.

[3. Propagation 2]
File: src/App.jsx:704-710 (useEffect - localStorage sync)
Description: An effect hook listens for changes to 'members' state and immediately persists it:
             localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(members));
             The corrupted array is now permanently committed to browser persistence.

[4. Sink]
File: src/App.jsx:694 (App render body)
Description: During the next component render pass:
             const activeMember = members.find((m) => m.id === selectedMemberId) || members[0] || ...
             Because members contains null, 'm.id' attempts property access on null, throwing:
             Uncaught TypeError: Cannot read properties of null (reading 'id')
             The entire React fiber unmounts with a blank screen.
```

#### Supporting Source Evidence Lines
- [`src/App.jsx:1370-1389`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L1370-L1389):
  ```javascript
  const handleImportJSON = () => {
    if (!jsonInputText.trim()) return;
    try {
      const parsed = JSON.parse(jsonInputText);
      if (Array.isArray(parsed.members) && parsed.members.length > 0) {
        setMembers(parsed.members);
      }
      if (Array.isArray(parsed.logs)) {
        setLogs(parsed.logs);
      }
      if (Array.isArray(parsed.projects)) {
        setProjects(parsed.projects);
      }
      setJsonInputText('');
      showToast('Data JSON berhasil di-import dan disinkronkan!');
    } catch (err) {
      console.error('Import error:', err);
      showToast('Format JSON tidak valid!', 'error');
    }
  };
  ```
- [`src/App.jsx:537-544`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L537-L544):
  ```javascript
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });
  ```
- [`src/App.jsx:694`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L694):
  ```javascript
  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0] || {
    name: 'Operator PKL',
    role: 'DIVISI KEDINASAN',
    division: 'Ditjen Kuathan Kemhan',
    buildType: 'MEDIUM BUILD',
    bio: 'Menampilkan data logbook dan dokumentasi PKL Ditjen Kuathan Kemhan.',
    tintColor: '#facc15'
  };
  ```

---

### 3. Dummy Principals and Affected Resources
- **Dummy Attacker:** An untrusted peer, competitor, or corrupted export generator providing a poisoned JSON backup string.
- **Affected Principal:** Legitimate presenter, student intern, or evaluator.
- **Affected Resource:** Browser `localStorage` storage key `the_finals_pkl_kemhan_v4` and the React rendering lifecycle of the application.

---

### 4. Native Reproduction & Execution Instructions

1. **Start Local Application:**
   Run the dev server or build preview:
   ```bash
   npm run preview
   ```
2. **Open Application in Browser:**
   Navigate to `http://localhost:4173` (or the active local Vite preview URL).
3. **Open Admin Drawer:**
   Click the gear icon in the navigation bar or press keyboard shortcut `Ctrl+A` or `Ctrl+M`.
4. **Navigate to Data Management Tab:**
   Click the **"Backup"** (or "Data & Backup") tab.
5. **Inject Poisoned Payload:**
   Paste the following minimal reproduction payload into the JSON textarea:
   ```json
   {
     "members": [null]
   }
   ```
6. **Trigger Deserialization:**
   Click the **"Import JSON"** button.
7. **Observe Immediate Crash:**
   The UI crashes immediately with a blank screen. Open Developer Tools (F12) Console:
   ```text
   Uncaught TypeError: Cannot read properties of null (reading 'id')
       at App (App.jsx:694:38)
   ```
8. **Observe Persistence Across Reloads (Application Lockout):**
   Perform a normal refresh (F5) or hard refresh (Ctrl+F5). The page remains completely blank because `localStorage` immediately re-hydrates `[null]` during component initialization, crashing the component before any UI or recovery buttons can render.

---

### 5. Invariant Analysis & Security Boundary
- **Expected Invariant:**
  User-supplied JSON input must never cause persistent denial of service or compromise client application availability across reloads.
- **Observed Violation:**
  State is mutated and committed to storage without asserting element-level type safety, resulting in an unrecoverable client-side loop of render failures.

---

### 6. Smallest Effective Source Fix

#### Step 1: Validate and Sanitize in `handleImportJSON`
In [`src/App.jsx:1370-1389`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L1370-L1389), replace raw array assignment with strict filtering:

```javascript
const handleImportJSON = () => {
  if (!jsonInputText.trim()) return;
  try {
    const parsed = JSON.parse(jsonInputText);
    
    // Validate members: must be an array of non-null objects with id and name strings
    if (Array.isArray(parsed.members)) {
      const validMembers = parsed.members.filter(
        (m) => m && typeof m === 'object' && typeof m.id === 'string' && typeof m.name === 'string'
      );
      if (validMembers.length > 0) {
        setMembers(validMembers);
      } else {
        throw new Error('Data anggota (members) tidak memiliki format yang valid!');
      }
    }
    
    // Validate logs
    if (Array.isArray(parsed.logs)) {
      const validLogs = parsed.logs.filter(
        (l) => l && typeof l === 'object' && typeof l.id === 'string' && typeof l.title === 'string'
      );
      setLogs(validLogs);
    }
    
    // Validate projects
    if (Array.isArray(parsed.projects)) {
      const validProjects = parsed.projects.filter(
        (p) => p && typeof p === 'object' && typeof p.id === 'string' && typeof p.title === 'string'
      );
      setProjects(validProjects);
    }

    setJsonInputText('');
    showToast('Data JSON berhasil di-import dan disinkronkan!');
  } catch (err) {
    console.error('Import error:', err);
    showToast(err.message || 'Format JSON tidak valid!', 'error');
  }
};
```

#### Step 2: Add Defensive Storage Hydration
In [`src/App.jsx:537-562`](file:///C:/IMPORTANT_cOde/laporan-magang/src/App.jsx#L537-L562), ensure that corrupt stored state falls back to initial templates:

```javascript
const [members, setMembers] = useState(() => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
    if (!saved) return INITIAL_MEMBERS;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_MEMBERS;
    const valid = parsed.filter((m) => m && typeof m === 'object' && typeof m.id === 'string');
    return valid.length > 0 ? valid : INITIAL_MEMBERS;
  } catch {
    return INITIAL_MEMBERS;
  }
});
```

#### Step 3: Implement Root Error Boundary
Wrap `<App />` in a React Error Boundary with an emergency `localStorage.clear()` recovery button in [`src/main.jsx`](file:///C:/IMPORTANT_cOde/laporan-magang/src/main.jsx).
