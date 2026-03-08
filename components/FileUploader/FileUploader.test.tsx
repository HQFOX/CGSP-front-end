import React, { useState } from 'react';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FileUploader, FileUploaderProps } from './FileUploader';
import { AbstractFile } from './utils';

// Mock @phosphor-icons/react
vi.mock('@phosphor-icons/react', () => ({
	UploadSimpleIcon: (props: any) =>
		React.createElement('svg', { 'data-testid': 'UploadSimpleIcon', ...props }),
	WarningCircleIcon: (props: any) =>
		React.createElement('svg', { 'data-testid': 'WarningCircleIcon', ...props }),
	ArrowCounterClockwiseIcon: (props: any) => React.createElement('svg', { ...props }),
	FileArrowUpIcon: (props: any) => React.createElement('svg', { ...props })
}));

// Mock utils
const mockConvertFileToAbstractFile = vi.fn(
	(file: File): AbstractFile => ({
		filename: file.name,
		file: file
	})
);

const mockGetPresignedUrl = vi.fn(
	async (file: AbstractFile): Promise<AbstractFile> => ({
		...file,
		link: 'https://example.com/presigned-url'
	})
);

vi.mock('./utils', () => ({
	convertFileToAbstractFile: (file: File) => mockConvertFileToAbstractFile(file),
	getPresignedUrl: (file: AbstractFile) => mockGetPresignedUrl(file)
}));

// Re-export for the barrel import in FileUploader (import from '.')
vi.mock('.', () => ({
	convertFileToAbstractFile: (file: File) => mockConvertFileToAbstractFile(file),
	getPresignedUrl: (file: AbstractFile) => mockGetPresignedUrl(file)
}));

// Mock URL.createObjectURL since jsdom doesn't support it
beforeAll(() => {
	global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
	global.URL.revokeObjectURL = vi.fn();
});

/**
 * Stateful wrapper that mimics how a parent (e.g. a Formik form) manages files.
 * This avoids passing a new `[]` reference on every render and lets us assert
 * against real state transitions.
 */
const FileUploaderWrapper = (
	props: Omit<FileUploaderProps, 'onChange'> & {
		initialFiles?: AbstractFile[];
		onChangespy?: (files: AbstractFile[]) => void;
	}
) => {
	const { initialFiles = [], onChangespy, ...rest } = props;
	const [files, setFiles] = useState<AbstractFile[]>(initialFiles);

	const handleChange = (newFiles: AbstractFile[]) => {
		setFiles(newFiles);
		onChangespy?.(newFiles);
	};

	return <FileUploader {...rest} files={files} onChange={handleChange} />;
};

const createMockFileList = (files: File[]): FileList => {
	const fileList = {
		length: files.length,
		item: (index: number) => files[index] || null,
		[Symbol.iterator]: function* () {
			for (const file of files) yield file;
		}
	} as unknown as FileList;
	files.forEach((file, i) => {
		Object.defineProperty(fileList, i, { value: file, enumerable: true });
	});
	return fileList;
};

const createMockFile = (name: string, type = 'image/png'): File => {
	return new File(['dummy'], name, { type });
};

