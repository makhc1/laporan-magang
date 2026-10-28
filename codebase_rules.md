# CODEBASE RULES & STANDARDS

## 1. Single-File / Clean Architecture Mandate

* Keep components modular and readable. Ensure all styling relies on Tailwind CSS utility classes rather than bulky external CSS files.

## 2. State & Data Handling

* Never mutate state directly; always use React state setters.

* Ensure all logbook and project arrays have fallback seed data so the application never renders blank or crashes on initial load.

## 3. Naming Conventions

* Component names in PascalCase (`SquadSection`, `LogbookTimeline`).

* State handlers prefixed with `handle` (`handleSaveLog`, `handleSelectMember`).

* Utility functions in camelCase.

## 4. Documentation & Comments

* Keep code clean with descriptive variable names. Add comments for complex filtering or state mapping logic.