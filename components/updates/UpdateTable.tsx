import React, { useEffect } from 'react';

import { Delete, Edit } from '@mui/icons-material';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import Image from 'next/image';

import { formatDate } from '../../utils/utils';
// import Image from "next/image";

import { DeleteModal } from '../modals/DeleteModal';
import { TableActions } from './TableActions';

export const UpdateTable = ({
  updates,
  handleShowEditForm,
  handleDelete
}: {
  updates: Update[];
  handleShowEditForm: (update: Update) => void;
  handleDelete: (id: string | undefined) => void;
}) => {
  const [data, setData] = React.useState(updates);

  useEffect(() => {
    setData(updates);
  }, [updates]);

  const [deleteModal, setDeleteModal] = React.useState<{ open: boolean; data: Update | undefined }>(
    { open: false, data: undefined }
  );

  const columnHelper = createColumnHelper<Update>();

  const columns = [
    columnHelper.accessor('title', {
      id: 'title',
      cell: (info) => <Typography>{info.getValue()}</Typography>,
      header: () => <Typography>Título</Typography>
    }),
    columnHelper.accessor('files', {
      id: 'files',
      cell: (info) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_S3_URL}${info.getValue()?.[0].filename}`}
          alt={''}
          width={50}
          height={50}
        />
      ),
      header: () => <Typography>Imagem</Typography>
    }),
    columnHelper.accessor('content', {
      cell: (info) => <Typography>{info.getValue()}</Typography>,
      header: () => <Typography>Conteúdo</Typography>
    }),
    columnHelper.accessor('createdOn', {
      cell: (info) => <Typography>{formatDate(info.getValue())}</Typography>,
      header: () => <Typography>Data</Typography>
    }),
    columnHelper.display({
      id: 'actions',
      cell: (element) => (
        <div style={{ display: 'inline-flex' }}>
          <IconButton
            onClick={() => {
              handleShowEditForm(element.row.original);
              console.log(element.row.original);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton onClick={() => setDeleteModal({ data: element.row.original, open: true })}>
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
    getPaginationRowModel: getPaginationRowModel()
  });

  const { pageSize, pageIndex } = table.getState().pagination;

  const handleDeleteClose = (confirm: boolean) => {
    confirm && deleteModal.data && handleDelete(deleteModal.data.id);
    setDeleteModal({ ...deleteModal, open: false });
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
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child tr': { border: 0 } }}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    scope="row"
                    key={cell.id}
                    style={{ textAlign: cell.column.id === 'actions' ? 'end' : 'inherit' }}
                  >
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
        rowsPerPageOptions={[5, 10, 25, { label: 'Todas', value: data.length }]}
        onRowsPerPageChange={(e) => {
          const size = e.target.value ? Number(e.target.value) : 10;
          table.setPageSize(size);
        }}
        ActionsComponent={TableActions}
        labelRowsPerPage={'Atualizações por página'}
      />
      <DeleteModal
        open={deleteModal.open}
        data={deleteModal.data}
        handleClose={(confirm) => handleDeleteClose(confirm)}
      />
    </div>
  );
};
