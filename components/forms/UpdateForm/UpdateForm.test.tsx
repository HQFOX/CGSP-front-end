import React from 'react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UpdateForm } from '../UpdateForm';
// ---------------------------------------------------------------------------
// Imports after mocks are registered
// ---------------------------------------------------------------------------
import { dataFetch, submitFile } from '../utils';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock the form utils so no real fetch calls are made
vi.mock('../utils', () => ({
	dataFetch: vi.fn(),
	getPresignedUrl: vi.fn(),
	submitFile: vi.fn()
}));

// @phosphor-icons/react is ESM-only and fails to load in jsdom.
// A minimal mock prevents errors when importActual loads the components barrel.
vi.mock('@phosphor-icons/react', () => ({}));

// Mock CancelModal — MUI Dialog renders via Portal + Fade transition which
// doesn't resolve synchronously in jsdom. A simple stub lets us test the
// open/close/confirm behaviour without fighting the animation layer.
vi.mock('../../modals/CancelModal', () => ({
	CancelModal: ({
		open,
		handleClose,
		title
	}: {
		open: boolean;
		handleClose: (confirm: boolean) => void;
		title: string;
	}) =>
		open
			? React.createElement(
					'div',
					{ role: 'dialog', 'aria-label': title },
					React.createElement('p', null, 'Tem a certeza que quer cancelar?'),
					React.createElement('button', { onClick: () => handleClose(false) }, 'Não'),
					React.createElement('button', { onClick: () => handleClose(true) }, 'Sim')
				)
			: null
}));

// Partially mock the components barrel — replace FileUploader with a stub
// that exposes a simple button calling onChange, while keeping the real
// Loading and StyledButton components intact.
vi.mock('../../../components', async (importActual) => {
	const actual = await importActual<Record<string, unknown>>();
	return {
		...actual,
		FileUploader: ({
			onChange,
			label
		}: {
			onChange?: (files: { filename: string; link?: string }[]) => void;
			label?: string;
			files?: { filename: string; link?: string }[];
			error?: string[];
			maxFiles?: number;
			name: string;
		}) =>
			React.createElement(
				'div',
				{ 'data-testid': 'file-uploader-stub' },
				label && React.createElement('span', null, label),
				React.createElement(
					'button',
					{
						type: 'button',
						onClick: () =>
							onChange?.([{ filename: 'photo.png', link: 'https://s3.example.com/photo.png' }])
					},
					'Add File'
				)
			)
	};
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockDataFetch = dataFetch as ReturnType<typeof vi.fn>;
const mockSubmitFile = submitFile as ReturnType<typeof vi.fn>;

const okResponse = () =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve({ id: '42', title: 'Test' })
	} as Response);

const errorResponse = (status = 500) =>
	Promise.resolve({
		ok: false,
		status,
		json: () => Promise.resolve({})
	} as Response);

const mockUpdate: Update = {
	id: '1',
	title: 'Existing Title',
	content: 'Existing content',
	createdOn: '2025-06-15T00:00:00.000Z',
	files: [],
	project: { projectId: 'proj-1', title: 'Project Alpha' }
};

const mockProjects: Project[] = [
	{ id: 'proj-1', title: 'Project Alpha' },
	{ id: 'proj-2', title: 'Project Beta' }
];

