import React from 'react';

import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@testing-library/react';

import { Indicators } from './Indicators';

vi.mock('@phosphor-icons/react', () => ({
	CircleIcon: (props: any) =>
		React.createElement('svg', { 'data-testid': 'CircleIcon', color: props.color })
}));

const mockImages = [
	{ id: '1', url: '/image1.jpg' },
	{ id: '2', url: '/image2.jpg' },
	{ id: '3', url: '/image3.jpg' }
];

describe('Indicators', () => {
	it('renders one icon per image', () => {
		render(<Indicators currentIndex={0} images={mockImages} />);

		expect(screen.getAllByTestId('CircleIcon')).toHaveLength(mockImages.length);
	});

	it('renders the correct screen-reader text for current slide', () => {
		render(<Indicators currentIndex={1} images={mockImages} />);

		expect(screen.getByText('Slide 2 of 3')).toBeDefined();
	});

	it('renders correct screen-reader text for the first slide', () => {
		render(<Indicators currentIndex={0} images={mockImages} />);

		expect(screen.getByText('Slide 1 of 3')).toBeDefined();
	});

	it('renders correct screen-reader text for the last slide', () => {
		render(<Indicators currentIndex={2} images={mockImages} />);

		expect(screen.getByText('Slide 3 of 3')).toBeDefined();
	});

	it('gives the active dot white color and inactive dots grey color', () => {
		render(<Indicators currentIndex={1} images={mockImages} />);

		const icons = screen.getAllByTestId('CircleIcon');

		expect(icons[0].getAttribute('color')).toBe('rgba(175, 175, 175, 0.8)');
		expect(icons[1].getAttribute('color')).toBe('white');
		expect(icons[2].getAttribute('color')).toBe('rgba(175, 175, 175, 0.8)');
	});

	it('renders without error with a single image', () => {
		const singleImage = [{ id: '1', url: '/image1.jpg' }];

		render(<Indicators currentIndex={0} images={singleImage} />);

		expect(screen.getAllByTestId('CircleIcon')).toHaveLength(1);
		expect(screen.getByText('Slide 1 of 1')).toBeDefined();
	});

	it('has aria-live="polite" and aria-atomic="true" on the container', () => {
		const { container } = render(<Indicators currentIndex={0} images={mockImages} />);

		const liveRegion = container.querySelector('[aria-live="polite"]');
		expect(liveRegion).not.toBeNull();
		expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');
	});
});
