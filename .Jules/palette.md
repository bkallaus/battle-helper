## 2024-05-24 - Interactive Accessibility States
**Learning:** State-dependent icon buttons (like 'My Team' toggle and 'Core Move' stars) need dynamic ARIA attributes (e.g., `aria-expanded`, `aria-pressed`) to communicate their current state and purpose effectively to screen readers, especially when visual cues alone represent the state change.
**Action:** Always pair `aria-label` with appropriate state attributes (`aria-expanded`, `aria-pressed`, `aria-controls`) for dynamic toggle buttons and drawers.
