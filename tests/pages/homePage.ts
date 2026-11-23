import { Locator, Page } from '@playwright/test';

export class HomePage {
	readonly page: Page;
	readonly title: Locator;
	readonly contactAddress: Locator;

	constructor(page: Page) {
		this.page = page;
		this.title = page.getByRole('heading', { name: 'Giraldo Sem Pavor' });
		this.contactAddress = page.locator('footer').locator('address');
	}

	async goto() {
		await this.page.goto('/');
	}

	sectionHeading(name: string) {
		return this.page.getByRole('heading', { name });
	}
}
