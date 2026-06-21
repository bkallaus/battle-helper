import { test, expect } from '@playwright/test';

test('Focus is restored to move filter input after clearing', async ({ page }) => {
  await page.goto('http://localhost:3000/battle-helper/');

  // Wait for the app to load
  await page.waitForSelector('.app-container');

  // Find the move filter input and type into it
  const filterInput = page.getByRole('textbox', { name: 'Filter moves' });
  await filterInput.fill('earthquake');

  // Verify clear button appears
  const clearBtn = page.getByRole('button', { name: 'Clear move filter' });
  await expect(clearBtn).toBeVisible();

  // Click clear button
  await clearBtn.click();

  // Verify focus returned to the input
  await expect(filterInput).toBeFocused();

  // Test empty state "Clear Filter" button
  await filterInput.fill('nomovesmatchthis');
  const clearFilterBtn = page.getByRole('button', { name: 'Clear move filter to see all moves' });
  await expect(clearFilterBtn).toBeVisible();
  await clearFilterBtn.click();
  await expect(filterInput).toBeFocused();
});

test('Focus is restored to Pokemon config inputs after clearing', async ({ page }) => {
  await page.goto('http://localhost:3000/battle-helper/');
  await page.waitForSelector('.app-container');

  // Test species input clear
  const speciesInput = page.locator('#species-input-p1');
  await speciesInput.fill('Pikachu');
  const clearSpeciesBtn = page.getByRole('button', { name: 'Clear species' }).first();
  await clearSpeciesBtn.click();
  await expect(speciesInput).toBeFocused();

  // Test nature input clear
  const natureInput = page.locator('#nature-input-p1');
  await natureInput.fill('Jolly');
  const clearNatureBtn = page.getByRole('button', { name: 'Clear nature' }).first();
  await clearNatureBtn.click();
  await expect(natureInput).toBeFocused();
});

test('Focus is restored to Type Chart inputs after clearing', async ({ page }) => {
  await page.goto('http://localhost:3000/battle-helper/');
  await page.waitForSelector('.app-container');

  // Go to Type Chart tab
  await page.getByRole('tab', { name: 'Type Chart' }).click();

  // Test defending species input clear
  const defSpeciesInput = page.locator('#defending-species-input');
  await defSpeciesInput.fill('Charizard');
  const clearDefSpeciesBtn = page.getByRole('button', { name: 'Clear defending species' });
  await clearDefSpeciesBtn.click();
  await expect(defSpeciesInput).toBeFocused();
});

test('Focus is restored to Team FAB after closing drawer', async ({ page }) => {
  await page.goto('http://localhost:3000/battle-helper/');
  await page.waitForSelector('.app-container');

  // Open drawer
  const teamFab = page.getByRole('button', { name: 'Toggle My Team drawer' });
  await teamFab.click();

  // Close drawer
  const closeBtn = page.getByRole('button', { name: 'Close My Team drawer' });
  await closeBtn.click();

  // Verify focus on FAB
  await expect(teamFab).toBeFocused();
});
