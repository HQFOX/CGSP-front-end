import React, { Suspense, useCallback, useMemo, useState } from 'react';

import { Add } from '@mui/icons-material';
import { Box, Divider, Grid2 as Grid, Typography } from '@mui/material';
import { UploadSimple } from '@phosphor-icons/react/dist/ssr';
import router from 'next/router';

import { StyledButton } from '../Button';
import { ProjectForm } from '../forms/ProjectForm';
import { dataFetch } from '../forms/utils';
import { Loading } from '../loading/Loading';
import ProjectTable from '../tables/ProjectTable';

export interface ProjectManagerProps {
	type: 'current' | 'history';
	projects: Project[];
}

interface Priority {
	id: string;
	priority?: number;
}

export const ProjectManager = ({ type, projects: projectsProp }: ProjectManagerProps) => {
	const [projects, setProjects] = useState<Project[]>(projectsProp);
	const [editProject, setEditProject] = useState<Project | undefined>();
	const [showEditProjectForm, setShowEditProjectForm] = useState(false);

	const [initialPriorityList, setInitialPriorityList] = useState(
		projectsProp.map((project) => ({ id: project.id, priority: project.priority }))
	);

	const [priorityList, setPriorityList] = useState<Priority[]>(initialPriorityList);

	const [loading, setLoading] = useState(false);

	const refreshData = async () => {
		setLoading(true);
		setProjects([]);
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/current`);
		if (res.status == 200) {
			const projects = (await res.json()) as Project[];

			setProjects(projects);
			setInitialPriorityList(
				projects.map((project) => ({ id: project.id, priority: project.priority }))
			);
		}
		setLoading(false);
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

	const handleUpdateProjectsPriority = useCallback((updatedProjects: Project[]) => {
		const priority: Priority[] = updatedProjects.map((project, index) => ({
			id: project.id,
			priority: index
		}));
		setPriorityList(priority);
	}, []);

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
						startIcon={loading ? <Loading height="16px" icon /> : <UploadSimple />}
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
				loading={loading}
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
