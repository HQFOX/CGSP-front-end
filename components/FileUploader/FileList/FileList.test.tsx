import React from 'react';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AbstractFile } from '../utils';
import { FileList } from './FileList';

// Mock @phosphor-icons/react since the ESM package can fail to load in jsdom
vi.mock('@phosphor-icons/react', () => ({
	ArrowCounterClockwiseIcon: (props: any) =>
		React.createElement('svg', { ...props, 'data-testid': props['data-testid'] }),
	FileArrowUpIcon: (props: any) =>
		React.createElement('svg', { ...props, 'data-testid': props['data-testid'] })
}));

// Helper to create a mock File object with a fake object URL
const createMockFile = (name: string): File => {
	return new File(['dummy'], name, { type: 'image/png' });
};

// Mock URL.createObjectURL since jsdom doesn't support it
beforeAll(() => {
	globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
	globalThis.URL.revokeObjectURL = vi.fn();
});

describe('FileList', () => {
	const defaultProps = {
		onDeleteFile: vi.fn(),
		onRetryFile: vi.fn(async (file: AbstractFile) => file)
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should show an existing file in the list', () => {
		const files: AbstractFile[] = [
			{ filename: 'photo.png', link: 'https://example.com/photo.png' }
		];

		render(<FileList files={files} {...defaultProps} />);

		expect(screen.getByText('photo.png')).toBeDefined();
	});

	it('should show multiple files in the list', () => {
		const files: AbstractFile[] = [
			{ filename: 'photo1.png', link: 'https://example.com/photo1.png' },
			{ filename: 'photo2.png', link: 'https://example.com/photo2.png' }
		];

		render(<FileList files={files} {...defaultProps} />);

		expect(screen.getByText('photo1.png')).toBeDefined();
		expect(screen.getByText('photo2.png')).toBeDefined();
	});

	it('should show CheckCircle icon when file has a link (ready to send)', () => {
		const files: AbstractFile[] = [
			{ filename: 'ready.png', link: 'https://example.com/ready.png' }
		];

		render(<FileList files={files} {...defaultProps} />);

		expect(screen.getByTestId('CheckCircleIcon')).toBeDefined();
	});

	it('should show retry icon when file has no link (upload failed)', () => {
		const files: AbstractFile[] = [{ filename: 'failed.png' }];

		render(<FileList files={files} {...defaultProps} />);

		expect(screen.getByTestId('ArrowCounterClockwiseIcon')).toBeDefined();
		expect(screen.queryByTestId('CheckCircleIcon')).toBeNull();
	});

	it('should show FileArrowUp icon when file has a File object attached', () => {
		const mockFile = createMockFile('upload.png');
		const files: AbstractFile[] = [
			{ filename: 'upload.png', file: mockFile, link: 'https://example.com' }
		];

		render(<FileList files={files} {...defaultProps} />);

		expect(screen.getByTestId('FileArrowUpIcon')).toBeDefined();
	});

	it('should render an image preview when file has a File object', () => {
		const mockFile = createMockFile('preview.png');
		const files: AbstractFile[] = [
			{ filename: 'preview.png', file: mockFile, link: 'https://example.com' }
		];

		render(<FileList files={files} {...defaultProps} />);

		const img = screen.getByAltText('fileUploader.submittedImage');
		expect(img).toBeDefined();
	});

	it('should not render an image preview when file has no File object', () => {
		const files: AbstractFile[] = [{ filename: 'nopreview.png', link: 'https://example.com' }];

		render(<FileList files={files} {...defaultProps} />);

		expect(screen.queryByAltText('fileUploader.submittedImage')).toBeNull();
	});

	it('should call onDeleteFile when delete button is clicked', async () => {
		const onDeleteFile = vi.fn();
		const files: AbstractFile[] = [{ filename: 'delete-me.png', link: 'https://example.com' }];

		render(
			<FileList files={files} onDeleteFile={onDeleteFile} onRetryFile={defaultProps.onRetryFile} />
		);

		const deleteButton = screen.getByRole('button', { name: 'fileUploader.deleteFile' });
		await userEvent.click(deleteButton);

		expect(onDeleteFile).toHaveBeenCalledTimes(1);
		expect(onDeleteFile).toHaveBeenCalledWith(files[0]);
	});

	it('should call onRetryFile when retry button is clicked', async () => {
		const onRetryFile = vi.fn(async (file: AbstractFile) => ({
			...file,
			link: 'https://example.com/retried'
		}));
		const files: AbstractFile[] = [{ filename: 'retry-me.png' }];

		render(
			<FileList files={files} onDeleteFile={defaultProps.onDeleteFile} onRetryFile={onRetryFile} />
		);

		const retryButton = screen.getByRole('button', { name: 'fileUploader.retryUpload' });
		await userEvent.click(retryButton);

		await waitFor(() => {
			expect(onRetryFile).toHaveBeenCalledTimes(1);
			expect(onRetryFile).toHaveBeenCalledWith(files[0]);
		});
	});

	it('should show loading spinner while retry is in progress', async () => {
		let resolveRetry: (value: AbstractFile) => void;
		const retryPromise = new Promise<AbstractFile>((resolve) => {
			resolveRetry = resolve;
		});
		const onRetryFile = vi.fn(() => retryPromise);
		const files: AbstractFile[] = [{ filename: 'loading.png' }];

		render(
			<FileList files={files} onDeleteFile={defaultProps.onDeleteFile} onRetryFile={onRetryFile} />
		);

		// Click retry
		const retryButton = screen.getByRole('button', { name: 'fileUploader.retryUpload' });
		await userEvent.click(retryButton);

		// While loading, the ArrowCounterClockwise icon should be replaced
		expect(screen.queryByTestId('ArrowCounterClockwiseIcon')).toBeNull();

		// Resolve the retry
		resolveRetry!({ filename: 'loading.png', link: 'https://example.com' });

		await waitFor(() => {
			expect(onRetryFile).toHaveBeenCalledTimes(1);
		});
	});
});
