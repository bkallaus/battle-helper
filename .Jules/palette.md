
## 2024-05-18 - Input Association Accessibility
**Learning:** Found that custom search inputs (like 'Species', 'Nature', and Move filter) and deeply nested control structures lacking direct `<label>` tags created a significant barrier for screen readers in complex forms (VGC Tactical HUD). This was noticeable since many input fields function effectively as comboboxes or search boxes and rely purely on visual proximity and placeholder text for context.
**Action:** Always ensure that every `<input>` uses a direct `id` referenced by a `<label htmlFor="id">` or explicitly has an `aria-label` when a visible label isn't practical or lacks one. Ensure icon-only clear buttons ("✕") provide full context via `aria-label` (e.g., "Clear species" instead of "Clear").

## 2025-05-24 - Grouping Toggle Button Clusters
**Learning:** In applications with grids of custom interactive toggle buttons (like the Type Chart calculator), individual buttons lack collective context for screen reader users. The relationship between the label (e.g., "Attacking Type") and the buttons is lost without proper grouping.
**Action:** When working with clusters of custom interactive buttons (e.g., UI toggle grids), group them semantically using `role="group"` and reference them with `aria-labelledby` on their container so screen readers understand the collective action. Add `aria-pressed` to individual toggle buttons to indicate active state.

## 2024-05-18 - Missing semantic grouping in repetitive interactive elements
**Learning:** Custom UI configurations that have repetitive clusters of interactive buttons (like the `stat-btn`s in the Pokemon config panel for EVs and Boosts, or the tab layout `tab-btn`) are often missing a semantic grouping context like `role="group"`. This makes it difficult for screen reader users to infer what cluster of controls they are interacting with.
**Action:** When inspecting clusters of interactive elements, verify they are grouped conceptually with `role="group"` and given an appropriate `aria-label` (e.g. `aria-label="HP EV controls"`). Make sure repeated generic labels (like "Clr" and "Max") have dynamic `aria-label`s reflecting their specific target.
