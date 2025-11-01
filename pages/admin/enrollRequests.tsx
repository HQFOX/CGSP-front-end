import React, { Suspense, useEffect, useState } from 'react';

import { EChartsOption } from 'echarts';
import { NextPage } from 'next';

import { Add } from '@mui/icons-material';
import {
	Box,
	CardContent,
	CardHeader,
	Divider,
	Grid2 as Grid,
	TextField,
	Typography
} from '@mui/material';
import NumberFlow from '@number-flow/react';
import { TrendUp } from '@phosphor-icons/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Loading, StyledButton } from '../../components';
import { StyledCard } from '../../components/StyledCard';
import { Title } from '../../components/Title';
import { EChartsWrapper } from '../../components/charts/EChartsWrapper';
import { KpiPie } from '../../components/charts/PieChart';
import { EnrollRequestTable } from '../../components/enrollrequests/EnrollRequestTable';
import { EnrollRequestForm } from '../../components/forms/EnrollRequestForm';
import { dataFetch } from '../../components/forms/utils';
import { PageContainer } from '../../components/pageContainer/PageContainer';
import theme from '../../theme';

const countFromLastWeek = (requests: EnrollRequest[]): number => {
	const now = new Date();

	// Get current day of week (0 = Sunday, 1 = Monday, ...)
	const currentDay = now.getDay();

	// Calculate start of this week (Sunday)
	const startOfThisWeek = new Date(now);
	startOfThisWeek.setDate(now.getDate() - currentDay);
	startOfThisWeek.setHours(0, 0, 0, 0);

	// Calculate start of last week
	const startOfLastWeek = new Date(startOfThisWeek);
	startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

	// End of last week is start of this week
	const endOfLastWeek = new Date(startOfThisWeek);

	// Count timestamps that fall between start and end of last week
	return requests.filter((request) => {
		if (request.createdOn) {
			const date = new Date(request.createdOn);
			return date >= startOfLastWeek && date < endOfLastWeek;
		}
	}).length;
};

const Kpi = ({ total: totalProp, week }: { total: number; week: number }) => {
	const [total, setTotal] = useState(0);

	useEffect(() => {
		setTotal(totalProp);
	}, [totalProp, setTotal]);

	return (
		<StyledCard variant="outlined">
			<CardHeader title={<Title>Total de Pedidos:</Title>} />
			<CardContent>
				<div style={{ display: 'flex', textAlign: 'center', justifyContent: 'space-between' }}>
					<Typography fontSize={32}>{total}</Typography>
					{week > 0 && (
						<div>
							<Typography variant={'body2'}>
								+<NumberFlow value={week} /> Esta semana
							</Typography>
							<TrendUp color={theme.palette.success.main} />
						</div>
					)}
				</div>
			</CardContent>
		</StyledCard>
	);
};

const AnualChart = ({ requests }: { requests: EnrollRequest[] }) => {
	const currentYear = new Date().getFullYear();

	const option: EChartsOption = {
		tooltip: {
			trigger: 'axis'
		},
		xAxis: {
			type: 'time',
			name: 'Data',
			axisLabel: {
				formatter: (value: any) => {
					// Optional: customize label format
					const date = new Date(value);
					return `${date.getMonth() + 1}/${date.getDate()}`;
				}
			}
		},
		yAxis: {
			axisTick: { length: 5 },
			type: 'value'
		},
		series: [
			{
				type: 'line',
				data: requests.map((request, index) => [request.createdOn, index])
			}
		],
		dataZoom: [
			{
				type: 'slider',
				xAxisIndex: 0, // explicitly apply to the first x-axis
				startValue: `${currentYear}-01-01T00:00:00Z`,
				endValue: `${currentYear}-12-31T23:59:59Z`
			},
			{
				type: 'inside',
				xAxisIndex: 0
			}
		]
	};

	return (
		<StyledCard variant="outlined">
			<CardHeader title={<Title>Pedidos ao Long do Tempo:</Title>} />
			<CardContent>
				<EChartsWrapper option={option} style={{ height: '200px' }} />
			</CardContent>
		</StyledCard>
	);
};

