## 2024-05-03 - Dynamic ARIA Attributes on Icon-Only Buttons
**Learning:** Managing dynamic state in ARIA attributes (`aria-expanded`, `aria-pressed`) along with descriptive `aria-label`s for icon-only buttons is critical for screen reader users in this design system, as visual cues (like '★' vs '☆' or a drawer opening) aren't communicated otherwise.
**Action:** Always ensure interactive elements that toggle state or lack visible text explicitly manage their corresponding ARIA attributes.
