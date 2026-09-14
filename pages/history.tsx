import React from 'react';

import type { NextPage } from 'next';

import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { ProjectDTO } from '../api/model';
import { getAllProjectsHistory } from '../api/project-controller/project-controller';
import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import { ProjectInventory } from '../components/projects/projectInventory/ProjectInventory';

const History: NextPage<{ projects: ProjectDTO[] }> = (data) => {
	const { t } = useTranslation(['history', 'projectpage', 'common']);

	return (
		<PageContainer>
			<Box sx={{ p: 2, pb: 4 }}>
				<Title variant="h5" component="h1" fontSize={24}>
					{t('historyTitle')}
				</Title>
				<Divider />
				<Typography sx={{ pt: 2, textIndent: 35 }} variant="body2" color="text.secondary">
					{t('historyP1')}
				</Typography>
			</Box>
			<ProjectInventory projects={data.projects as Project[]} history />
		</PageContainer>
	);
};
export const getServerSideProps = async (ctx: any) => {
	const projects = await getAllProjectsHistory();
	return {
		props: {
			projects,
			...(await serverSideTranslations(ctx.locale, [
				'common',
				'footer',
				'header',
				'projectpage',
				'history'
			]))
		}
	};
};

export default History;
