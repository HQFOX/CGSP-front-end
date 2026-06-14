import React from 'react';

import { NextPage } from 'next';

import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { FileUploader } from '../components';

const Playground: NextPage<{}> = () => {
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

			<FileUploader name="playground" maxFiles={2} files={[]} title="playground" allowVideoFiles />
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
