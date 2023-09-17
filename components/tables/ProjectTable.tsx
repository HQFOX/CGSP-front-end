import React, { useEffect } from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton } from "@mui/material";
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Delete, Edit } from "@mui/icons-material";
import { DeleteModal } from "../modals/DeleteModal";
import { TableActions } from "../updates/TableActions";

export const ProjectTable = ({ projects, handleShowProjectForm, handleDelete }: { projects: Project[], handleShowProjectForm: (update: Project) => void, handleDelete: (id: string | undefined) => void}) => {
	const [data, setData ] = React.useState(projects);

	useEffect(() => {
		setData(projects);
	},[projects]);

	const [deleteModal, setDeleteModal] = React.useState<{open: boolean, data: Project | undefined}>({ open: false, data: undefined});

	const columnHelper = createColumnHelper<Project>();

	const columns = 
			[
				columnHelper.accessor("title", {
					id: "title",
					cell: (info) => info.getValue(),
					header: () => <span>Title</span>
				}),
				columnHelper.accessor("status", {
					cell: (info) => <i>{info.getValue()}</i>,
					header: () => <span>Status</span>
				}),
				columnHelper.accessor("location", {
					cell: (info) => <span>{info.getValue()}</span>,
					header: () => <span>Location</span>
				}),
				columnHelper.display({
					id: "actions",
					cell: (element) => (
						<div style={{ display: "inline-flex"}}>
							<IconButton
								onClick={() => {
									handleShowProjectForm(element.row.original);
									console.log(element.row.original);
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
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								{row.getVisibleCells().map((cell) => (
									<TableCell component="th" scope="row" key={cell.id}>
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
				rowsPerPageOptions={[5, 10, 25, { label: "All", value: data.length }]}
				onRowsPerPageChange={e => {
					const size = e.target.value ? Number(e.target.value) : 10;
					table.setPageSize(size);
				}}
				ActionsComponent={TableActions}
			/>
			<DeleteModal open={deleteModal.open} data={deleteModal.data} handleClose={(confirm) =>handleDeleteClose(confirm)}/>
		</div>
	);
};