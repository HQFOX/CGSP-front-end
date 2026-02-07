import { useState } from 'react';

import { CheckCircle, Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { ArrowCounterClockwiseIcon, FileArrowUpIcon } from '@phosphor-icons/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { Loading } from '../../../components';
import { AbstractFile } from '../utils';
import { styles } from './styles';

export interface FileListInterface {
	files: AbstractFile[];
	onDeleteFile: (file: AbstractFile) => void;
	onRetryFile: (file: AbstractFile) => Promise<AbstractFile>;
}

export const FileList = (props: FileListInterface) => {
	const { t } = useTranslation(['common']);
	const [loading, setLoading] = useState<{ [filename: string]: boolean }>({});

	const handleRetryWithLoading = async (
		file: AbstractFile,
		onRetryFile: (file: AbstractFile) => Promise<AbstractFile>
	) => {
		setLoading((prev) => ({ ...prev, [file.filename]: true }));
		await onRetryFile(file).finally(() =>
			setLoading((prev) => ({ ...prev, [file.filename]: false }))
		);
	};

	return props.files.map((file, index) => {
		const isLoading = loading[file.filename] ?? false;

		return (
			<div key={file.filename + index} className={styles.listItem}>
				{file.file && (
					<Image
						src={URL.createObjectURL(file.file)}
						alt={t('fileUploader.submittedImage')}
						width={100}
						height={100}
					/>
				)}
				<span>{file.filename}</span>
				<div className={styles.itemActions}>
					{file.link ? (
						<Tooltip title={t('fileUploader.fileReadyToSend')}>
							<CheckCircle color="success" data-testid="CheckCircleIcon" />
						</Tooltip>
					) : (
						<Tooltip title={t('fileUploader.retryUpload')}>
							<IconButton onClick={() => handleRetryWithLoading(file, props.onRetryFile)}>
								{isLoading ? (
									<div style={{ height: 24, width: 24, justifyContent: 'center', display: 'flex' }}>
										<Loading icon />
									</div>
								) : (
									<ArrowCounterClockwiseIcon data-testid="ArrowCounterClockwiseIcon" />
								)}
							</IconButton>
						</Tooltip>
					)}
					{file.file && (
						<Tooltip title={t('fileUploader.fileBeingUploaded')}>
							<FileArrowUpIcon data-testid="FileArrowUpIcon" />
						</Tooltip>
					)}
					<IconButton
						onClick={() => props.onDeleteFile(file)}
						aria-label={t('fileUploader.deleteFile')}>
						<Delete />
					</IconButton>
				</div>
			</div>
		);
	});
};