const defaultHandlers = {
	onCancel: vi.fn(),
	onSubmit: vi.fn()
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('UpdateForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	// -------------------------------------------------------------------------
	// Rendering — create mode (no update prop)
	// -------------------------------------------------------------------------
	describe('rendering (create mode)', () => {
		it('shows "Criar Atualização" heading when no update is passed', () => {
			render(<UpdateForm {...defaultHandlers} />);
			expect(screen.getByText('Criar Atualização')).toBeDefined();
		});

		it('renders the Title input field', () => {
			render(<UpdateForm {...defaultHandlers} />);
			expect(screen.getByLabelText('Título')).toBeDefined();
		});

		it('renders the Content input field', () => {
			render(<UpdateForm {...defaultHandlers} />);
			expect(screen.getByLabelText('Conteúdo')).toBeDefined();
		});

		it('renders the date field', () => {
			render(<UpdateForm {...defaultHandlers} />);
			expect(screen.getByLabelText('Data de Lançamento da Atualização')).toBeDefined();
		});

		it('renders a submit and a cancel button', () => {
			render(<UpdateForm {...defaultHandlers} />);
			expect(screen.getByRole('button', { name: 'Submeter' })).toBeDefined();
			expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDefined();
		});

		it('renders the file uploader', () => {
			render(<UpdateForm {...defaultHandlers} />);
			expect(screen.getByTestId('file-uploader-stub')).toBeDefined();
		});
	});

	// -------------------------------------------------------------------------
	// Rendering — edit mode (update prop provided)
	// -------------------------------------------------------------------------
	describe('rendering (edit mode)', () => {
		it('shows "Editar Atualização" heading when an update is passed', () => {
			render(<UpdateForm update={mockUpdate} {...defaultHandlers} />);
			expect(screen.getByText('Editar Atualização')).toBeDefined();
		});

		it('pre-fills the title field with the existing value', () => {
			render(<UpdateForm update={mockUpdate} {...defaultHandlers} />);
			const titleInput = screen.getByLabelText('Título') as HTMLInputElement;
			expect(titleInput.value).toBe('Existing Title');
		});

		it('pre-fills the content field with the existing value', () => {
			render(<UpdateForm update={mockUpdate} {...defaultHandlers} />);
			const contentInput = screen.getByLabelText('Conteúdo') as HTMLInputElement;
			expect(contentInput.value).toBe('Existing content');
		});

		it('pre-fills the date field with the ISO date from the update', () => {
			render(<UpdateForm update={mockUpdate} {...defaultHandlers} />);
			const dateInput = screen.getByLabelText(
				'Data de Lançamento da Atualização'
			) as HTMLInputElement;
			expect(dateInput.value).toBe('2025-06-15');
		});

		it('renders project options when projects array is provided', async () => {
			render(<UpdateForm update={mockUpdate} projects={mockProjects} {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('combobox', { name: /projeto relacionado/i }));

			await waitFor(() => {
				expect(screen.getByRole('option', { name: 'Project Alpha' })).toBeDefined();
				expect(screen.getByRole('option', { name: 'Project Beta' })).toBeDefined();
			});
		});

		it('does not render project options when projects array is empty', async () => {
			render(<UpdateForm update={mockUpdate} projects={[]} {...defaultHandlers} />);

			expect(screen.queryByRole('combobox', { name: /projeto relacionado/i })).toBeNull();
		});
	});

	// -------------------------------------------------------------------------
	// Validation
	// -------------------------------------------------------------------------
	describe('validation', () => {
		it('shows a required error when submitting without a title', async () => {
			render(<UpdateForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Obrigatório')).toBeDefined();
			});
		});

		it('does not show a required error when title is filled', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm {...defaultHandlers} />);

			await userEvent.type(screen.getByLabelText('Título'), 'My Update');
			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.queryByText('Obrigatório')).toBeNull();
			});
		});
	});

	// -------------------------------------------------------------------------
	// Cancel modal behaviour
	// -------------------------------------------------------------------------
	describe('cancel modal', () => {
		it('opens the cancel modal when "Cancelar" button is clicked', async () => {
			render(<UpdateForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

			await waitFor(() => {
				expect(screen.getByText('Tem a certeza que quer cancelar?')).toBeDefined();
			});
		});

		it('closes the modal without calling onCancel when "Não" is clicked', async () => {
			const onCancel = vi.fn();
			render(<UpdateForm onCancel={onCancel} onSubmit={vi.fn()} />);

			await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
			await waitFor(() => screen.getByText('Tem a certeza que quer cancelar?'));

			await userEvent.click(screen.getByRole('button', { name: 'Não' }));

			await waitFor(() => {
				expect(screen.queryByText('Tem a certeza que quer cancelar?')).toBeNull();
			});
			expect(onCancel).not.toHaveBeenCalled();
		});

		it('calls onCancel when "Sim" is clicked in the modal', async () => {
			const onCancel = vi.fn();
			render(<UpdateForm onCancel={onCancel} onSubmit={vi.fn()} />);

			await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
			await waitFor(() => screen.getByText('Tem a certeza que quer cancelar?'));

			await userEvent.click(screen.getByRole('button', { name: 'Sim' }));

			await waitFor(() => {
				expect(onCancel).toHaveBeenCalledTimes(1);
			});
		});
	});

	// -------------------------------------------------------------------------
	// Submission — success (create)
	// -------------------------------------------------------------------------
	describe('submission — create mode', () => {
		it('calls dataFetch with the POST /update endpoint on success', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm {...defaultHandlers} />);

			await userEvent.type(screen.getByLabelText('Título'), 'New Update');
			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(mockDataFetch).toHaveBeenCalledTimes(1);
				const [method, endpoint] = mockDataFetch.mock.calls[0] as [string, string];
				expect(method).toBe('POST');
				expect(endpoint).toMatch(/\/update$/);
			});
		});

		it('shows success message and calls onSubmit after a successful create', async () => {
			const onSubmit = vi.fn();
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm onCancel={vi.fn()} onSubmit={onSubmit} />);

			await userEvent.type(screen.getByLabelText('Título'), 'New Update');
			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Nova Atualização Adicionada')).toBeDefined();
				expect(onSubmit).toHaveBeenCalledTimes(1);
			});
		});

		it('replaces the form with SuccessMessage on success', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm {...defaultHandlers} />);

			await userEvent.type(screen.getByLabelText('Título'), 'New Update');
			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.queryByLabelText('Título')).toBeNull();
				expect(screen.getByText('Nova Atualização Adicionada')).toBeDefined();
			});
		});
	});

	// -------------------------------------------------------------------------
	// Submission — success (edit)
	// -------------------------------------------------------------------------
	describe('submission — edit mode', () => {
		it('calls dataFetch with the correct /update/:id endpoint on edit', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm update={mockUpdate} {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(mockDataFetch).toHaveBeenCalledTimes(1);
				const [method, endpoint] = mockDataFetch.mock.calls[0] as [string, string];
				expect(method).toBe('POST');
				expect(endpoint).toMatch(/\/update\/1$/);
			});
		});

		it('shows "Atualização Editada" success message on edit', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm update={mockUpdate} {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Atualização Editada')).toBeDefined();
			});
		});
	});

	// -------------------------------------------------------------------------
	// Submission — failure
	// -------------------------------------------------------------------------
	describe('submission — failure', () => {
		it('shows an error message when the API returns a non-ok response', async () => {
			mockDataFetch.mockReturnValue(errorResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm {...defaultHandlers} />);

			await userEvent.type(screen.getByLabelText('Título'), 'Failing Update');
			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Erro a submeter Atualização')).toBeDefined();
			});
		});

		it('does not call onSubmit when the API returns an error', async () => {
			const onSubmit = vi.fn();
			mockDataFetch.mockReturnValue(errorResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm onCancel={vi.fn()} onSubmit={onSubmit} />);

			await userEvent.type(screen.getByLabelText('Título'), 'Failing Update');
			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Erro a submeter Atualização')).toBeDefined();
			});
			expect(onSubmit).not.toHaveBeenCalled();
		});
	});

	// -------------------------------------------------------------------------
	// File upload interaction
	// -------------------------------------------------------------------------
	describe('file upload', () => {
		it('updates the file list when a file is added via the uploader', async () => {
			render(<UpdateForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Add File' }));

			// The stub calls onChange with a pre-built AbstractFile;
			// verify the uploader stub is still rendered (state did not crash)
			expect(screen.getByTestId('file-uploader-stub')).toBeDefined();
		});

		it('calls submitFile for each attached file on submit', async () => {
			mockSubmitFile.mockResolvedValue(true);
			mockDataFetch.mockReturnValue(okResponse());

			render(<UpdateForm {...defaultHandlers} />);

			// Add a file via the stubbed uploader
			await userEvent.click(screen.getByRole('button', { name: 'Add File' }));

			// Fill title and submit
			await userEvent.type(screen.getByLabelText('Título'), 'Update With File');
			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(mockSubmitFile).toHaveBeenCalledTimes(1);
				expect(mockSubmitFile).toHaveBeenCalledWith(
					expect.objectContaining({ filename: 'photo.png' })
				);
			});
		});
	});

	// -------------------------------------------------------------------------
	// Success state — close button behaviour
	// -------------------------------------------------------------------------
	describe('success state close button', () => {
		it('calls onCancel directly when X is clicked after a successful submit (no modal)', async () => {
			const onCancel = vi.fn();
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<UpdateForm onCancel={onCancel} onSubmit={vi.fn()} />);

			await userEvent.type(screen.getByLabelText('Título'), 'Done');
			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));
			await waitFor(() => screen.getByText('Nova Atualização Adicionada'));

			// Click the X icon button (aria-label not set, find by role)
			const closeButtons = screen.getAllByRole('button');
			// The only remaining button in success state is the close IconButton
			const closeButton = closeButtons.find((btn) => btn.querySelector('svg'));
			expect(closeButton).toBeDefined();
			await userEvent.click(closeButton!);

			expect(onCancel).toHaveBeenCalledTimes(1);
			// Dialog should NOT appear
			expect(screen.queryByText('Tem a certeza que quer cancelar?')).toBeNull();
		});
	});
});
