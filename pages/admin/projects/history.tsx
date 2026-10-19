import React, { Suspense, useCallback, useState } from 'react';

import type { NextPage } from 'next';

import { Box, Divider, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { PageProjectListItemDTO } from '../../../api/model';
import { getGetAllProjectsHistoryUrl } from '../../../api/project-controller/project-controller';
import { PageContainer } from '../../../components/pageContainer/PageContainer';
import {
	ADMIN_PROJECTS_PAGE_SIZE,
	ProjectManager
} from '../../../components/projects/ProjectManager';

const ProjectHistoryAdmin: NextPage<{ initialPage: PageProjectListItemDTO }> = (data) => {
	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Projetos Concluídos
				</Typography>
				<Divider />
			</Box>
			<ProjectManager initialPage={data.initialPage} type="history" />
		</PageContainer>
	);
};

export const getServerSideProps = async (ctx: any) => {
	const res = await fetch(
		`${process.env.API_URL}${getGetAllProjectsHistoryUrl({ page: 0, size: ADMIN_PROJECTS_PAGE_SIZE })}`
	);
	const initialPage = (await res.json()) as PageProjectListItemDTO;

	return {
		props: {
			initialPage,
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
		}
	};
};

export default ProjectHistoryAdmin;
