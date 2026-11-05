import React, { useEffect, useState } from 'react';

import type { NextPage } from 'next';

import { FilterAltOff } from '@mui/icons-material';
import { Box, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { getGetAuditLogsQueryKey } from '../../api/audit-log-controller/audit-log-controller';
import { StyledButton } from '../../components';
import {
	AUDIT_ACTION_LABELS,
	AUDIT_ENTITY_TYPE_LABELS,
	AUDIT_LOGS_PAGE_SIZE,
	AUDIT_OUTCOME_LABELS,
	AuditLogFilters,
	EMPTY_AUDIT_LOG_FILTERS,
	fetchAuditLogsPage,
	toAuditLogsParams
} from '../../components/auditlogs/utils';
import { PageContainer } from '../../components/pageContainer/PageContainer';
import { AuditLogTable } from '../../components/tables/AuditLogTable';

const FILTER_DEBOUNCE_MS = 400;

const AuditLogsAdmin: NextPage = () => {
	const [filters, setFilters] = useState<AuditLogFilters>(EMPTY_AUDIT_LOG_FILTERS);
	// Typing in a filter only queries the API once the user pauses
	const [appliedFilters, setAppliedFilters] = useState<AuditLogFilters>(EMPTY_AUDIT_LOG_FILTERS);

	const [sorting, setSorting] = useState<SortingState>([{ id: 'occurredAt', desc: true }]);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: AUDIT_LOGS_PAGE_SIZE
	});

	useEffect(() => {
		const timeout = setTimeout(() => {
			setAppliedFilters(filters);
			setPagination((prev) => ({ ...prev, pageIndex: 0 }));
		}, FILTER_DEBOUNCE_MS);
		return () => clearTimeout(timeout);
	}, [filters]);

	const params = toAuditLogsParams(
		appliedFilters,
		sorting,
		pagination.pageIndex,
		pagination.pageSize
	);

	const { data, isPending, isError } = useQuery({
		queryKey: getGetAuditLogsQueryKey(params),
		queryFn: ({ signal }) => fetchAuditLogsPage(params, { signal }),
		placeholderData: keepPreviousData
	});

	const handleFilterChange =
		(key: keyof AuditLogFilters) => (e: React.ChangeEvent<HTMLInputElement>) =>
			setFilters((prev) => ({ ...prev, [key]: e.target.value }));

	const handleSortingChange = (updater: React.SetStateAction<SortingState>) => {
		setSorting(updater);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	const hasFilters = Object.values(filters).some((value) => value !== '');

	return (
		<PageContainer admin>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Registos de Auditoria
				</Typography>
				<Divider />
			</Box>
			<Grid
				container
				style={{
					backgroundColor: 'white',
					border: '1px solid',
					borderColor: 'rgb(237, 237, 237)',
					alignItems: 'center'
				}}
				sx={{
					mt: 2,
					mb: 2,
					p: 2,
					gap: 1
				}}>
				<Grid>
					<TextField
						label="Utilizador"
						value={filters.actor}
						onChange={handleFilterChange('actor')}
						size="small"
					/>
				</Grid>
				<Grid>
					<TextField
						select
						label="Ação"
						value={filters.action}
						onChange={handleFilterChange('action')}
						size="small"
						sx={{ minWidth: 200 }}>
						<MenuItem value="">Todas</MenuItem>
						{Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid>
					<TextField
						select
						label="Entidade"
						value={filters.entityType}
						onChange={handleFilterChange('entityType')}
						size="small"
						sx={{ minWidth: 160 }}>
						<MenuItem value="">Todas</MenuItem>
						{Object.entries(AUDIT_ENTITY_TYPE_LABELS).map(([value, label]) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid>
					<TextField
						label="ID da Entidade"
						value={filters.entityId}
						onChange={handleFilterChange('entityId')}
						size="small"
					/>
				</Grid>
				<Grid>
					<TextField
						select
						label="Resultado"
						value={filters.outcome}
						onChange={handleFilterChange('outcome')}
						size="small"
						sx={{ minWidth: 140 }}>
						<MenuItem value="">Todos</MenuItem>
						{Object.entries(AUDIT_OUTCOME_LABELS).map(([value, label]) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid>
					<TextField
						type="datetime-local"
						label="Desde"
						value={filters.from}
						onChange={handleFilterChange('from')}
						size="small"
						slotProps={{ inputLabel: { shrink: true } }}
					/>
				</Grid>
				<Grid>
					<TextField
						type="datetime-local"
						label="Até"
						value={filters.to}
						onChange={handleFilterChange('to')}
						size="small"
						slotProps={{ inputLabel: { shrink: true } }}
					/>
				</Grid>
				<Grid>
					<StyledButton
						startIcon={<FilterAltOff />}
						variant="outlined"
						onClick={() => setFilters(EMPTY_AUDIT_LOG_FILTERS)}
						disabled={!hasFilters}>
						Limpar Filtros
					</StyledButton>
				</Grid>
			</Grid>
			{isError && (
				<Typography
					color="error"
					sx={{
						mb: 2
					}}>
					Não foi possível carregar os registos de auditoria.
				</Typography>
			)}
			<AuditLogTable
				logs={data?.content ?? []}
				loading={isPending}
				rowCount={data?.totalElements ?? 0}
				pageIndex={pagination.pageIndex}
				pageSize={pagination.pageSize}
				onPaginationChange={(pageIndex, pageSize) => setPagination({ pageIndex, pageSize })}
				sorting={sorting}
				onSortingChange={handleSortingChange}
			/>
		</PageContainer>
	);
};

export const getServerSideProps = async (ctx: any) => {
	return {
		props: {
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
		}
	};
};

export default AuditLogsAdmin;
