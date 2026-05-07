## 2025-02-12 - Accessible FAB Drawer
**Learning:** Custom interactive components like floating action buttons opening side drawers need careful ARIA state management (`aria-expanded`, `aria-controls`) to inform screen readers of their purpose and state, especially when existing visual cues (like an icon) aren't semantic.
**Action:** Always pair `aria-expanded` and `aria-controls` on elements triggering custom drawers or popovers. Ensure all icon-only interactive elements inside the drawer (like close or remove buttons) have descriptive `aria-label`s.
