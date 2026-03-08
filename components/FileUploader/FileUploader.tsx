import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { cx } from '@emotion/css';
import { Typography } from '@mui/material';
import { UploadSimpleIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useTranslation } from 'next-i18next';

import { AbstractFile, convertFileToAbstractFile, getPresignedUrl } from '.';
import { Loading, StyledButton } from '..';
import { FileList } from './FileList';
import { styles } from './styles';

const EMPTY_FILES: AbstractFile[] = [];

export interface FileUploaderProps {
	title?: string;
	name: string;
	label?: string;
	maxFiles?: number;
	files?: AbstractFile[];
	onChange?: (value: AbstractFile[]) => void;
	error?: string[] | string;
	touched?: boolean;
	acceptedFileTypes?: HTMLInputElement['accept'][];
}

export const FileUploader = (props: FileUploaderProps) => {
	const { t } = useTranslation(['common']);
	const {
		name,
		maxFiles = 1,
		files: filesProp = EMPTY_FILES,
		label,
		acceptedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'],
		onChange,
		touched
	} = props;

	const [files, setFiles] = useState<AbstractFile[]>(filesProp);
	const [disabled, setDisabled] = useState(false);
	const [highlightToggle, setHighlightToggle] = useState<boolean>(false);
	const inputFileRef = useRef<HTMLInputElement | null>(null);
	const [error, setError] = useState<string[] | string>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const inputId = useId();

	// Sync internal state with Formik value
	useEffect(() => {
		setFiles(filesProp);
	}, [filesProp]);

	// Notify Formik of changes
	const notifyChange = useCallback(
		(newFiles: AbstractFile[]) => {
			setFiles(newFiles);
			onChange?.(newFiles);
		},
		[onChange]
	);

	const handleValidation = (fileList: FileList) => {
		const errors: string[] = [];
		const fileArray = Array.from(fileList);

		const acceptedFiles: typeof fileArray = [];
		const rejectedFiles: typeof fileArray = [];

		fileArray.forEach((file) => {
			if (acceptedFileTypes.includes(file.type)) {
				acceptedFiles.push(file);
			} else {
				rejectedFiles.push(file);
			}
		});

		// Validate max files
		if (acceptedFiles.length + files.length > maxFiles) {
			errors.push(t('fileUploader.maxFilesError', { max: maxFiles }));
			setError(errors);
			return [];
		}
		// Validate accepted file types
		if (rejectedFiles.length > 0) {
			errors.push(
				t('fileUploader.invalidFileTypes', { files: rejectedFiles.map((f) => f.name).join(', ') })
			);
		}

		setError(errors);
		return acceptedFiles;
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		setHighlightToggle(true);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		if (event.currentTarget.contains(event.relatedTarget as Node)) return;
		setHighlightToggle(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setHighlightToggle(false);
		const droppedFiles = event.dataTransfer.files;
		handleChange(droppedFiles);
	};

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = event.target.files;
		if (!nextValue) return;

		handleChange(nextValue);
	};

	const handleChange = async (fileList: FileList) => {
		setLoading(true);
		const validFiles = handleValidation(fileList);
		const convertedFiles: AbstractFile[] = validFiles.map((file) =>
			convertFileToAbstractFile(file)
		);

		const presignedFiles = convertedFiles.map((file) => {
			return getPresignedUrl(file);
		});
		try {
			const results = await Promise.all(presignedFiles);
			const newFiles = [...files, ...results];
			notifyChange(newFiles);
		} catch (error) {
			console.error('Error uploading files:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleRetryFile = useCallback(
		async (fileToRetry: AbstractFile) => {
			const promise = await getPresignedUrl(fileToRetry).then((updatedFile) => {
				if (updatedFile) {
					const newFiles = files.map((file) => (file === fileToRetry ? updatedFile : file));
					notifyChange(newFiles);
				}
				return updatedFile;
			});
			return promise;
		},
		[files, notifyChange]
	);

	const handleDeleteFile = (fileToDelete: AbstractFile) => {
		const newFiles = files.filter((file) => file !== fileToDelete);
		notifyChange(newFiles);
	};

	// Display Formik errors or validation errors
	const displayErrors =
		touched && props.error
			? Array.isArray(props.error)
				? props.error
				: [props.error]
			: Array.isArray(error)
				? error
				: [error];

	const input = (
		<input
			name={name}
			type="file"
			ref={inputFileRef}
			multiple={maxFiles > 1}
			onChange={handleInput}
			style={{ display: 'none' }}
			disabled={disabled}
			aria-labelledby={inputId}
			accept={acceptedFileTypes.join(',')}
		/>
	);

	return (
		<>
			{props.title && <Typography variant="h6">{props.title}</Typography>}
			<section
				className={cx(styles.container, { [styles.highlight]: highlightToggle })}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				aria-label={props.title || t('fileUploader.fileUploader')}
				id={inputId}>
				{loading ? <Loading height="32px" icon /> : <UploadSimpleIcon size={32} />}
				<Typography component={'span'} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					{label || t('fileUploader.dragFilesOr')} {input}
					<StyledButton
						disabled={disabled}
						variant="text"
						color="primary"
						onClick={() => inputFileRef.current?.click()}>
						{t('fileUploader.clickHere')}
					</StyledButton>
				</Typography>
				<Typography component={'span'}>
					{t('fileUploader.acceptedFiles', { types: acceptedFileTypes.join(', ') })}
				</Typography>
				{displayErrors.length > 0 && (
					<div style={{ color: 'red' }}>
						{displayErrors.map((error, index) => (
							<span key={index} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
								<WarningCircleIcon />
								<Typography component={'span'}>{error}</Typography>
							</span>
						))}
					</div>
				)}
			</section>
			<FileList files={files} onDeleteFile={handleDeleteFile} onRetryFile={handleRetryFile} />
		</>
	);
};
