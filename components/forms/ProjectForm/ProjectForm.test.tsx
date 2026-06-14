import React from 'react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { dataFetch, submitFile } from '../utils';
import { ProjectForm } from './ProjectForm';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('../utils', () => ({
	dataFetch: vi.fn(),
	submitFile: vi.fn()
}));

vi.mock('@phosphor-icons/react', () => ({}));

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

vi.mock('../..', async (importActual) => {
	const actual = await importActual<Record<string, unknown>>();
	return {
		...actual,
		FileUploader: ({
			onChange,
			title,
			name
		}: {
			onChange?: (files: { filename: string; link?: string }[]) => void;
			title?: string;
			name: string;
			files?: { filename: string; link?: string }[];
			maxFiles?: number;
		}) =>
			React.createElement(
				'div',
				{ 'data-testid': `file-uploader-${name}` },
				title && React.createElement('span', null, title),
				React.createElement(
					'button',
					{
						type: 'button',
						onClick: () =>
							onChange?.([{ filename: 'photo.png', link: 'https://s3.example.com/photo.png' }])
					},
					`Add File ${name}`
				)
			),
		DynamicMap: () => React.createElement('div', { 'data-testid': 'dynamic-map' }, 'Map')
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
		json: () => Promise.resolve({ id: '42', title: 'Test Project' })
	} as Response);

const errorResponse = (status = 500) =>
	Promise.resolve({
		ok: false,
		status,
		json: () => Promise.resolve({})
	} as Response);

const mockProject: Project = {
	id: '1',
	title: 'Existing Project',
	district: 'Évora',
	county: 'Évora',
	assignmentStatus: 'ONGOING',
	constructionStatus: 'BUILDINGPERMIT',
	coordinates: [38.57, -7.91],
	lots: 10,
	assignedLots: 3,
	createdOn: '2025-06-15T00:00:00.000Z',
	typologies: [],
	files: []
};

const defaultHandlers = {
	onCancel: vi.fn(),
	onSubmit: vi.fn()
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProjectForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	// -------------------------------------------------------------------------
	// Rendering — create mode
	// -------------------------------------------------------------------------
	describe('rendering (create mode)', () => {
		it('shows "Adicionar Projeto" heading when no project is passed', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByText('Adicionar Projeto')).toBeDefined();
		});

		it('renders the title input field on step 0', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByLabelText('Nome do projeto')).toBeDefined();
		});

		it('renders the lots input field on step 0', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByLabelText('Lotes')).toBeDefined();
		});

		it('renders the assigned lots input field on step 0', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByLabelText('Lotes Atribuídos')).toBeDefined();
		});

		it('renders the date field on step 0', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByLabelText('Data de Anunciamento do Projeto')).toBeDefined();
		});

		it('renders the cover photo file uploader on step 0', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByTestId('file-uploader-coverPhoto')).toBeDefined();
		});

		it('renders a submit button', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByRole('button', { name: 'Submeter' })).toBeDefined();
		});

		it('renders a cancel button when onCancel is provided', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDefined();
		});

		it('does not render a cancel button when onCancel is not provided', () => {
			render(<ProjectForm />);
			expect(screen.queryByRole('button', { name: 'Cancelar' })).toBeNull();
		});

		it('renders the stepper with all 4 steps', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByText('Detalhes')).toBeDefined();
			expect(screen.getByText('Localização')).toBeDefined();
			expect(screen.getByText('Tipologias')).toBeDefined();
			expect(screen.getByText('Fotografias')).toBeDefined();
		});
	});

	// -------------------------------------------------------------------------
	// Rendering — edit mode
	// -------------------------------------------------------------------------
	describe('rendering (edit mode)', () => {
		it('shows "Editar Projeto" heading when a project is passed', () => {
			render(<ProjectForm project={mockProject} {...defaultHandlers} />);
			expect(screen.getByText('Editar Projeto')).toBeDefined();
		});

		it('pre-fills the title field with the existing value', () => {
			render(<ProjectForm project={mockProject} {...defaultHandlers} />);
			const titleInput = screen.getByLabelText('Nome do projeto') as HTMLInputElement;
			expect(titleInput.value).toBe('Existing Project');
		});

		it('pre-fills the lots field', () => {
			render(<ProjectForm project={mockProject} {...defaultHandlers} />);
			const lotsInput = screen.getByLabelText('Lotes') as HTMLInputElement;
			expect(lotsInput.value).toBe('10');
		});

		it('pre-fills the assigned lots field', () => {
			render(<ProjectForm project={mockProject} {...defaultHandlers} />);
			const assignedLotsInput = screen.getByLabelText('Lotes Atribuídos') as HTMLInputElement;
			expect(assignedLotsInput.value).toBe('3');
		});

		it('pre-fills the date field with the ISO date from the project', () => {
			render(<ProjectForm project={mockProject} {...defaultHandlers} />);
			const dateInput = screen.getByLabelText(
				'Data de Anunciamento do Projeto'
			) as HTMLInputElement;
			expect(dateInput.value).toBe('2025-06-15');
		});
	});

	// -------------------------------------------------------------------------
	// Stepper navigation
	// -------------------------------------------------------------------------
	describe('stepper navigation', () => {
		it('starts on step 0 (Detalhes)', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByLabelText('Nome do projeto')).toBeDefined();
		});

		it('navigates to step 1 (Localização) when "Próximo Passo" is clicked', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Próximo Passo' }));

			await waitFor(() => {
				expect(screen.getByText('Localização', { selector: 'h6' })).toBeDefined();
				expect(screen.getByLabelText('Concelho')).toBeDefined();
			});
		});

		it('navigates to step 2 (Tipologias) via stepper button', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Tipologias' }));

			await waitFor(() => {
				expect(screen.getByText('Tipologias', { selector: 'h6' })).toBeDefined();
			});
		});

		it('navigates to step 3 (Fotografias) via stepper button', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Fotografias' }));

			await waitFor(() => {
				expect(screen.getByTestId('file-uploader-photos')).toBeDefined();
			});
		});

		it('navigates back with "Passo Anterior" button', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Próximo Passo' }));
			await waitFor(() => expect(screen.getByLabelText('Concelho')).toBeDefined());

			await userEvent.click(screen.getByRole('button', { name: 'Passo Anterior' }));
			await waitFor(() => expect(screen.getByLabelText('Nome do projeto')).toBeDefined());
		});

		it('disables "Passo Anterior" on first step', () => {
			render(<ProjectForm {...defaultHandlers} />);
			const backButton = screen.getByRole('button', { name: 'Passo Anterior' });
			expect(backButton).toHaveProperty('disabled', true);
		});

		it('disables "Próximo Passo" on last step', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Fotografias' }));

			await waitFor(() => {
				const nextButton = screen.getByRole('button', { name: 'Próximo Passo' });
				expect(nextButton).toHaveProperty('disabled', true);
			});
		});
	});

	// -------------------------------------------------------------------------
	// Step 1 — Localização
	// -------------------------------------------------------------------------
	describe('step 1 — location', () => {
		it('renders the map on step 1', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Localização' }));

			await waitFor(() => {
				expect(screen.getByTestId('dynamic-map')).toBeDefined();
			});
		});

		it('renders latitude and longitude fields on step 1', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Localização' }));

			await waitFor(() => {
				expect(screen.getByLabelText('latitude')).toBeDefined();
				expect(screen.getByLabelText('longitude')).toBeDefined();
			});
		});
	});

	// -------------------------------------------------------------------------
	// Step 3 — Fotografias
	// -------------------------------------------------------------------------
	describe('step 3 — photos', () => {
		it('renders the photos file uploader on step 3', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Fotografias' }));

			await waitFor(() => {
				expect(screen.getByTestId('file-uploader-photos')).toBeDefined();
			});
		});
	});

	// -------------------------------------------------------------------------
	// Validation
	// -------------------------------------------------------------------------
	describe('validation', () => {
		it('shows validation error messages when submitting with empty required fields', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Campo Obrigatório.')).toBeDefined();
			});
		});

		it('keeps the submit button enabled even when the form is invalid', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByRole('button', { name: 'Submeter' })).toHaveProperty('disabled', false);
		});

		it('does not show validation error messages before the first submit attempt', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.queryByText('Campo Obrigatório.')).toBeNull();
		});
	});

	// -------------------------------------------------------------------------
	// Cancel modal behaviour
	// -------------------------------------------------------------------------
	describe('cancel modal', () => {
		it('opens the cancel modal when "Cancelar" button is clicked', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

			await waitFor(() => {
				expect(screen.getByText('Tem a certeza que quer cancelar?')).toBeDefined();
			});
		});

		it('closes the modal without calling onCancel when "Não" is clicked', async () => {
			const onCancel = vi.fn();
			render(<ProjectForm onCancel={onCancel} />);

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
			render(<ProjectForm onCancel={onCancel} />);

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
		it('calls dataFetch with the POST /project endpoint on success', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.type(screen.getByLabelText('Nome do projeto'), 'New Project');
			// Fill district — navigate to step 1
			await userEvent.click(screen.getByRole('button', { name: 'Localização' }));
			await waitFor(() => expect(screen.getByLabelText('Concelho')).toBeDefined());

			// Type district via the combobox
			const districtInput = screen.getByRole('combobox', { name: 'Distrito' });
			await userEvent.clear(districtInput);
			await userEvent.type(districtInput, 'Évora');
			// Select from autocomplete
			await waitFor(() => screen.getByRole('option', { name: 'Évora' }));
			await userEvent.click(screen.getByRole('option', { name: 'Évora' }));
			await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(mockDataFetch).toHaveBeenCalledTimes(1);
				const [method, endpoint] = mockDataFetch.mock.calls[0] as [string, string];
				expect(method).toBe('POST');
				expect(endpoint).toMatch(/\/project$/);
			});
		});

		it('shows success message and calls onSubmit after a successful create', async () => {
			const onSubmit = vi.fn();
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<ProjectForm onCancel={vi.fn()} onSubmit={onSubmit} />);

			await userEvent.type(screen.getByLabelText('Nome do projeto'), 'New Project');

			await userEvent.click(screen.getByRole('button', { name: 'Localização' }));
			await waitFor(() => expect(screen.getByLabelText('Concelho')).toBeDefined());
			const districtInput = screen.getByRole('combobox', { name: 'Distrito' });
			await userEvent.clear(districtInput);
			await userEvent.type(districtInput, 'Évora');
			await waitFor(() => screen.getByRole('option', { name: 'Évora' }));
			await userEvent.click(screen.getByRole('option', { name: 'Évora' }));
			await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Novo Projeto Adicionado')).toBeDefined();
				expect(onSubmit).toHaveBeenCalledTimes(1);
			});
		});

		it('replaces the form with SuccessMessage on success', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.type(screen.getByLabelText('Nome do projeto'), 'New Project');
			await userEvent.click(screen.getByRole('button', { name: 'Localização' }));
			await waitFor(() => expect(screen.getByLabelText('Concelho')).toBeDefined());
			const districtInput = screen.getByRole('combobox', { name: 'Distrito' });
			await userEvent.clear(districtInput);
			await userEvent.type(districtInput, 'Évora');
			await waitFor(() => screen.getByRole('option', { name: 'Évora' }));
			await userEvent.click(screen.getByRole('option', { name: 'Évora' }));
			await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.queryByLabelText('Nome do projeto')).toBeNull();
				expect(screen.getByText('Novo Projeto Adicionado')).toBeDefined();
			});
		});
	});

	// -------------------------------------------------------------------------
	// Submission — success (edit)
	// -------------------------------------------------------------------------
	describe('submission — edit mode', () => {
		it('calls dataFetch with the correct /project/:id endpoint on edit', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<ProjectForm project={mockProject} {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(mockDataFetch).toHaveBeenCalledTimes(1);
				const [method, endpoint] = mockDataFetch.mock.calls[0] as [string, string];
				expect(method).toBe('POST');
				expect(endpoint).toMatch(/\/project\/1$/);
			});
		});

		it('shows "Projeto Editado" success message on edit', async () => {
			mockDataFetch.mockReturnValue(okResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<ProjectForm project={mockProject} {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Projeto Editado')).toBeDefined();
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

			render(<ProjectForm project={mockProject} {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Erro a submeter Projeto')).toBeDefined();
			});
		});

		it('does not call onSubmit when the API returns an error', async () => {
			const onSubmit = vi.fn();
			mockDataFetch.mockReturnValue(errorResponse());
			mockSubmitFile.mockResolvedValue(true);

			render(<ProjectForm project={mockProject} onCancel={vi.fn()} onSubmit={onSubmit} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(screen.getByText('Erro a submeter Projeto')).toBeDefined();
			});
			expect(onSubmit).not.toHaveBeenCalled();
		});
	});

	// -------------------------------------------------------------------------
	// File upload interaction
	// -------------------------------------------------------------------------
	describe('file upload — cover photo', () => {
		it('renders the cover photo uploader on step 0', () => {
			render(<ProjectForm {...defaultHandlers} />);
			expect(screen.getByTestId('file-uploader-coverPhoto')).toBeDefined();
			expect(screen.getByText('Adicionar Foto de Capa')).toBeDefined();
		});

		it('calls submitFile for the cover photo on submit', async () => {
			mockSubmitFile.mockResolvedValue(true);
			mockDataFetch.mockReturnValue(okResponse());

			render(<ProjectForm project={mockProject} {...defaultHandlers} />);

			// Add a cover photo via the stubbed uploader
			await userEvent.click(screen.getByRole('button', { name: 'Add File coverPhoto' }));

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));

			await waitFor(() => {
				expect(mockSubmitFile).toHaveBeenCalledWith(
					expect.objectContaining({ filename: 'photo.png' })
				);
			});
		});
	});

	describe('file upload — photos', () => {
		it('renders the photos uploader on step 3', async () => {
			render(<ProjectForm {...defaultHandlers} />);

			await userEvent.click(screen.getByRole('button', { name: 'Fotografias' }));

			await waitFor(() => {
				expect(screen.getByTestId('file-uploader-photos')).toBeDefined();
				expect(screen.getByText('Adicionar Fotos')).toBeDefined();
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

			render(<ProjectForm project={mockProject} onCancel={onCancel} onSubmit={vi.fn()} />);

			await userEvent.click(screen.getByRole('button', { name: 'Submeter' }));
			await waitFor(() => screen.getByText('Projeto Editado'));

			// Click the X icon button
			const closeButtons = screen.getAllByRole('button');
			const closeButton = closeButtons.find((btn) => btn.querySelector('svg'));
			expect(closeButton).toBeDefined();
			await userEvent.click(closeButton!);

			expect(onCancel).toHaveBeenCalledTimes(1);
			expect(screen.queryByText('Tem a certeza que quer cancelar?')).toBeNull();
		});
	});
});
