import React, { useEffect } from "react";
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	TablePagination,
	Typography
} from "@mui/material";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from "@tanstack/react-table";
import { Delete, Edit } from "@mui/icons-material";

import { SortAscending, SortDescending } from "@phosphor-icons/react";

import { DeleteModal } from "../modals/DeleteModal";


export const EnrollRequestTable = ({ requests, projects, handleShowEditForm, handleDelete }: { requests: EnrollRequest[], projects: Project[], handleShowEditForm: (request: EnrollRequest) => void, handleDelete: (id: string | undefined) => void}) => {
	const [data, setData ] = React.useState(requests);

	const [sorting, setSorting] = React.useState<SortingState>([{ "id": "createdOn", "desc": true}])

	useEffect(() => {
		setData(requests);
	},[requests]);

	const [deleteModal, setDeleteModal] = React.useState<{open: boolean, data: EnrollRequest | undefined}>({ open: false, data: undefined});

	const findProject = (id?: string) => {
		if(!id) return "-"
		const project = projects.find( p => p.id === id);
		return project?.title ?? "-";
	}

	const columnHelper = createColumnHelper<EnrollRequest>();

	const columns = 
			[
				columnHelper.accessor("firstName", {
					id: "firstName",
					cell: (info) => <Typography>{info.getValue()}</Typography>,
					header: () => <Typography>Primeiro Nome</Typography>
				}),
				columnHelper.accessor("lastName", {
					id: "lastName",
					cell: (info) => <Typography>{info.getValue()}</Typography>,
					header: () => <Typography>Último nome</Typography>
				}),
				columnHelper.accessor("telephoneNumber", {
					id: "telephoneNumber",
					cell: (info) => <Typography>{info.getValue()}</Typography>,
					header: () => <Typography>Número de Telefone</Typography>
				}),
				columnHelper.accessor("email", {
					cell: (info) => <Typography>{info.getValue()}</Typography>,
					header: () => <Typography>Email</Typography>
				}),
				columnHelper.accessor("projectId", {
					cell: (info) => <Typography>{findProject(info.getValue())}</Typography>,
					header: () => <Typography>Project Id</Typography>
				}),
				columnHelper.accessor("status", {
					cell: (info) => <Typography>{info.getValue()}</Typography>,
					header: () => <Typography>Estado</Typography>
				}),
				columnHelper.accessor("subscribedUpdates", {
					cell: (info) => <Typography>{info.getValue()?.toString() === "true" ? "Sim" : "Não"}</Typography>,
					header: () => <Typography>Subscrito a atualizações</Typography>
				}),
				columnHelper.accessor("createdOn", {
					cell: (info) => <Typography>{info.getValue()}</Typography>,
					header: () => <Typography>Data de Criação</Typography>
				}),
				columnHelper.display({
					id: "actions",
					cell: (element) => (
						<div style={{ display: "inline-flex" }}>
							<IconButton
								onClick={() => {
									handleShowEditForm(element.row.original);
								}}>
								<Edit />
							</IconButton>
							<IconButton onClick={() => setDeleteModal({data: element.row.original, open: true})}>
								<Delete />
							</IconButton>
						</div>
					)
				})
			];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(), //client-side sorting
		onSortingChange: setSorting,
		state: {
			sorting,
		  },
	});

	const { pageSize, pageIndex } = table.getState().pagination;

	const handleDeleteClose = (confirm: boolean) => {
		confirm && deleteModal.data && handleDelete(deleteModal.data.id);
		setDeleteModal({...deleteModal, open: false});
	};

	return (
		<div>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableCell key={header.id} component="th">
										<div onClick={header.column.getToggleSortingHandler()} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer"}} className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
											{{
                          asc: <SortAscending />,
                          desc: <SortDescending /> ,
                        }[header.column.getIsSorted() as string] ?? null}
										</div>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								{row.getVisibleCells().map((cell) => (
									<TableCell scope="row" key={cell.id} style={{textAlign: cell.column.id === "actions" ? "end": "inherit"}}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={table.getFilteredRowModel().rows.length}
				page={pageIndex}
				onPageChange={(_, page) => { 
					table.setPageIndex(page);
				}}
				rowsPerPage={pageSize}
				rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: data.length }]}
				onRowsPerPageChange={e => {
					const size = e.target.value ? Number(e.target.value) : 10;
					table.setPageSize(size);
				}}
				// ActionsComponent={TableActions}
				labelRowsPerPage="Pedidos por página"
			/>
			<DeleteModal open={deleteModal.open} data={deleteModal.data} handleClose={(confirm) =>handleDeleteClose(confirm)}/>
		</div>
	);
};
