import React, { useEffect, useState } from 'react';

import { Box, Divider, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { PageProjectListItemDTO } from '../../api/model';
import { getGetAllProjectsCurrentUrl } from '../../api/project-controller/project-controller';
import { BasicChart } from '../../components/charts/BasicChart';
import { dataFetch } from '../../components/forms/utils';
import { Loading } from '../../components/loading/Loading';
import { PageContainer } from '../../components/pageContainer/PageContainer';

const CHART_FETCH_PAGE_SIZE = 100;

// The chart plots every current project, so walk through all pages of the list
const fetchAllCurrentProjects = async (): Promise<Project[]> => {
	const projects: Project[] = [];
	let page = 0;
	let last = false;
	while (!last) {
		const res = await dataFetch(
			'GET',
			`${process.env.NEXT_PUBLIC_API_URL}${getGetAllProjectsCurrentUrl({ page, size: CHART_FETCH_PAGE_SIZE })}`,
			null,
			true
		);
		if (!res.ok) throw new Error('Error fetching projects ' + res.status);
		const body = (await res.json()) as PageProjectListItemDTO;
		projects.push(...((body.content ?? []) as Project[]));
		last = body.last ?? true;
		page++;
	}
	return projects;
};

const DashBoard = () => {
	const [projects, setProjects] = useState<Project[] | undefined>(undefined);

	useEffect(() => {
		const fetchData = async () => {
			setProjects(await fetchAllCurrentProjects());
		};
		fetchData().catch((e) => {
			// handle the error as needed
			console.error('An error occurred while fetching the data: ', e);
		});
	}, []);

	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Pedidos de Inscrição ativos
				</Typography>
				<Divider />
			</Box>
			{projects ? <BasicChart chartData={projects} /> : <Loading />}
		</PageContainer>
	);
};

export const getServerSideProps = async (ctx: any) => {
	return {
		props: {
			...(await serverSideTranslations(ctx.locale, [
				'common',
				'footer',
				'header',
				'enroll',
				'projectpage'
			]))
		}
	};
};

export default DashBoard;
