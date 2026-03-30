import React from 'react';

import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Carousel } from './Carousel';

// Stub @phosphor-icons/react — ESM-only, fails in jsdom
vi.mock('@phosphor-icons/react', () => ({
	CaretLeftIcon: (props: any) => React.createElement('svg', { ...props }),
	CaretRightIcon: (props: any) => React.createElement('svg', { ...props }),
	CircleIcon: (props: any) => React.createElement('svg', { ...props }),
	XIcon: (props: any) => React.createElement('svg', { ...props })
}));

// Stub MUI Dialog to avoid portal / Fade animation issues in jsdom.
// Renders children inline when open, nothing when closed.
vi.mock('@mui/material', async (importActual) => {
	const actual = await importActual<Record<string, unknown>>();
	return {
		...actual,
		Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
			open ? React.createElement('div', { role: 'dialog' }, children) : null
	};
});

const mockImages = [
	{ id: '1', url: '/image1.jpg' },
	{ id: '2', url: '/image2.jpg' },
	{ id: '3', url: '/image3.jpg' }
];

describe('Carousel', () => {
	it('renders the first image by default', () => {
		render(<Carousel images={mockImages} />);

		const imgs = screen.getAllByRole('img');
		const mainImg = imgs.find((img) => img.getAttribute('alt') === 'Slide 1 of 3');
		expect(mainImg).toBeDefined();
		expect(mainImg?.getAttribute('src')).toBe('/image1.jpg');
	});

	it('advances to the next image when the next button is clicked', async () => {
		render(<Carousel images={mockImages} />);

		await userEvent.click(screen.getByRole('button', { name: 'next image' }));

		const mainImg = screen
			.getAllByRole('img')
			.find((img) => img.getAttribute('alt') === 'Slide 2 of 3');
		expect(mainImg).toBeDefined();
		expect(mainImg?.getAttribute('src')).toBe('/image2.jpg');
	});

	it('goes to the previous image when the previous button is clicked from slide 1', async () => {
		render(<Carousel images={mockImages} />);

		// Move to slide 2 first
		await userEvent.click(screen.getByRole('button', { name: 'next image' }));
		// Then go back
		await userEvent.click(screen.getByRole('button', { name: 'previous image' }));

		const mainImg = screen
			.getAllByRole('img')
			.find((img) => img.getAttribute('alt') === 'Slide 1 of 3');
		expect(mainImg).toBeDefined();
		expect(mainImg?.getAttribute('src')).toBe('/image1.jpg');
	});

	it('wraps to the last image when previous is clicked from slide 0', async () => {
		render(<Carousel images={mockImages} />);

		await userEvent.click(screen.getByRole('button', { name: 'previous image' }));

		const mainImg = screen
			.getAllByRole('img')
			.find((img) => img.getAttribute('alt') === 'Slide 3 of 3');
		expect(mainImg).toBeDefined();
		expect(mainImg?.getAttribute('src')).toBe('/image3.jpg');
	});

	it('opens the fullscreen dialog when the image is clicked', async () => {
		render(<Carousel images={mockImages} />);

		expect(screen.queryByRole('dialog')).toBeNull();

		// The image wrapper button has no accessible name; select by its child img
		const imageWrapperButton = screen
			.getAllByRole('button')
			.find((btn) => btn.querySelector('img[alt="Slide 1 of 3"]'));
		expect(imageWrapperButton).toBeDefined();
		await userEvent.click(imageWrapperButton!);

		expect(screen.getByRole('dialog')).toBeDefined();
	});

	it('closes the fullscreen dialog when the close button is clicked', async () => {
		render(<Carousel images={mockImages} />);

		// Open fullscreen
		const imageWrapperButton = screen
			.getAllByRole('button')
			.find((btn) => btn.querySelector('img[alt="Slide 1 of 3"]'));
		await userEvent.click(imageWrapperButton!);
		expect(screen.getByRole('dialog')).toBeDefined();

		// Close it
		await userEvent.click(screen.getByRole('button', { name: 'close' }));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders a thumbnail button for each image in the gallery', () => {
		render(<Carousel images={mockImages} />);

		expect(screen.getAllByAltText(/^Thumbnail /)).toHaveLength(mockImages.length);
	});

	it('jumps to the correct image when a gallery thumbnail is clicked', async () => {
		render(<Carousel images={mockImages} />);

		const thumbnail3 = screen.getByAltText('Thumbnail 3');
		await userEvent.click(thumbnail3.closest('button')!);

		// The main carousel image should now show slide 3
		const mainImg = screen
			.getAllByRole('img')
			.find((img) => img.getAttribute('alt') === 'Slide 3 of 3');
		expect(mainImg).toBeDefined();
		expect(mainImg?.getAttribute('src')).toBe('/image3.jpg');
	});

	it('renders the carousel section with correct aria attributes', () => {
		render(<Carousel images={mockImages} />);

		const section = screen.getByRole('region', { name: 'Image carousel' });
		expect(section).toBeDefined();
		expect(section.getAttribute('aria-roledescription')).toBe('carousel');
	});
});
