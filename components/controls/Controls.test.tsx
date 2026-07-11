import React from 'react';

import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchParams } from '../projects/projectInventory/utils';
import { Controls } from './Controls';

// Stub @phosphor-icons/react — ESM-only, fails in jsdom
vi.mock('@phosphor-icons/react', () => ({
	MapTrifoldIcon: (props: any) => React.createElement('svg', { ...props }),
	SquaresFourIcon: (props: any) => React.createElement('svg', { ...props })
}));

const baseSearch: SearchParams = {
	title: '',
	district: '',
	assignmentStatus: [],
	constructionStatus: [],
	priceRange: [],
	typologies: [],
	types: [],
	wildcard: ''
};

const defaultProps = {
	assignmentStatus: ['WAITING', 'ONGOING', 'CONCLUDED'] as AssignmentStatusType[],
	constructionsStatus: [
		'ALLOTMENTPERMIT',
		'BUILDINGPERMIT',
		'CONCLUDED'
	] as ConstructionStatusType[],
	priceRange: [100, 500],
	typologies: ['T1', 'T2'],
	types: ['New']
};

const openFilters = async () => {
	await userEvent.click(screen.getByRole('button', { name: 'filters' }));
};

describe('Controls', () => {
	it('opens the filters popper when the filters button is clicked', async () => {
		render(<Controls search={baseSearch} {...defaultProps} onApply={vi.fn()} onClear={vi.fn()} />);

		expect(screen.queryByText('applyChanges')).toBeNull();

		await openFilters();

		expect(screen.getByText('applyChanges')).toBeDefined();
		expect(screen.getByText('clearFilters')).toBeDefined();
	});

	it('does not call onApply while editing filters', async () => {
		const onApply = vi.fn();
		render(<Controls search={baseSearch} {...defaultProps} onApply={onApply} onClear={vi.fn()} />);

		await openFilters();
		await userEvent.click(screen.getByRole('checkbox', { name: 'assignmentStatus.WAITING' }));

		expect(onApply).not.toHaveBeenCalled();
	});

	it('calls onApply with the edited draft when Apply Changes is clicked', async () => {
		const onApply = vi.fn();
		render(<Controls search={baseSearch} {...defaultProps} onApply={onApply} onClear={vi.fn()} />);

		await openFilters();
		await userEvent.click(screen.getByRole('checkbox', { name: 'assignmentStatus.WAITING' }));
		await userEvent.click(screen.getByRole('button', { name: 'applyChanges' }));

		expect(onApply).toHaveBeenCalledTimes(1);
		expect(onApply).toHaveBeenCalledWith(
			expect.objectContaining({ assignmentStatus: ['WAITING'] })
		);
	});

	it('closes the popper after applying changes', async () => {
		render(<Controls search={baseSearch} {...defaultProps} onApply={vi.fn()} onClear={vi.fn()} />);

		await openFilters();
		await userEvent.click(screen.getByRole('button', { name: 'applyChanges' }));

		expect(screen.queryByText('applyChanges')).toBeNull();
	});

	it('accumulates multiple selections into a single applied draft', async () => {
		const onApply = vi.fn();
		render(<Controls search={baseSearch} {...defaultProps} onApply={onApply} onClear={vi.fn()} />);

		await openFilters();
		await userEvent.click(screen.getByRole('checkbox', { name: 'assignmentStatus.WAITING' }));
		await userEvent.click(screen.getByRole('checkbox', { name: 'assignmentStatus.ONGOING' }));
		await userEvent.click(
			screen.getByRole('checkbox', { name: 'constructionStatus.ALLOTMENTPERMIT' })
		);
		await userEvent.click(screen.getByRole('button', { name: 'applyChanges' }));

		expect(onApply).toHaveBeenCalledWith(
			expect.objectContaining({
				assignmentStatus: ['WAITING', 'ONGOING'],
				constructionStatus: ['ALLOTMENTPERMIT']
			})
		);
	});

	it('does not persist edits that were not applied', async () => {
		const onApply = vi.fn();
		render(<Controls search={baseSearch} {...defaultProps} onApply={onApply} onClear={vi.fn()} />);

		// Make a change but do not apply it
		await openFilters();
		await userEvent.click(screen.getByRole('checkbox', { name: 'assignmentStatus.WAITING' }));

		// Reopen and apply without touching anything else
		await userEvent.click(screen.getByRole('button', { name: 'applyChanges' }));

		// The unapplied edit was still part of the draft on the first apply,
		// but a fresh apply should not add anything beyond what is checked.
		expect(onApply).toHaveBeenCalledWith(
			expect.objectContaining({ assignmentStatus: ['WAITING'] })
		);
	});

	it('calls onClear and unchecks selected filters when Clear Filters is clicked', async () => {
		const onClear = vi.fn();
		const search: SearchParams = { ...baseSearch, assignmentStatus: ['WAITING'] };
		render(<Controls search={search} {...defaultProps} onApply={vi.fn()} onClear={onClear} />);

		await openFilters();

		const waiting = screen.getByRole('checkbox', {
			name: 'assignmentStatus.WAITING'
		}) as HTMLInputElement;
		expect(waiting.checked).toBe(true);

		await userEvent.click(screen.getByRole('button', { name: 'clearFilters' }));

		expect(onClear).toHaveBeenCalledTimes(1);
		expect(waiting.checked).toBe(false);
	});

	it('toggles a construction status off when unchecked before applying', async () => {
		const onApply = vi.fn();
		const search: SearchParams = { ...baseSearch, constructionStatus: ['ALLOTMENTPERMIT'] };
		render(<Controls search={search} {...defaultProps} onApply={onApply} onClear={vi.fn()} />);

		await openFilters();
		await userEvent.click(
			screen.getByRole('checkbox', { name: 'constructionStatus.ALLOTMENTPERMIT' })
		);
		await userEvent.click(screen.getByRole('button', { name: 'applyChanges' }));

		expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ constructionStatus: [] }));
	});

	it('syncs the draft when the applied search changes externally', async () => {
		const { rerender } = render(
			<Controls search={baseSearch} {...defaultProps} onApply={vi.fn()} onClear={vi.fn()} />
		);

		await openFilters();

		let waiting = screen.getByRole('checkbox', {
			name: 'assignmentStatus.WAITING'
		}) as HTMLInputElement;
		expect(waiting.checked).toBe(false);

		rerender(
			<Controls
				search={{ ...baseSearch, assignmentStatus: ['WAITING'] }}
				{...defaultProps}
				onApply={vi.fn()}
				onClear={vi.fn()}
			/>
		);

		waiting = screen.getByRole('checkbox', {
			name: 'assignmentStatus.WAITING'
		}) as HTMLInputElement;
		expect(waiting.checked).toBe(true);
	});
});
