import React, { Suspense, useCallback, useState } from 'react';

import type { NextPage } from 'next';

import { Box, Divider, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { PageContainer } from '../../../components/pageContainer/PageContainer';
import { ProjectManager } from '../../../components/projects/ProjectManager';

const ProjectCurrentAdmin: NextPage<{ projects: Project[] }> = (data) => {
	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Projetos Atuais
				</Typography>
				<Divider />
			</Box>
			<ProjectManager projects={data.projects} type="current" />
		</PageContainer>
	);
};
export const getServerSideProps = async (ctx: any) => {
	const res = await fetch(`${process.env.API_URL}/project/current`);
	const projects = (await res.json()) as Project[];

	return {
		props: {
			projects,
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
		}
	};
};

export default ProjectCurrentAdmin;