const EnrollRequestsAdmin: NextPage = () => {
	const [requests, setRequests] = useState<EnrollRequest[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [editRequest, setEditRequest] = useState<EnrollRequest | undefined>();
	const [showAddRequestForm, setShowAddRequestForm] = useState(false);
	const [showEditRequestForm, setShowEditRequestForm] = useState(false);
	const [pieStats, setPieStats] = useState({
		approved: 0,
		refused: 0,
		waiting: 0,
		numberOfSubscribed: 0
	});

	const [search, setSearch] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			const data = dataFetch('GET', `${process.env.NEXT_PUBLIC_API_URL}/enroll`, null, true).then(
				(res) => {
					if (res.ok) {
						const response = res.json() as unknown as EnrollRequest[];
						return response;
					} else {
						throw new Error('Error fetching requests ' + res.status);
					}
				}
			);

			setRequests(await data);
		};
		fetchData().catch((e) => {
			console.error('An error occurred while fetching the data: ', e);
		});

		const fetchProjects = async () => {
			const data = dataFetch(
				'GET',
				`${process.env.NEXT_PUBLIC_API_URL}/project`,
				undefined,
				true
			).then((res) => {
				if (res.ok) {
					const response = res.json() as unknown as Project[];
					return response;
				} else {
					throw new Error('Error fetching projects ' + res.status);
				}
			});

			setProjects(await data);
		};
		fetchProjects().catch((e) => {
			console.error('An error occurred while fetching the data: ', e);
		});
	}, []);

	useEffect(() => {
		let approved = 0;
		let refused = 0;
		let waiting = 0;
		let numberOfSubscribed = 0;

		requests.forEach((request) => {
			if (request.status === 'Approved') {
				approved++;
			} else if (request.status === 'Refused') {
				refused++;
			} else {
				waiting++;
			}
			if (request.subscribedUpdates) {
				numberOfSubscribed++;
			}
			setPieStats({ approved, refused, waiting, numberOfSubscribed });
		});
	}, [requests]);

	const refreshData = async () => {
		const res = await dataFetch(
			'GET',
			`${process.env.NEXT_PUBLIC_API_URL}/enroll`,
			undefined,
			true
		);
		if (res.status == 200) {
			const request = (await res.json()) as EnrollRequest[];

			setRequests(request);
		}
	};

	const handleDelete = async (id: string | undefined) => {
		if (id) {
			const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/enroll/${id}`;

			await dataFetch('DELETE', endpoint, undefined, true)
				.then((response) => {
					if (response.ok) {
						console.log(`EnrollRequest ${id} deleted`);
						refreshData();
					} else {
						throw new Error('EnrollRequest Delete ' + response.status);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const handleShowEnrollRequestForm = (request: EnrollRequest) => {
		setEditRequest(request);
		setShowEditRequestForm(true);
		window.document.getElementById('editprojectform')?.scrollIntoView({ behavior: 'smooth' });
	};

	const requestStatusPieData = [
		{
			name: 'Aprovados',
			value: pieStats.approved,
			color: theme.palette.success.main
		},
		{
			name: 'Recusados',
			value: pieStats.refused,
			color: theme.palette.secondary.dark
		},
		{
			name: 'Em espera',
			value: pieStats.waiting,
			color: theme.palette.warning.main
		}
	];

	const requestNotificationsPieData = [
		{
			name: 'Sim',
			value: pieStats.numberOfSubscribed,
			color: theme.palette.success.main
		},
		{
			name: 'Não',
			value: requests.length - pieStats.numberOfSubscribed,
			color: theme.palette.secondary.dark
		}
	];

	return (
		<PageContainer admin>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Tabela de Pedidos de Inscrição
				</Typography>
				<Divider />
			</Box>
			<Grid container spacing={2} justifyContent="center">
				<Grid size={{ xs: 12, md: 3 }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							height: '100%'
						}}>
						<KpiPie title={'Estado dos Pedidos'} data={requestStatusPieData} />
						<KpiPie title={'Subscrições a Notificações'} data={requestNotificationsPieData} />
					</div>
				</Grid>
				<Grid size={{ xs: 12, md: 7 }}>
					<AnualChart requests={requests} />
				</Grid>
				<Grid size={{ xs: 12, md: 2 }}>
					<Kpi total={requests.length} week={countFromLastWeek(requests)} />
				</Grid>
			</Grid>
			{!showAddRequestForm && (
				<Grid
					container
					mt={2}
					mb={2}
					p={2}
					gap={1}
					style={{
						backgroundColor: 'white',
						border: '1px solid',
						borderColor: 'rgb(237, 237, 237)',
						alignItems: 'center'
					}}>
					<Grid>
						<TextField
							label={'Pesquisar'}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							size="small"
						/>
					</Grid>
					<Grid>
						<StyledButton
							startIcon={<Add />}
							variant="contained"
							onClick={() => setShowAddRequestForm(true)}>
							Adicionar Pedido de Inscrição
						</StyledButton>
					</Grid>
				</Grid>
			)}
			<EnrollRequestTable
				requests={requests}
				projects={projects}
				handleDelete={handleDelete}
				handleShowEditForm={handleShowEnrollRequestForm}
				searchValue={search}
				setSearchValue={setSearch}
			/>
			{showAddRequestForm && (
				<Suspense fallback={<Loading />}>
					<EnrollRequestForm
						projects={projects}
						onCancel={() => setShowAddRequestForm(false)}
						onSubmit={() => refreshData()}
					/>
				</Suspense>
			)}
			<div id="editEnrollRequestForm">
				{showEditRequestForm && (
					<Suspense fallback={<Loading />}>
						<EnrollRequestForm
							request={editRequest}
							projects={projects}
							onCancel={() => setShowEditRequestForm(false)}
							onSubmit={() => refreshData()}
						/>
					</Suspense>
				)}
			</div>
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
				'projectpage',
				'enroll'
			]))
		}
	};
};

export default EnrollRequestsAdmin;
