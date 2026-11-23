import { expect, test } from '@playwright/test';

import { HomePage } from './pages/homePage';

test('has title', async ({ page }) => {
	await new HomePage(page).goto();

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Giraldo Sem Pavor/);
});
