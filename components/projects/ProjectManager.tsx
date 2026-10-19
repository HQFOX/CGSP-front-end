import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { Add } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import router from 'next/router';

import { PageProjectListItemDTO } from '../../api/model';
import { Loading, StyledButton } from '../../components';
import { ProjectForm } from '../forms/ProjectForm';
import { dataFetch } from '../forms/utils';
import ProjectTable from '../tables/ProjectTable';
import { fetchProjectsPage, getProjectsQueryKey } from './projectInventory/utils';

export const ADMIN_PROJECTS_PAGE_SIZE = 10;

export interface ProjectManagerProps {
	type: 'current' | 'history';
	initialPage?: PageProjectListItemDTO;
}

interface Priority {
	id: string;
	priority?: number;
}

export const ProjectManager = ({ type, initialPage }: ProjectManagerProps) => {
	const history = type === 'history';

	const queryClient = useQueryClient();

	const [editProject, setEditProject] = useState<Project | undefined>();
	const [showEditProjectForm, setShowEditProjectForm] = useState(false);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: ADMIN_PROJECTS_PAGE_SIZE
	});

	const params = { page: pagination.pageIndex, size: pagination.pageSize };

	const isInitialParams =
		pagination.pageIndex === 0 && pagination.pageSize === ADMIN_PROJECTS_PAGE_SIZE;

	const { data, isFetching } = useQuery({
		queryKey: getProjectsQueryKey(history, params),
		queryFn: ({ signal }) => fetchProjectsPage(history, params, { signal }),
		initialData: isInitialParams ? initialPage : undefined,
		placeholderData: keepPreviousData,
		staleTime: 60 * 1000
	});

	const projects = useMemo(() => (data?.content ?? []) as Project[], [data]);
	const totalElements = data?.totalElements ?? 0;
	const totalPages = data?.totalPages ?? 0;

	// Deleting the last project of the last page leaves the current page out of range
	useEffect(() => {
		if (totalPages > 0 && pagination.pageIndex >= totalPages) {
			setPagination((prev) => ({ ...prev, pageIndex: totalPages - 1 }));
		}
	}, [totalPages, pagination.pageIndex]);

	const initialPriorityList = useMemo<Priority[]>(
		() => projects.map((project) => ({ id: project.id, priority: project.priority })),
		[projects]
	);

	const [priorityList, setPriorityList] = useState<Priority[]>(initialPriorityList);

	// Unsaved reordering is discarded when another page is loaded
	useEffect(() => {
		setPriorityList(initialPriorityList);
	}, [initialPriorityList]);

	// Edits can move a project between the current and history lists, so refresh both
	const refreshData = async () => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: getProjectsQueryKey(false) }),
			queryClient.invalidateQueries({ queryKey: getProjectsQueryKey(true) })
		]);
	};

	const handleDelete = async (id: string | undefined) => {
		if (id) {
			const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`;

			await dataFetch('DELETE', endpoint, undefined, true)
				.then((response) => {
					if (response.ok) {
						refreshData();
					} else {
						throw new Error('Project Delete ' + response.status);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const handleShowProjectForm = (project: Project) => {
		setEditProject(project);
		setShowEditProjectForm(true);
		window.document.getElementById('editprojectform')?.scrollIntoView({ behavior: 'smooth' });
	};

	// Rows only hold the current page, so priorities are offset by the rows of previous pages
	const handleUpdateProjectsPriority = useCallback(
		(updatedProjects: Project[]) => {
			const offset = pagination.pageIndex * pagination.pageSize;
			const priority: Priority[] = updatedProjects.map((project, index) => ({
				id: project.id,
				priority: offset + index
			}));
			setPriorityList(priority);
		},
		[pagination]
	);

	const handlePaginationChange = (pageIndex: number, pageSize: number) => {
		setPagination({ pageIndex, pageSize });
	};

	const setUpdateProjectsPriority = async () => {
		const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/project/priority`;

		// priorityList.forEach
		const res = await dataFetch('PATCH', endpoint, priorityList, true)
			.then((response) => {
				refreshData();
			})
			.catch((error) => {
				console.log('error', error);
			});
	};

	return (
		<>
			<Grid container mt={2} mb={2} spacing={2}>
				<Grid>
					<StyledButton
						startIcon={<Add />}
						variant="contained"
						onClick={() => router.push('create')}
						disabled={showEditProjectForm}>
						Adicionar Projecto
					</StyledButton>
				</Grid>
				<Grid>
					<StyledButton
						startIcon={isFetching ? <Loading height="16px" icon /> : <UploadSimpleIcon />}
						variant="outlined"
						onClick={setUpdateProjectsPriority}
						disabled={
							!priorityList || JSON.stringify(priorityList) === JSON.stringify(initialPriorityList)
						}>
						Atualizar Prioridades
					</StyledButton>
				</Grid>
			</Grid>
			<ProjectTable
				projects={projects}
				handleShowProjectForm={handleShowProjectForm}
				handleDelete={handleDelete}
				handleUpdateProjectPriority={handleUpdateProjectsPriority}
				loading={isFetching}
				rowCount={totalElements}
				pageIndex={pagination.pageIndex}
				pageSize={pagination.pageSize}
				onPaginationChange={handlePaginationChange}
			/>
			<div id="editprojectform">
				{showEditProjectForm && (
					<Suspense fallback={<Loading />}>
						<ProjectForm
							project={editProject}
							onCancel={() => setShowEditProjectForm(false)}
							onSubmit={refreshData}
						/>
					</Suspense>
				)}
			</div>
		</>
	);
};
