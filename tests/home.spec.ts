import { expect, test } from '@playwright/test';

import { HomePage } from './pages/homePage';

test.describe('Home Page', () => {
	let homePage: HomePage;

	test.beforeEach(async ({ page }) => {
		homePage = new HomePage(page);
		await homePage.goto();
	});

	test('should display the main title "Giraldo Sem Pavor"', async () => {
		await expect(homePage.title).toBeVisible();
	});

	test('should display all required sections', async () => {
		const expectedSections = [
			'A nossa Missão',
			'Como Funciona?',
			'Vantagens',
			'Como Começou',
			'Onde Nos Encontrar'
		];

		for (const section of expectedSections) {
			await expect(homePage.sectionHeading(section)).toBeVisible();
		}
	});

	test('should display all contact information', async () => {
		const expectedContacts = [
			'Morada: Évora B. Malagueira R. do Sarrabulho 4',
			'Telefone: 266737970, 963022787',
			'Email: geral@cchegiraldosp.pt'
		];

		for (const contact of expectedContacts) {
			await expect(homePage.contactAddress).toContainText(contact);
		}
	});
});
