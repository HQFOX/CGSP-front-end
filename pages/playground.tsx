import React, { useState } from 'react';

import { NextPage } from 'next';

import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { AbstractFile, FileUploader } from '../components';
import { CGSPDropzone } from '../components/dropzone/Dropzone';

const Playground: NextPage<{}> = () => {
	const [files, setFiles] = useState<AbstractFile[]>([]);

	const handleAddFile = (newFiles: File[]) => {
		// Wrap File objects as AbstractFile for demo
		const wrapped = newFiles.map((file) => ({ file, filename: file.name }) as AbstractFile);
		setFiles((prev) => [...prev, ...wrapped]);
	};

	const handleDeleteFile = (file: AbstractFile) => {
		setFiles((prev) => prev.filter((f) => f.filename !== file.filename));
	};

	if (process.env.NODE_ENV === 'production') {
		return null;
	}

	return (
		<div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
			<h1>Component Playground</h1>
			<div>
				<h2>Video</h2>
				<video controls width="100%">
					<source
						src="https://cgsp-dev-bucket.s3.eu-west-3.amazonaws.com/GOPR2067.MP4"
						type="video/mp4"
					/>
				</video>
			</div>
			<CGSPDropzone
				label="Test Dropzone"
				maxContent={3}
				files={files}
				onAddFile={handleAddFile}
				onDeleteFile={handleDeleteFile}
			/>

			<FileUploader
				name="playground"
				maxFiles={2}
				files={files}
				title="playground"
				allowVideoFiles
			/>
		</div>
	);
};

// Optionally, block SSR in production for extra safety
export async function getServerSideProps(ctx: any) {
	if (process.env.NODE_ENV === 'production') {
		return { notFound: true };
	}
	return {
		props: {
			...(await serverSideTranslations(ctx.locale, [
				'common',
				'footer',
				'header',
				'projectpage',
				'history'
			]))
		}
	};
}

export default Playground;
