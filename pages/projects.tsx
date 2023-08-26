import React from "react";
import styled from "@emotion/styled";
import {
	Search,
	Tune,
	// Map as MapIcon,
	MapOutlined,
	GridView,
	ViewListOutlined
} from "@mui/icons-material";
import { Box, Divider, Grid, Typography, Button, Paper, IconButton } from "@mui/material";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "../components/dropdown/Dropdown";
import ProjectCard from "../components/projects/ProjectCard";
import dynamic from "next/dynamic";
import { ProjectTable } from "../components/tables/ProjectTable";
import { PageContainer } from "../components/pageContainer/PageContainer";

const Map = dynamic(() => import("../components/map/Map"), {
	ssr: false
});

const StyledInput = styled.input({
	fontSize: "1rem",
	border: 0,
	borderBottom: 1,
	boxShadow: "none",
	":focus": {
		outline: "none"
	}
});

// const StyledMain = styled.main({
// 	minHeight: "calc(100vh - 190px)",
// 	backgroundColor: "#f6f6f6"
// });

type SearchParams = {
  title: string;
  location: string;
  status: string;
  wildcard: string;
};

type ViewType = "card" | "list" | "map";

const Projects: NextPage<{ projects: Project[] }> = (data) => {
	const router = useRouter();

	const { t } = useTranslation(["projectpage", "common"]);

	const [search, setSearch] = useState<SearchParams>({
		title: "",
		location: t("allf"),
		status: t("allm"),
		wildcard: ""
	});

	const [projects] = useState<Project[]>(data.projects);

	const [projectSearchResults, setProjectSearchResults] = useState<Project[]>(projects);

	const [view, setView] = useState<ViewType>("card");

	const handleClick = (projectId: string) => {
		router.push(`projects/${projectId}`);
	};

	useEffect(() => {
		let results = projects;
		results = filterResultsByLocation(search.location, results);
		results = filterResultsByTitle(search.title, results);
		results = filterResultsByStatus(search.status, results);
		results = filterResultsByWildCard(search.wildcard, results);
		setProjectSearchResults(results);
	}, [search]);

	const filterResultsByLocation = (location: string, projects: Project[]): Project[] => {
		let result: Project[] = projects;
		if (location !== t("allf")) {
			result = projects.filter(
				(project) =>
					project.location && project.location.toLowerCase().includes(location.toLowerCase())
			);
			return result;
		}
		return result;
	};

	const filterResultsByStatus = (status: string, projects: Project[]): Project[] => {
		let result: Project[] = projects;
		if (status !== t("allm")) {
			result = projects.filter(
				(project) => project.status && project.status.toLowerCase().includes(status.toLowerCase())
			);
			return result;
		}
		return result;
	};

	const filterResultsByTitle = (param: string, projects: Project[]) => {
		let result: Project[] = projects;
		if (param !== "") {
			result = projects.filter((project) =>
				normalizeString(project.title.toLowerCase()).includes(normalizeString(param.toLowerCase()))
			);
		}
		return result;
	};

	const filterResultsByWildCard = (param: string, projects: Project[]) => {
		let result: Project[] = projects;
		if (param !== "") {
			const resultTitle = projects.filter((project) =>
				normalizeString(project.title.toLowerCase()).includes(normalizeString(param.toLowerCase()))
			);
			const resultLocation = projects.filter(
				(project) =>
					project.location &&
          normalizeString(project.location.toLowerCase()).includes(
          	normalizeString(param.toLowerCase())
          )
			);
			result = resultTitle.concat(resultLocation);
		}
		return result;
	};

	const normalizeString = (value: string): string => {
		return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
	};
	const locations = (projectData: Project[]): string[] => {
		const locationSet: string[] = [t("allf")];
		projectData.map((project) => {
			if (project.location && !locationSet.includes(project.location)) {
				locationSet.push(project.location);
			}
		});
		return locationSet;
	};

	const status = (projectData: Project[]): string[] => {
		const statusSet: string[] = [t("allm")];
		projectData.map((project) => {
			if (project.status && !statusSet.includes(t(`status.${project.status}`))) {
				statusSet.push(t(`status.${project.status}`));
			}
		});
		return statusSet;
	};

	const handleLocationChange = (location: string) => {
		setSearch((search) => ({ ...search, location: location }));
	};

	const handleViewChange = (view: ViewType) => {
		setView(view);
	};

	const handleStatusChange = (status: string) => {
		switch (status) {
		case t("status.completed"):
			setSearch((search) => ({ ...search, status: "completed" }));
			break;
		case t("status.building"):
			setSearch((search) => ({ ...search, status: "building" }));
			break;
		case t("status.open"):
			setSearch((search) => ({ ...search, status: "open" }));
			break;
		default:
			setSearch((search) => ({ ...search, status: t("allm") }));
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleTitleChange = (title: string) => {
		setSearch((search) => ({ ...search, title: title }));
	};
	const handleWildCardChange = (wildcard: string) => {
		setSearch((search) => ({ ...search, wildcard: wildcard }));
	};

	return (
		<PageContainer>
			<Box sx={{ pb: 15 }}>
				<Typography variant="h4" component="h1">
					{t("projectPageTitle")}
				</Typography>
				<Divider />
			</Box>
			<Paper sx={{ ml: 1, mr: 1, p: 2, mb: 2 }}>
				<Grid container spacing={2}>
					<Grid item>
						<Button size={"large"} variant={"outlined"} startIcon={<Search />} disableRipple>
							<StyledInput
								placeholder={t("searchPlaceholder")}
								onChange={(e) => handleWildCardChange(e.target.value)}
								value={search.wildcard}
							/>
						</Button>
					</Grid>
					<Grid item sx={{ ml: "auto" }}>
						<IconButton
							aria-label="map view"
							onClick={() => handleViewChange("map")}
							color={view === "map" ? "primary" : "default"}>
							<MapOutlined />
						</IconButton>
					</Grid>
					<Grid item>
						<IconButton
							aria-label="card view"
							onClick={() => handleViewChange("card")}
							color={view === "card" ? "primary" : "default"}>
							<GridView />
						</IconButton>
					</Grid>
					<Grid item>
						<IconButton
							aria-label="list view"
							onClick={() => handleViewChange("list")}
							color={view === "list" ? "primary" : "default"}>
							<ViewListOutlined />
						</IconButton>
					</Grid>
					<Grid item>
						<Typography sx={{ mr: 1, verticalAlign: "middle" }} component={"span"} variant="body1">
							{t("projectStatusFilterLabel")}:{" "}
						</Typography>
						<Dropdown
							label={"Status"}
							displayValue={search.status}
							options={status(projects)}
							valueChange={handleStatusChange}
						/>
					</Grid>
					<Grid item>
						<Typography sx={{ mr: 1, verticalAlign: "middle" }} component={"span"} variant="body1">
							{t("locationFilterLabel")}:{" "}
						</Typography>
						<Dropdown
							label={"Location"}
							displayValue={search.location}
							options={locations(projects)}
							valueChange={handleLocationChange}
						/>
					</Grid>
					<Grid item>
						<Button startIcon={<Tune />}>{t("filters")}</Button>
					</Grid>
				</Grid>
			</Paper>
			<Grid container>
				{view === "card" &&
          projectSearchResults.map((project, i) => (
          	<Grid key={i} item xs={12} md={6} p={1} onClick={() => handleClick(project.id)}>
          		<ProjectCard key={i} project={project} />
          	</Grid>
          ))}
			</Grid>
			{view === "map" && (
				<div id="map" style={{ height: 480, padding: "8px" }}>
					<Map
						centerCoordinates={[38.56633674453089, -7.925327404275489]}
						markers={projectSearchResults.map((project) => project.coordinates)}
						zoom={6}
					/>
				</div>
			)}
			{view === "list" && <ProjectTable />}
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
	const res = await fetch(`${process.env.API_URL}/project`);
	const projects = (await res.json()) as Project[];

	return {
		props: {
			projects,
			...(await serverSideTranslations(ctx.locale, ["common", "footer", "header", "projectpage"]))
		}
	};
};

export default Projects;
