import React, { Suspense } from 'react';

import type { NextPage } from 'next';

import { Box, Divider, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { Loading, PageContainer, ProjectForm } from '../../../components';

const ProjectCreateAdmin: NextPage<{ projects: Project[] }> = (data) => {
	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Projetos
				</Typography>
				<Divider />
			</Box>
			<Suspense fallback={<Loading />}>
				<ProjectForm />
			</Suspense>
		</PageContainer>
	);
};

export const getServerSideProps = async (ctx: any) => {
	return {
		props: {
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
		}
	};
};

export default ProjectCreateAdmin;
