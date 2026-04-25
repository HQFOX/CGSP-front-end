/* eslint-disable react/display-name */
import React from 'react';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AbstractFile } from '../utils';
import { FileList } from './FileList';

vi.mock('../utils', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../utils')>();
	return {
		...actual
	};
});

// Stub the components barrel to avoid loading heavy transitive dependencies
// (UpdateTable, Carousel, charts, etc.) that aren't needed here.
vi.mock('../../../components', () => ({
	Loading: () => React.createElement('div', { 'data-testid': 'loading-stub' }),
	// Mirror Media's real behaviour: render <video aria-label> for video alt keys, <img alt> otherwise.
	Media: ({ alt, ...rest }: any) =>
		alt === 'fileUploader.submittedVideo'
			? React.createElement('video', { 'aria-label': alt, ...rest })
			: React.createElement('img', { alt, ...rest })
}));

// Mock @phosphor-icons/react since the ESM package can fail to load in jsdom
vi.mock('@phosphor-icons/react', () => ({
	ArrowCounterClockwiseIcon: React.forwardRef((props: any, ref: any) =>
		React.createElement('svg', { ...props, ref, 'data-testid': props['data-testid'] })
	),
	FileArrowUpIcon: React.forwardRef((props: any, ref: any) =>
		React.createElement('svg', { ...props, ref, 'data-testid': props['data-testid'] })
	)
}));

// Helper to create a mock File object with a fake object URL
const createMockFile = (name: string): File => {
	return new File(['dummy'], name, { type: 'image/png' });
};

const createMockVideoFile = (name: string): File => {
	return new File(['dummy'], name, { type: 'video/mp4' });
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

	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		vi.clearAllMocks();
		user = userEvent.setup({ delay: null });
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
		const mockFile = createMockFile('failed.png');
		const files: AbstractFile[] = [{ filename: 'failed.png', file: mockFile }];

		render(<FileList files={files} {...defaultProps} />);

		expect(screen.getByTestId('ArrowCounterClockwiseIcon')).toBeDefined();
		expect(screen.queryByTestId('CheckCircleIcon')).toBeNull();
	});

	it('should show no status icon for a server-loaded file (edit mode)', () => {
		const files: AbstractFile[] = [{ filename: 'server.png' }];

		render(<FileList files={files} {...defaultProps} />);

		expect(screen.queryByTestId('ArrowCounterClockwiseIcon')).toBeNull();
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

	it('should call onDeleteFile when delete button is clicked', async () => {
		const onDeleteFile = vi.fn();
		const files: AbstractFile[] = [{ filename: 'delete-me.png', link: 'https://example.com' }];

		render(
			<FileList files={files} onDeleteFile={onDeleteFile} onRetryFile={defaultProps.onRetryFile} />
		);

		const deleteButton = screen.getByRole('button', { name: 'fileUploader.deleteFile' });
		await user.click(deleteButton);

		expect(onDeleteFile).toHaveBeenCalledTimes(1);
		expect(onDeleteFile).toHaveBeenCalledWith(files[0]);
	});

	it('should call onRetryFile when retry button is clicked', async () => {
		const onRetryFile = vi.fn(async (file: AbstractFile) => ({
			...file,
			link: 'https://example.com/retried'
		}));
		const mockFile = createMockFile('retry-me.png');
		const files: AbstractFile[] = [{ filename: 'retry-me.png', file: mockFile }];

		render(
			<FileList files={files} onDeleteFile={defaultProps.onDeleteFile} onRetryFile={onRetryFile} />
		);

		const retryButton = screen.getByRole('button', { name: 'fileUploader.retryUpload' });
		await user.click(retryButton);

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
		const mockFile = createMockFile('loading.png');
		const files: AbstractFile[] = [{ filename: 'loading.png', file: mockFile }];

		render(
			<FileList files={files} onDeleteFile={defaultProps.onDeleteFile} onRetryFile={onRetryFile} />
		);

		// Click retry
		const retryButton = screen.getByRole('button', { name: 'fileUploader.retryUpload' });
		await user.click(retryButton);

		// While loading, the ArrowCounterClockwise icon should be replaced
		expect(screen.queryByTestId('ArrowCounterClockwiseIcon')).toBeNull();

		// Resolve the retry
		resolveRetry!({ filename: 'loading.png', link: 'https://example.com' });

		await waitFor(() => {
			expect(onRetryFile).toHaveBeenCalledTimes(1);
		});
	});

	it('should render a video preview when file is a video', () => {
		const mockFile = createMockVideoFile('clip.mp4');
		const files: AbstractFile[] = [
			{ filename: 'clip.mp4', file: mockFile, link: 'https://example.com' }
		];

		render(<FileList files={files} {...defaultProps} />);

		const video = screen.getByLabelText('fileUploader.submittedVideo');
		expect(video).toBeDefined();
		expect(video.tagName).toBe('VIDEO');
		expect(screen.queryByAltText('fileUploader.submittedImage')).toBeNull();
	});

	it('should render an image preview (not video) for image files', () => {
		const mockFile = createMockFile('photo.png');
		const files: AbstractFile[] = [
			{ filename: 'photo.png', file: mockFile, link: 'https://example.com' }
		];

		render(<FileList files={files} {...defaultProps} />);

		const img = screen.getByAltText('fileUploader.submittedImage');
		expect(img).toBeDefined();
		expect(screen.queryByLabelText('fileUploader.submittedVideo')).toBeNull();
	});
});
