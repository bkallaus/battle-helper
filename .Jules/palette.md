## 2024-05-11 - Contextual ARIA labels on dynamic grid controls
**Learning:** When building tight, data-dense grids like stat configurators where visual space is premium (using abbreviations like "+1", "-1", "Clr", "Max"), screen reader users lose crucial context because the column header relationship isn't inherently linked to the specific row's buttons.
**Action:** Always inject dynamic row context directly into the `aria-label` for abbreviated control buttons inside grid layouts (e.g., ``aria-label={`Increase ${statName} boost`}`` instead of just leaving it as "+1").