describe('FileUploader', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetPresignedUrl.mockImplementation(async (file: AbstractFile) => ({
			...file,
			link: 'https://example.com/presigned-url'
		}));
	});

	it('should render with default label and click here button', () => {
		render(<FileUploader name="test" />);

		expect(screen.getByText('fileUploader.dragFilesOr')).toBeDefined();
		expect(screen.getByText('fileUploader.clickHere')).toBeDefined();
	});

	it('should render with a custom title', () => {
		render(<FileUploader name="test" title="Upload Photos" />);

		expect(screen.getByText('Upload Photos')).toBeDefined();
	});

	it('should render with a custom label', () => {
		render(<FileUploader name="test" label="Custom label text" />);

		expect(screen.getByText('Custom label text')).toBeDefined();
	});

	it('should display accepted file types', () => {
		render(<FileUploader name="test" />);

		expect(screen.getByText('fileUploader.acceptedFiles')).toBeDefined();
	});

	it('should use title as aria-label when provided', () => {
		render(<FileUploader name="test" title="My Uploader" />);

		expect(
			screen.getByRole('region', { name: 'My Uploader' }) || screen.getByLabelText('My Uploader')
		).toBeDefined();
	});

	it('should use i18n fallback as aria-label when no title', () => {
		render(<FileUploader name="test" />);

		expect(
			screen.getByRole('region', { name: 'fileUploader.fileUploader' }) ||
				screen.getByLabelText('fileUploader.fileUploader')
		).toBeDefined();
	});

	it('should render the upload icon', () => {
		render(<FileUploader name="test" />);

		expect(screen.getByTestId('UploadSimpleIcon')).toBeDefined();
	});

	it('should open file dialog when click here button is clicked', async () => {
		render(<FileUploader name="test" />);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		const clickSpy = vi.spyOn(fileInput, 'click');

		const clickButton = screen.getByText('fileUploader.clickHere');
		await userEvent.click(clickButton);

		expect(clickSpy).toHaveBeenCalled();
	});

	it('should set multiple attribute on file input when maxFiles > 1', () => {
		render(<FileUploader name="test" maxFiles={3} />);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		expect(fileInput.multiple).toBe(true);
	});

	it('should not set multiple attribute on file input when maxFiles is 1', () => {
		render(<FileUploader name="test" maxFiles={1} />);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		expect(fileInput.multiple).toBe(false);
	});

	it('should set accept attribute with accepted file types', () => {
		render(<FileUploader name="test" acceptedFileTypes={['image/png', 'image/jpeg']} />);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		expect(fileInput.accept).toBe('image/png,image/jpeg');
	});

	it('should upload files when selected via input', async () => {
		const onChangeSpy = vi.fn();
		render(<FileUploaderWrapper name="test" onChangespy={onChangeSpy} />);

		const clickButton = screen.getByText('fileUploader.clickHere');
		await userEvent.click(clickButton);

		// Simulate file selection after the native dialog (which we can't control in tests)
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		const mockFile = createMockFile('test.png');
		fireEvent.change(fileInput, { target: { files: createMockFileList([mockFile]) } });

		await waitFor(() => {
			expect(mockConvertFileToAbstractFile).toHaveBeenCalledWith(mockFile);
			expect(mockGetPresignedUrl).toHaveBeenCalled();
			expect(onChangeSpy).toHaveBeenCalledWith(
				expect.arrayContaining([expect.objectContaining({ filename: 'test.png' })])
			);
		});
	});

	it('should show error when file type is not accepted', async () => {
		render(<FileUploaderWrapper name="test" acceptedFileTypes={['image/png']} />);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		const invalidFile = createMockFile('doc.pdf', 'application/pdf');

		fireEvent.change(fileInput, { target: { files: createMockFileList([invalidFile]) } });

		await waitFor(() => {
			expect(screen.getByText('fileUploader.invalidFileTypes')).toBeDefined();
			expect(screen.getByTestId('WarningCircleIcon')).toBeDefined();
		});
	});

	it('should show error when exceeding max files', async () => {
		render(<FileUploaderWrapper name="test" maxFiles={1} />);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		const file1 = createMockFile('photo1.png');
		const file2 = createMockFile('photo2.png');

		// Upload two files at once with maxFiles=1
		fireEvent.change(fileInput, { target: { files: createMockFileList([file1, file2]) } });

		await waitFor(() => {
			expect(screen.getByText('fileUploader.maxFilesError')).toBeDefined();
		});
	});

	it('should not call getPresignedUrl when validation fails', async () => {
		render(<FileUploaderWrapper name="test" maxFiles={1} />);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		const file1 = createMockFile('photo1.png');
		const file2 = createMockFile('photo2.png');

		fireEvent.change(fileInput, { target: { files: createMockFileList([file1, file2]) } });

		await waitFor(() => {
			expect(mockGetPresignedUrl).not.toHaveBeenCalled();
		});
	});

	it('should display Formik errors when touched', () => {
		const formikErrors = ['This field is required'];

		render(<FileUploader name="test" error={formikErrors} touched={true} />);

		expect(screen.getByText('This field is required')).toBeDefined();
	});

	it('should not display Formik errors when not touched', () => {
		const formikErrors = ['This field is required'];

		render(<FileUploader name="test" error={formikErrors} touched={false} />);

		expect(screen.queryByText('This field is required')).toBeNull();
	});

	it('should render initial files from props', () => {
		const initialFiles: AbstractFile[] = [
			{ filename: 'existing.png', link: 'https://example.com/existing.png' }
		];

		render(<FileUploaderWrapper name="test" initialFiles={initialFiles} />);

		expect(screen.getByText('existing.png')).toBeDefined();
	});

	it('should remove a file when delete is clicked in FileList', async () => {
		const onChangeSpy = vi.fn();
		const initialFiles: AbstractFile[] = [
			{ filename: 'to-delete.png', link: 'https://example.com/to-delete.png' }
		];

		render(
			<FileUploaderWrapper name="test" initialFiles={initialFiles} onChangespy={onChangeSpy} />
		);

		const deleteButton = screen.getByRole('button', { name: 'fileUploader.deleteFile' });
		await userEvent.click(deleteButton);

		await waitFor(() => {
			expect(onChangeSpy).toHaveBeenCalledWith([]);
			expect(screen.queryByText('to-delete.png')).toBeNull();
		});
	});

	it('should handle presigned URL errors gracefully', async () => {
		mockGetPresignedUrl.mockRejectedValueOnce(new Error('Network error'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(<FileUploaderWrapper name="test" />);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		const mockFile = createMockFile('fail.png');

		fireEvent.change(fileInput, { target: { files: createMockFileList([mockFile]) } });

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith('Error uploading files:', expect.any(Error));
		});

		consoleSpy.mockRestore();
	});

	it('should handle drag and drop file upload', async () => {
		const onChangeSpy = vi.fn();
		render(<FileUploaderWrapper name="test" onChangespy={onChangeSpy} />);

		const dropzone = screen.getByLabelText('fileUploader.fileUploader');
		const mockFile = createMockFile('dropped.png');
		const mockFileList = createMockFileList([mockFile]);

		const dataTransfer = {
			files: mockFileList,
			types: ['Files']
		};

		// Simulate drag enter
		const dragEnterEvent = new Event('dragenter', { bubbles: true });
		Object.defineProperty(dragEnterEvent, 'dataTransfer', { value: dataTransfer });
		dropzone.dispatchEvent(dragEnterEvent);

		// Simulate drop
		const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
		Object.defineProperty(dropEvent, 'preventDefault', { value: vi.fn() });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });
		dropzone.dispatchEvent(dropEvent);

		await waitFor(() => {
			expect(mockConvertFileToAbstractFile).toHaveBeenCalledWith(mockFile);
			expect(mockGetPresignedUrl).toHaveBeenCalled();
			expect(onChangeSpy).toHaveBeenCalledWith(
				expect.arrayContaining([expect.objectContaining({ filename: 'dropped.png' })])
			);
		});
	});
});
