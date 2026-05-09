## 2026-05-09 - Missing ARIA States on Toggle and FAB Buttons
**Learning:** Icon-only toggle buttons (like the ★/☆ Core Move toggle) and Floating Action Buttons (like the My Team 🛡️ button) often have `title` attributes but are missing critical state and control attributes (`aria-pressed`, `aria-expanded`, `aria-controls`).
**Action:** Always verify that interactive elements, especially icon-only buttons with toggling states or those controlling other regions, explicitly declare their state and accessible name.
