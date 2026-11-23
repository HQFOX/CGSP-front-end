import { Locator, Page, Response, expect } from '@playwright/test';

type TypologyDetails = { typology?: string; price?: number };
export type ProjectItem = { title?: string; district?: string; typologies?: TypologyDetails[] };
type ProjectsResponseBody = { content?: ProjectItem[] };

class ProjectCard {
	readonly root: Locator;
	readonly title: Locator;
	readonly district: Locator;
	readonly detailsButton: Locator;

	constructor(root: Locator) {
		this.root = root;
		this.title = root.locator('.MuiCardHeader-title');
		this.district = root.locator('.MuiCardHeader-subheader');
		this.detailsButton = root.getByRole('button', { name: /detalhes/i });
	}
}

export class ProjectsPage {
	readonly page: Page;
	readonly heading: Locator;
	readonly searchInput: Locator;
	readonly districtDropdown: Locator;
	readonly filtersButton: Locator;
	readonly priceCheckbox: Locator;
	readonly priceSlider: Locator;
	readonly priceSliderMaxThumb: Locator;
	readonly applyFiltersButton: Locator;
	readonly cards: Locator;
	readonly cardTitles: Locator;

	constructor(page: Page) {
		this.page = page;
		this.heading = page.getByRole('heading', { name: 'Projetos a Decorrer' });
		this.searchInput = page.getByPlaceholder('Pesquise um projeto');
		this.districtDropdown = page.locator('#Districtdropdown');
		this.filtersButton = page.getByRole('button', { name: /filtros/i });
		this.priceCheckbox = page.getByRole('checkbox', { name: 'Preço', exact: true });
		this.priceSlider = page.locator('.MuiSlider-root');
		this.priceSliderMaxThumb = this.priceSlider.locator('.MuiSlider-thumb').nth(1);
		this.applyFiltersButton = page.getByRole('button', { name: 'Aplicar Filtros' });
		this.cards = page.locator('.MuiCard-root');
		this.cardTitles = this.cards.locator('.MuiCardHeader-title');
	}

	async goto() {
		await this.page.goto('/projects');
	}

	districtOption(district: string) {
		return this.page.getByRole('menuitem', { name: district, exact: true });
	}

	typologyCheckbox(typology: string) {
		return this.page.getByRole('checkbox', { name: typology, exact: true });
	}

	async allCards() {
		const cards = await this.cards.all();
		return cards.map((card) => new ProjectCard(card));
	}

	async selectDistrict(district: string) {
		await this.districtDropdown.click();
		await this.districtOption(district).click();
	}

	// Drops the upper price thumb at the given fraction of the slider width
	async dragMaxPriceTo(sliderFraction: number) {
		const sliderBox = await this.priceSlider.boundingBox();
		const thumbBox = await this.priceSliderMaxThumb.boundingBox();
		if (!sliderBox || !thumbBox) throw new Error('Price slider is not visible');

		const thumbCenterY = thumbBox.y + thumbBox.height / 2;
		await this.page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbCenterY);
		await this.page.mouse.down();
		await this.page.mouse.move(sliderBox.x + sliderBox.width * sliderFraction, thumbCenterY, {
			steps: 10
		});
		await this.page.mouse.up();
	}

	// Waits for the client-side request to the current projects endpoint whose params satisfy the
	// predicate. Call this before the action that triggers the request, and await it afterwards.
	async waitForProjects(predicate: (params: URLSearchParams) => boolean) {
		const response = await this.page.waitForResponse((candidate: Response) => {
			const url = new URL(candidate.url());
			return url.pathname.endsWith('/project/current') && predicate(url.searchParams);
		});
		expect(response.ok()).toBeTruthy();

		const body = (await response.json()) as ProjectsResponseBody;
		return {
			params: new URL(response.url()).searchParams,
			projects: body.content ?? []
		};
	}
}
