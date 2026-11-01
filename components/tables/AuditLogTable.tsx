import React, { useMemo } from 'react';

import {
	Chip,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Typography
} from '@mui/material';
import { SortAscendingIcon, SortDescendingIcon } from '@phosphor-icons/react';
import {
	OnChangeFn,
	SortingState,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table';

import { AuditLogDTO, AuditLogDTOOutcome } from '../../api/model';
import {
	AUDIT_ACTION_LABELS,
	AUDIT_ENTITY_TYPE_LABELS,
	AUDIT_OUTCOME_LABELS
} from '../auditlogs/utils';
import { Loading } from '../loading/Loading';
import { TableActions } from '../updates/TableActions';

const getOutcomeColor = (outcome?: AuditLogDTOOutcome) => {
	switch (outcome) {
		case 'SUCCESS':
			return 'success';
		case 'FAILURE':
			return 'error';
		case 'DENIED':
			return 'warning';
		default:
			return 'info';
	}
};

const formatDateTime = (value?: string) =>
	value
		? new Date(value).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'medium' })
		: '-';

// Long values (user agents, exception names) are cut to one line, with the full text on hover
const TruncatedText = ({ value }: { value?: string }) =>
	value ? (
		<Tooltip title={value}>
			<Typography noWrap sx={{ maxWidth: 220 }}>
				{value}
			</Typography>
		</Tooltip>
	) : (
		<Typography>-</Typography>
	);

export interface AuditLogTableProps {
	logs: AuditLogDTO[];
	loading: boolean;
	// Pagination and sorting are server-side: rowCount is the total across all pages
	rowCount: number;
	pageIndex: number;
	pageSize: number;
	onPaginationChange: (pageIndex: number, pageSize: number) => void;
	sorting: SortingState;
	onSortingChange: OnChangeFn<SortingState>;
}

export const AuditLogTable = ({
	logs,
	loading,
	rowCount,
	pageIndex,
	pageSize,
	onPaginationChange,
	sorting,
	onSortingChange
}: AuditLogTableProps) => {
	const columnHelper = createColumnHelper<AuditLogDTO>();

	const columns = useMemo(
		() => [
			columnHelper.accessor('occurredAt', {
				id: 'occurredAt',
				cell: (info) => <Typography noWrap>{formatDateTime(info.getValue())}</Typography>,
				header: () => <Typography>Data</Typography>
			}),
			columnHelper.accessor('actor', {
				id: 'actor',
				cell: (info) => <Typography>{info.getValue() ?? '-'}</Typography>,
				header: () => <Typography>Utilizador</Typography>
			}),
			columnHelper.accessor('action', {
				id: 'action',
				cell: (info) => {
					const value = info.getValue() ?? '';
					return <Typography>{AUDIT_ACTION_LABELS[value] ?? (value || '-')}</Typography>;
				},
				header: () => <Typography>Ação</Typography>
			}),
			columnHelper.accessor('entityType', {
				id: 'entityType',
				cell: (info) => {
					const value = info.getValue() ?? '';
					return <Typography>{AUDIT_ENTITY_TYPE_LABELS[value] ?? (value || '-')}</Typography>;
				},
				header: () => <Typography>Entidade</Typography>
			}),
			columnHelper.accessor('entityId', {
				id: 'entityId',
				cell: (info) => <TruncatedText value={info.getValue()} />,
				header: () => <Typography>ID da Entidade</Typography>
			}),
			columnHelper.accessor('outcome', {
				id: 'outcome',
				cell: (info) => {
					const value = info.getValue();
					return value ? (
						<Chip label={AUDIT_OUTCOME_LABELS[value]} size="small" color={getOutcomeColor(value)} />
					) : (
						<Typography>-</Typography>
					);
				},
				header: () => <Typography>Resultado</Typography>
			}),
			columnHelper.accessor('errorType', {
				id: 'errorType',
				cell: (info) => <TruncatedText value={info.getValue()} />,
				header: () => <Typography>Erro</Typography>
			}),
			columnHelper.accessor('ipAddress', {
				id: 'ipAddress',
				cell: (info) => <Typography>{info.getValue() ?? '-'}</Typography>,
				header: () => <Typography>Endereço IP</Typography>
			}),
			columnHelper.accessor('userAgent', {
				id: 'userAgent',
				cell: (info) => <TruncatedText value={info.getValue()} />,
				header: () => <Typography>User Agent</Typography>
			})
		],
		[columnHelper]
	);

	const table = useReactTable({
		data: logs,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row, index) => row.id ?? String(index),
		manualPagination: true,
		manualSorting: true,
		// The back-end falls back to newest first, so an unsorted state adds nothing
		enableSortingRemoval: false,
		sortDescFirst: true,
		rowCount,
		onSortingChange,
		state: { pagination: { pageIndex, pageSize }, sorting }
	});

	return (
		<div>
			<TableContainer component={Paper}>
				{loading ? (
					<Loading height="100px" />
				) : (
					<Table sx={{ minWidth: 650 }} aria-label="audit log table">
						<TableHead>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableCell key={header.id} component="th">
											<div
												onClick={header.column.getToggleSortingHandler()}
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													gap: '4px',
													cursor: 'pointer'
												}}>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
												{{
													asc: <SortAscendingIcon />,
													desc: <SortDescendingIcon />
												}[header.column.getIsSorted() as string] ?? null}
											</div>
										</TableCell>
									))}
								</TableRow>
							))}
						</TableHead>
						<TableBody>
							{table.getRowModel().rows.length === 0 ? (
								<TableRow>
									<TableCell colSpan={columns.length} align="center">
										<Typography color="textSecondary">Sem registos</Typography>
									</TableCell>
								</TableRow>
							) : (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				)}
			</TableContainer>
			<TablePagination
				component="div"
				count={rowCount}
				page={pageIndex}
				onPageChange={(_, page) => {
					onPaginationChange(page, pageSize);
				}}
				rowsPerPage={pageSize}
				rowsPerPageOptions={[10, 25, 50, 100]}
				onRowsPerPageChange={(e) => {
					const size = e.target.value ? Number(e.target.value) : 25;
					onPaginationChange(0, size);
				}}
				ActionsComponent={TableActions}
				labelRowsPerPage={'Registos por página'}
			/>
		</div>
	);
};

export default AuditLogTable;
