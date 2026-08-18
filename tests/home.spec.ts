import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/'); // Assuming the home page is at the root path
	});

	test('should display the main title "Giraldo Sem Pavor"', async ({ page }) => {
		// Check for the main title on the page
		const titleElement = page.getByRole('heading', { name: 'Giraldo Sem Pavor' });
		await expect(titleElement).toBeVisible();
	});

	test('should display all required sections', async ({ page }) => {
		const expectedSections = [
			'A nossa Missão',
			'Como Funciona?',
			'Vantagens',
			'Como Começou',
			'Onde Nos Encontrar'
		];

		for (const section of expectedSections) {
			// Check for the visibility of each section title
			await expect(page.getByRole('heading', { name: section })).toBeVisible();
		}
	});

	test('should display all contact information', async ({ page }) => {
		const expectedContacts = {
			address: 'Morada: Évora B. Malagueira R. do Sarrabulho 4',
			phone: 'Telefone: 266737970, 963022787',
			email: 'Email: geral@cchegiraldosp.pt'
		};

		// Locate the footer component first for better specificity
		const footerLocator = page.locator('footer');

		const address = footerLocator.locator('address');

		for (const [contactType, expectedValue] of Object.entries(expectedContacts)) {
			// Check for the visibility of each piece of contact info within the footer's address tag
			await expect(address).toContainText(expectedValue);
		}
	});
});
