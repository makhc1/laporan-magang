# AI AGENT SKILLS & PRACTITIONER GUIDELINES

## 1. Overview
This document outlines the specialized skills, constraints, and behavioral guidelines required for AI coding agents working on the PKL Group Presentation & Logbook web application.

---

## 2. Core Technical Competencies & Skills

### 2.1 React Component & State Engineering
- **Functional Components & Hooks:** Utilize modern functional components with hooks (`useState`, `useEffect`, `useMemo`, `useRef`).
- **Immutability:** Never mutate React state directly; always rely on state setters (`setState`) and immutable update patterns.
- **Derived State:** Prefer calculating values during render using `useMemo` over maintaining redundant state variables.
- **Escape Hatches & Side Effects:** Use `useEffect` strictly for synchronizing with external systems or subscriptions (e.g., Firebase real-time listeners), cleaning up listeners on unmount.

### 2.2 Tailwind CSS Styling & Aesthetic Principles
- **Utility-First Architecture:** Rely entirely on Tailwind CSS utility classes combined with inline style variables (`style={{ ... }}`) for dynamic properties like colors or offsets.
- **Competitive Esports / Agency Theme:** Enforce a high-contrast dark aesthetic (`#090b10`, `#0f0f13`, `#181c26`) paired with energetic accent colors (`#facc15` radiant yellow, `#ef4444` crimson red, `#38bdf8` cyan blue, `#10b981` emerald green, `#a855f7` cyber purple).
- **Responsive Design:** Ensure every grid, flex container, and text element scales cleanly from mobile screens up to 4K projector displays.

### 2.3 SVG & UI Vector Handling
- **Lightweight Inline SVGs:** Avoid external raster dependencies (`.png`, `.jpg`) for core UI illustrations and character avatars. Use clean, scalable vector paths wrapped in responsive `viewBox` containers.
- **Interactive State Styling:** Apply active glow filters (`drop-shadow`, ring highlights, translate elevations) when elements are selected or hovered.

---

## 3. Agent Execution Rules & Guardrails

1. **Plan First:** Before modifying complex component logic or state handlers, outline the proposed changes step by step.
2. **Single-File Compliance:** Respect the single-file artifact mandate for web applications (`App.jsx` containing all UI, state, and Firebase integration logic).
3. **Robust Fallbacks:** Ensure all array mappings (`members`, `logs`, `projects`) include safe fallback seed data so the application never renders blank or crashes on initial load.
4. **Clean Code Discipline:** Maintain clear variable names in camelCase, PascalCase for components, and descriptive event handlers prefixed with `handle`.