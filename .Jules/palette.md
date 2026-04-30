## 2024-05-01 - Global focus states & ARIA toggles
**Learning:** Found that custom buttons (like the Team FAB and type toggles) lacked keyboard focus indicators and proper ARIA states for their toggled states. Adding them makes a huge difference for screen reader usability and keyboard navigation without affecting mouse users.
**Action:** Always verify keyboard focus is visible using `:focus-visible` in global CSS and ensure toggle buttons correctly reflect their state with `aria-pressed`.
