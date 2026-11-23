import { expect, test } from '@playwright/test';

import { ProjectItem, ProjectsPage } from '../pages/projectsPage';

// Adjust these to match the data available in the API the app points to
const SEARCH_TERM = 'evora';
const DISTRICT = 'Évora';
const TYPOLOGY = 'T3';
// Where the upper price thumb is dropped, as a fraction of the slider width
const PRICE_MAX_FRACTION = 0.5;

// Mirrors PROJECTS_PAGE_SIZE in components/projects/projectInventory/utils.ts
const PROJECTS_PAGE_SIZE = 4;

// The listed cards should be exactly the projects the API returned, in the same order
const expectCardsToMatch = async (projectsPage: ProjectsPage, projects: ProjectItem[]) => {
	await expect(projectsPage.cardTitles).toHaveText(projects.map((project) => project.title ?? ''));
};

test.describe.skip('Projects Page', () => {
	let projectsPage: ProjectsPage;

	test.beforeEach(async ({ page }) => {
		projectsPage = new ProjectsPage(page);
		await projectsPage.goto();
	});

	test('should be able to load project page and see current projects', async () => {
		await expect(projectsPage.heading).toBeVisible();

		await expect(projectsPage.cards.first()).toBeVisible();
		expect(await projectsPage.cards.count()).toBeLessThanOrEqual(PROJECTS_PAGE_SIZE);

		// Every card shows its title, district and a link to the project details
		for (const card of await projectsPage.allCards()) {
			await expect(card.title).not.toBeEmpty();
			await expect(card.district).toContainText('Distrito:');
			await expect(card.detailsButton).toBeVisible();
		}
	});

	test('should be able to filter projects by name using the search bar', async ({ page }) => {
		const projectsResponse = projectsPage.waitForProjects(
			(params) => params.get('title') === SEARCH_TERM
		);

		await projectsPage.searchInput.fill(SEARCH_TERM);

		const { projects } = await projectsResponse;
		expect(projects.length).toBeGreaterThan(0);

		await expect(page).toHaveURL(new RegExp(`[?&]q=${SEARCH_TERM}`));
		for (const project of projects) {
			expect(project.title?.toLowerCase()).toContain(SEARCH_TERM.toLowerCase());
		}
		await expectCardsToMatch(projectsPage, projects);
	});

	test('should be able to filter projects using the district select', async ({ page }) => {
		const projectsResponse = projectsPage.waitForProjects(
			(params) => params.get('district') === DISTRICT
		);

		await projectsPage.selectDistrict(DISTRICT);

		const { projects } = await projectsResponse;
		expect(projects.length).toBeGreaterThan(0);

		await expect(projectsPage.districtDropdown).toHaveText(DISTRICT);
		await expect(page).toHaveURL(new RegExp(`[?&]district=${encodeURIComponent(DISTRICT)}`));
		for (const project of projects) {
			expect(project.district).toBe(DISTRICT);
		}
		await expectCardsToMatch(projectsPage, projects);
		for (const card of await projectsPage.allCards()) {
			await expect(card.district).toHaveText(`Distrito: ${DISTRICT}`);
		}
	});

	test('should be able to filter by price and typology and district', async ({ page }) => {
		await projectsPage.selectDistrict(DISTRICT);

		await projectsPage.filtersButton.click();
		await projectsPage.typologyCheckbox(TYPOLOGY).check();
		await projectsPage.priceCheckbox.check();

		// Narrow the price range so it is smaller than the full range
		await projectsPage.dragMaxPriceTo(PRICE_MAX_FRACTION);

		const projectsResponse = projectsPage.waitForProjects(
			(params) =>
				params.get('district') === DISTRICT &&
				params.getAll('typologies').includes(TYPOLOGY) &&
				params.has('priceMin') &&
				params.has('priceMax')
		);

		await projectsPage.applyFiltersButton.click();

		const { params, projects } = await projectsResponse;
		expect(projects.length).toBeGreaterThan(0);
		const priceMin = Number(params.get('priceMin'));
		const priceMax = Number(params.get('priceMax'));

		await expect(page).toHaveURL(new RegExp(`[?&]typologies=${TYPOLOGY}`));
		await expect(page).toHaveURL(new RegExp(`[?&]priceMin=${priceMin}`));
		await expect(page).toHaveURL(new RegExp(`[?&]priceMax=${priceMax}`));

		// The API only returns projects where the same typology matches both the typology and the price
		for (const project of projects) {
			expect(project.district).toBe(DISTRICT);
			const matchingTypology = project.typologies?.find(
				(typology) =>
					typology.typology === TYPOLOGY &&
					typology.price !== undefined &&
					typology.price >= priceMin &&
					typology.price <= priceMax
			);
			expect(
				matchingTypology,
				`${project.title} has a ${TYPOLOGY} within the price range`
			).toBeDefined();
		}
		await expectCardsToMatch(projectsPage, projects);
	});
});
