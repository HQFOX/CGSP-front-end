import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StyledButton } from './Button';

describe('StyledButton', () => {
	it('renders clickable button with capitalize style', async () => {
		const handleClick = vi.fn();
		render(<StyledButton onClick={handleClick}>test button</StyledButton>);

		const button = screen.getByRole('button', { name: 'test button' });

		expect(button).toBeDefined();
		expect(button.className).toContain('css');

		await userEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
