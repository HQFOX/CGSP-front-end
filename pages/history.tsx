import React from 'react';

import type { NextPage } from 'next';

import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import {
	ProjectInventory,
	ProjectInventoryProps
} from '../components/projects/projectInventory/ProjectInventory';
import {
	fetchFilterValues,
	fetchProjectsPage,
	queryToApiParams
} from '../components/projects/projectInventory/utils';

const History: NextPage<ProjectInventoryProps> = (data) => {
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
			<ProjectInventory
				initialPage={data.initialPage}
				initialParams={data.initialParams}
				initialFilterValues={data.initialFilterValues}
				history
			/>
		</PageContainer>
	);
};
export const getServerSideProps = async (ctx: any) => {
	const initialParams = queryToApiParams(ctx.query);
	const [initialPage, initialFilterValues] = await Promise.all([
		fetchProjectsPage(true, initialParams),
		// The filters are secondary to the listing, so the client retries if this fails
		fetchFilterValues().catch(() => null)
	]);
	return {
		props: {
			initialPage,
			initialParams,
			initialFilterValues,
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
