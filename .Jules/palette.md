## 2025-03-01 - Add ARIA Labels to Icon Buttons
**Learning:** Found multiple icon-only buttons (like the FAB, close buttons, and remove buttons) and interactive state indicators (like the move star toggle) in App.tsx that were missing ARIA labels and state attributes, affecting screen reader accessibility.
**Action:** Applied `aria-label`, `aria-expanded`, `aria-controls`, and `aria-pressed` to these elements to make their purpose and state clear to assistive technologies.
