import React, { useEffect, useState } from 'react';

import { Box, Divider, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BasicChart } from '../../components/charts/BasicChart';
import { dataFetch } from '../../components/forms/utils';
import { Loading } from '../../components/loading/Loading';
import { PageContainer } from '../../components/pageContainer/PageContainer';

const DashBoard = () => {
	const [projects, setProjects] = useState<Project[] | undefined>(undefined);

	useEffect(() => {
		const fetchData = async () => {
			const data = dataFetch(
				'GET',
				`${process.env.NEXT_PUBLIC_API_URL}/project/current`,
				null,
				true
			).then((res) => {
				if (res.ok) {
					return res.json() as unknown as Project[];
				} else {
					throw new Error('Error fetching projects ' + res.status);
				}
			});

			setProjects(await data);
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
