import React, { CSSProperties, useEffect, useId, useMemo, useState } from 'react';

import { Delete, DragIndicator, Edit } from '@mui/icons-material';
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
  Row,
  useReactTable
} from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { formatDate } from '../../utils/utils';
import { DeleteModal } from '../modals/DeleteModal';
import { TableActions } from '../updates/TableActions';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Loading } from '../loading/Loading';

// Cell Component
const DragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <IconButton {...attributes} {...listeners}>
      <DragIndicator />
    </IconButton>
  )
}

const DraggableRow = ({ row }: { row: Row<Project>}) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    background: isDragging ? '#f0f0f0' : 'transparent', // Debugging visibility
  }

  return (
    // connect row ref to dnd-kit, apply important styles
    <TableRow
       key={row.id} 
       ref={setNodeRef} 
       sx={{ '&:last-child td, &:last-child tr': { border: 0 } }} style={style}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export interface ProjectTableProps {
  projects: Project[];
  loading: boolean;
  handleShowProjectForm: (update: Project) => void;
  handleDelete: (id: string | undefined) => void;
  handleUpdateProjectPriority: (projects: Project[]) => void;
}

const ProjectTable = ({
  projects,
  loading = false,
  handleShowProjectForm,
  handleDelete,
  handleUpdateProjectPriority,

}: ProjectTableProps) => {
  const [data, setData] = useState<Project[]>(projects);

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id),
    [data]
  )

  const { t } = useTranslation(['projectpage', 'common']);

  const [deleteModal, setDeleteModal] = React.useState<{
    open: boolean;
    data: Project | undefined;
  }>({ open: false, data: undefined });

  const columnHelper = createColumnHelper<Project>();

  const columns = useMemo(() => { return [
    columnHelper.accessor('priority', {
      id: "priority",
      cell: ({row}) =>  (<DragHandleCell rowId={row.id} />),
      header: () => <Typography>Prioridade</Typography>,
      size: 60,
    }),
    columnHelper.accessor('title', {
      id: 'title',
      cell: (info) => <Typography>{info.getValue()}</Typography>,
      header: () => <Typography>Título</Typography>
    }),
    columnHelper.accessor('coverPhoto', {
      id: 'coverPhoto',
      cell: (info) =>
        info.getValue()?.filename && (
          <Image
            src={`${process.env.NEXT_PUBLIC_S3_URL}${info.getValue()?.filename}`}
            alt={''}
            width={50}
            height={50}
            priority
          />
        ),
      header: () => <Typography>Imagem</Typography>
    }),
    columnHelper.accessor('assignmentStatus', {
      cell: (info) => <Typography>{t(`assignmentStatus.${info.getValue()}`)}</Typography>,
      header: () => <Typography>Estado de Atribuição</Typography>
    }),
    columnHelper.accessor('constructionStatus', {
      cell: (info) => <Typography>{t(`constructionStatus.${info.getValue()}`)}</Typography>,
      header: () => <Typography>Estado de Construção</Typography>
    }),
    columnHelper.accessor('district', {
      cell: (info) => <Typography>{info.getValue()}</Typography>,
      header: () => <Typography>Distrito</Typography>
    }),
    columnHelper.accessor('county', {
      cell: (info) => <Typography>{info.getValue()}</Typography>,
      header: () => <Typography>Município</Typography>
    }),
    columnHelper.accessor('lots', {
      cell: (info) => <Typography>{info.getValue()}</Typography>,
      header: () => <Typography>Lotes</Typography>
    }),
    columnHelper.accessor('assignedLots', {
      cell: (info) => <Typography>{info.getValue()}</Typography>,
      header: () => <Typography>Lotes Atribuidos</Typography>
    }),
    columnHelper.accessor('createdOn', {
      cell: (info) => <Typography>{formatDate(info.getValue())}</Typography>,
      header: () => <Typography>Data de Criação</Typography>
    }),
    columnHelper.display({
      id: 'actions',
      cell: (element) => (
        <div style={{ display: 'inline-flex' }}>
          <IconButton
            onClick={() => {
              handleShowProjectForm(element.row.original);
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
},[data])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id, 
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false
  });

  const { pageSize, pageIndex } = table.getState().pagination;

  const handleDeleteClose = (confirm: boolean) => {
    confirm && deleteModal.data && handleDelete(deleteModal.data.id);
    setDeleteModal({ ...deleteModal, open: false });
  };

  // reorder rows after drag & drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {

      setData((prevData) => {
        const oldIndex = prevData.findIndex((item) => item.id === active.id);
        const newIndex = prevData.findIndex((item) => item.id === over.id);
    
        if (oldIndex !== -1 && newIndex !== -1) {
          const newData = arrayMove(prevData, oldIndex, newIndex);
          handleUpdateProjectPriority(newData);
          return newData; // Ensure React detects the change
        }
    
        return prevData;
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  return (
    <DndContext
    id={"dndContext"}
    collisionDetection={closestCenter}
    modifiers={[restrictToVerticalAxis]}
    onDragEnd={handleDragEnd}
    sensors={sensors}
    >
      <div>
      <TableContainer component={Paper}>
        { loading ? <Loading height='100px'/> : 
        <Table sx={{ minWidth: 650 }} aria-label="project table">
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
            <SortableContext
              key={data.map((d) => d.id).join(',')}
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
            {table.getRowModel().rows.map((row) => (
              <DraggableRow key={row.id} row={row} />
            ))}
            </SortableContext>
          </TableBody>
        </Table>
        }
      </TableContainer>
      <TablePagination
        component="div"
        count={table.getFilteredRowModel().rows.length}
        page={pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page);
        }}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: data.length }]}
        onRowsPerPageChange={(e) => {
          const size = e.target.value ? Number(e.target.value) : 10;
          table.setPageSize(size);
        }}
        ActionsComponent={TableActions}
        labelRowsPerPage={'Projetos por página'}
      />
      <DeleteModal
        open={deleteModal.open}
        data={deleteModal.data}
        handleClose={(confirm) => handleDeleteClose(confirm)}
      />
      </div>
    </DndContext>
  );
};

export default ProjectTable;