import { Page, Response, expect, test } from '@playwright/test';

// Adjust these to match the data available in the API the app points to
const SEARCH_TERM = 'evora';
const DISTRICT = 'Évora';
const TYPOLOGY = 'T3';
// Where the upper price thumb is dropped, as a fraction of the slider width
const PRICE_MAX_FRACTION = 0.5;

// Mirrors PROJECTS_PAGE_SIZE in components/projects/projectInventory/utils.ts
const PROJECTS_PAGE_SIZE = 4;

type TypologyDetails = { typology?: string; price?: number };
type ProjectItem = { title?: string; district?: string; typologies?: TypologyDetails[] };
type ProjectsPage = { content?: ProjectItem[] };

// Waits for the client-side request to the current projects endpoint whose params satisfy the predicate
const waitForProjectsResponse = (page: Page, predicate: (params: URLSearchParams) => boolean) =>
	page.waitForResponse((response: Response) => {
		const url = new URL(response.url());
		return url.pathname.endsWith('/project/current') && predicate(url.searchParams);
	});

const parseProjects = async (response: Response): Promise<ProjectItem[]> => {
	expect(response.ok()).toBeTruthy();
	const body = (await response.json()) as ProjectsPage;
	return body.content ?? [];
};

const projectCards = (page: Page) => page.locator('.MuiCard-root');

// The listed cards should be exactly the projects the API returned, in the same order
const expectCardsToMatch = async (page: Page, projects: ProjectItem[]) => {
	await expect(projectCards(page).locator('.MuiCardHeader-title')).toHaveText(
		projects.map((project) => project.title ?? '')
	);
};

const selectDistrict = async (page: Page, district: string) => {
	await page.locator('#Districtdropdown').click();
	await page.getByRole('menuitem', { name: district, exact: true }).click();
};

test.describe.skip('Projects Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/projects');
	});

	test('should be able to load project page and see current projects', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Projetos a Decorrer' })).toBeVisible();

		const cards = projectCards(page);
		await expect(cards.first()).toBeVisible();
		expect(await cards.count()).toBeLessThanOrEqual(PROJECTS_PAGE_SIZE);

		// Every card shows its title, district and a link to the project details
		for (const card of await cards.all()) {
			await expect(card.locator('.MuiCardHeader-title')).not.toBeEmpty();
			await expect(card.locator('.MuiCardHeader-subheader')).toContainText('Distrito:');
			await expect(card.getByRole('button', { name: /detalhes/i })).toBeVisible();
		}
	});

	test('should be able to filter projects by name using the search bar', async ({ page }) => {
		const responsePromise = waitForProjectsResponse(
			page,
			(params) => params.get('title') === SEARCH_TERM
		);

		await page.getByPlaceholder('Pesquise um projeto').fill(SEARCH_TERM);

		const projects = await parseProjects(await responsePromise);

		await expect(page).toHaveURL(new RegExp(`[?&]q=${SEARCH_TERM}`));
		for (const project of projects) {
			expect(project.title?.toLowerCase()).toContain(SEARCH_TERM.toLowerCase());
		}
		await expectCardsToMatch(page, projects);
	});

	test('should be able to filter projects using the district select', async ({ page }) => {
		const responsePromise = waitForProjectsResponse(
			page,
			(params) => params.get('district') === DISTRICT
		);

		await selectDistrict(page, DISTRICT);

		const projects = await parseProjects(await responsePromise);

		await expect(page.locator('#Districtdropdown')).toHaveText(DISTRICT);
		await expect(page).toHaveURL(new RegExp(`[?&]district=${encodeURIComponent(DISTRICT)}`));
		for (const project of projects) {
			expect(project.district).toBe(DISTRICT);
		}
		await expectCardsToMatch(page, projects);
		for (const card of await projectCards(page).all()) {
			await expect(card.locator('.MuiCardHeader-subheader')).toHaveText(`Distrito: ${DISTRICT}`);
		}
	});

	test('should be able to filter by price and typology and district', async ({ page }) => {
		await selectDistrict(page, DISTRICT);

		await page.getByRole('button', { name: /filtros/i }).click();
		await page.getByRole('checkbox', { name: TYPOLOGY, exact: true }).check();
		await page.getByRole('checkbox', { name: 'Preço', exact: true }).check();

		// Drag the upper thumb down so the price range is narrower than the full range
		const slider = page.locator('.MuiSlider-root');
		const sliderBox = await slider.boundingBox();
		const maxThumbBox = await slider.locator('.MuiSlider-thumb').nth(1).boundingBox();
		if (!sliderBox || !maxThumbBox) throw new Error('Price slider is not visible');
		await page.mouse.move(
			maxThumbBox.x + maxThumbBox.width / 2,
			maxThumbBox.y + maxThumbBox.height / 2
		);
		await page.mouse.down();
		await page.mouse.move(
			sliderBox.x + sliderBox.width * PRICE_MAX_FRACTION,
			maxThumbBox.y + maxThumbBox.height / 2,
			{ steps: 10 }
		);
		await page.mouse.up();

		const responsePromise = waitForProjectsResponse(
			page,
			(params) =>
				params.get('district') === DISTRICT &&
				params.getAll('typologies').includes(TYPOLOGY) &&
				params.has('priceMin') &&
				params.has('priceMax')
		);

		await page.getByRole('button', { name: 'Aplicar Filtros' }).click();

		const response = await responsePromise;
		const requestParams = new URL(response.url()).searchParams;
		const priceMin = Number(requestParams.get('priceMin'));
		const priceMax = Number(requestParams.get('priceMax'));
		const projects = await parseProjects(response);

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
		await expectCardsToMatch(page, projects);
	});
});
