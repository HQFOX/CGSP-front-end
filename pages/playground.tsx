import React, { useState } from 'react';

import { NextPage } from 'next';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { AbstractFile, Carousel, FileUploader } from '../components';
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

	const images = [
		{
			id: 1,
			url: 'https://images.pexels.com/photos/29089597/pexels-photo-29089597/free-photo-of-stunning-autumn-beach-sunset-with-waves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
		},
		{ id: 2, url: 'https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg' },
		{
			id: 3,
			url: 'https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
		},
		{
			id: 4,
			url: 'https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
		},
		{
			id: 5,
			url: 'https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
		}
	];

	return (
		<div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
			<h1>Component Playground</h1>
			<CGSPDropzone
				label="Test Dropzone"
				maxContent={3}
				files={files}
				onAddFile={handleAddFile}
				onDeleteFile={handleDeleteFile}
			/>

			<FileUploader name="playground" maxFiles={3} files={files} title="playground" />
			<h2> Carousel </h2>
			<div style={{ width: 200, height: 200 }}>
				<Carousel images={images} />
			</div>
			<div style={{ width: '100%', height: 400 }}>
				<Carousel images={images} autoSlide={true} />
			</div>
			<div style={{ width: '100%', height: 400 }}>
				<Carousel images={images} vertical autoSlide={true} />
			</div>
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
