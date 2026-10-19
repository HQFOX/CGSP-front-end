import React from 'react';

import type { NextPage } from 'next';

import { Box, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import {
	ProjectInventory,
	ProjectInventoryProps
} from '../components/projects/projectInventory/ProjectInventory';
import { fetchProjectsPage, queryToApiParams } from '../components/projects/projectInventory/utils';

export const normalizeString = (value: string): string => {
	return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

export type ViewType = 'card' | 'list' | 'map';

const Projects: NextPage<ProjectInventoryProps> = (data) => {
	const { t } = useTranslation(['projectpage', 'common']);

	return (
		<PageContainer>
			<Box sx={{ p: 2, pb: 4 }}>
				<Title variant="h5" component="h1" fontSize={24}>
					{t('projectPageTitle')}
				</Title>
				<Divider />
			</Box>
			<ProjectInventory initialPage={data.initialPage} initialParams={data.initialParams} />
		</PageContainer>
	);
};
export const getServerSideProps = async (ctx: any) => {
	const initialParams = queryToApiParams(ctx.query);
	const initialPage = await fetchProjectsPage(false, initialParams);
	return {
		props: {
			initialPage,
			initialParams,
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
		}
	};
};

export default Projects;
