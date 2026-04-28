
## 2024-04-28 - ARIA labels for icon-only buttons
**Learning:** React elements utilizing emojis or symbols as icon-only buttons without corresponding ARIA tags cause screen readers to announce meaningless literal symbol names rather than the function. Ensuring all icon-only interactions have clear `aria-label` attributes fixes this. Additionally, stateful icon buttons (like toggles and drawers) need `aria-pressed` or `aria-expanded` attributes.
**Action:** Always check interactive icon-only elements for proper ARIA labeling and state communication.
