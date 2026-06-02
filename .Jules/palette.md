## 2024-05-18 - Input Association Accessibility
**Learning:** Found that custom search inputs (like 'Species', 'Nature', and Move filter) and deeply nested control structures lacking direct `<label>` tags created a significant barrier for screen readers in complex forms (VGC Tactical HUD). This was noticeable since many input fields function effectively as comboboxes or search boxes and rely purely on visual proximity and placeholder text for context.
**Action:** Always ensure that every `<input>` uses a direct `id` referenced by a `<label htmlFor="id">` or explicitly has an `aria-label` when a visible label isn't practical or lacks one. Ensure icon-only clear buttons ("✕") provide full context via `aria-label` (e.g., "Clear species" instead of "Clear").

## 2025-05-24 - Grouping Toggle Button Clusters
**Learning:** In applications with grids of custom interactive toggle buttons (like the Type Chart calculator), individual buttons lack collective context for screen reader users. The relationship between the label (e.g., "Attacking Type") and the buttons is lost without proper grouping.
**Action:** When working with clusters of custom interactive buttons (e.g., UI toggle grids), group them semantically using `role="group"` and reference them with `aria-labelledby` on their container so screen readers understand the collective action. Add `aria-pressed` to individual toggle buttons to indicate active state.## 2024-05-31 - [Adding Semantic Roles to Tablists and Form Control Groups]
**Learning:** When standard HTML buttons and divs are used to build interactive components like tab navigations or clustered stat controls, adding semantic roles (`role="tablist"`, `role="tab"`, `role="group"`) and dynamic ARIA attributes drastically improves screen reader context.
**Action:** I will proactively look for opportunities to upgrade custom structural components with semantic ARIA roles and labels, especially in complex dashboards.

## 2026-06-02 - Filter Empty States and User Recovery
**Learning:** When users filter dynamic lists (like the move list), they can easily typo or enter queries that yield no results, leaving a blank space if not handled. A blank space provides no feedback and leaves the user hanging.
**Action:** Always render a distinct empty state UI with a clear call-to-action (like 'Clear Filter') when a filter yields no results but the underlying dataset is non-empty. Use `role="status"` and `aria-live="polite"` so screen readers announce the empty state automatically without focus loss.
