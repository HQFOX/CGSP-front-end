import React from 'react';

import type { NextPage } from 'next';

import { Box, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { ProjectDTO } from '../api/model';
import { getAllProjectsCurrent } from '../api/project-controller/project-controller';
import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import { ProjectInventory } from '../components/projects/projectInventory/ProjectInventory';

export const normalizeString = (value: string): string => {
	return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

export type ViewType = 'card' | 'list' | 'map';

const Projects: NextPage<{ projects: ProjectDTO[] }> = (data) => {
	const { t } = useTranslation(['projectpage', 'common']);

	return (
		<PageContainer>
			<Box sx={{ p: 2, pb: 4 }}>
				<Title variant="h5" component="h1" fontSize={24}>
					{t('projectPageTitle')}
				</Title>
				<Divider />
			</Box>
			<ProjectInventory projects={data.projects as Project[]} />
		</PageContainer>
	);
};
export const getServerSideProps = async (ctx: any) => {
	const projects = await getAllProjectsCurrent();
	return {
		props: {
			projects,
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
		}
	};
};

export default Projects;
