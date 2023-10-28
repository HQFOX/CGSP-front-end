import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { Controls } from "../controls/Controls";
import { Fade, Grid } from "@mui/material";
import ProjectCard from "../projects/ProjectCard";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../map/Map"), {
	ssr: false
});

export const normalizeString = (value: string): string => {
	return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
};

const getPriceRange = (projects: Project[]) => {
	const priceRange: (number | undefined)[] = [undefined,undefined];

	projects.map((project) => {
		project.typologies?.map((typology) => {
			if(typology.price){
				if(priceRange[0] == undefined || priceRange[0] > typology.price)
					priceRange[0] = typology.price;
				if(priceRange[1] == undefined || priceRange[1] < typology.price)
					priceRange[1] = typology.price;
			}
		});
	});
	console.log(priceRange);
	return priceRange as number[];
};


export type SearchParams = {
	title: string;
	location: string;
	status: string;
	assignmentStatus: string;
	constructionStatus: string;
	priceRange: number[];
	wildcard: string;
  };

export type ViewType = "card" | "list" | "map";

export interface ProjectInventoryProps {
    projects: Project[],
    history?: boolean,
}

export const ProjectInventory = ({
	projects = [],
	history = false,

}: ProjectInventoryProps) => {
	const router = useRouter();

	const { t } = useTranslation(["projectpage", "common"]);

	const [search, setSearch] = useState<SearchParams>({
		title: "",
		location: t("allf"),
		status: t("allm"),
		assignmentStatus: "",
		constructionStatus: "",
		priceRange: getPriceRange(projects),
		wildcard: ""
	});

	const [projectSearchResults, setProjectSearchResults] = useState<Project[]>(projects);

	const [animationStart, setAnimationStart] = useState(false);

	const [view, setView] = useState<ViewType>("card");

	const handleClick = (projectId: string) => {
		router.push(`projects/${projectId}`);
	};

	useEffect(() => {
		setAnimationStart(true);

	},[projectSearchResults]);

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

	const filterResultsByPrice = (param: number[], projects: Project[]) => {
		let result: Project[] = projects;
		
		result = projects.filter( (project) => 
			project.typologies?.filter( (typology ) => typology.price >= param[0] && typology.price <= param[1] ).length > 0
		);
		console.log(result);
		return result;
	};

	useMemo(() => {
		let results = projects;
		results = filterResultsByLocation(search.location, results);
		results = filterResultsByTitle(search.title, results);
		results = filterResultsByStatus(search.status, results);
		results = filterResultsByWildCard(search.wildcard, results);
		results = filterResultsByPrice(search.priceRange, results);
		setProjectSearchResults(results);
	}, [search, projects]);


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

	const onLocationChange = (location: string) => {
		setSearch((search) => ({ ...search, location: location }));
	};

	const onViewChange = (view: ViewType) => {
		setView(view);
	};

	const onStatusChange = (status: string) => {
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

	const onPriceRangeChange = (range: number[]) => {
		setSearch((search) => ({ ...search, priceRange: range }));
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onTitleChange = (title: string) => {
		setSearch((search) => ({ ...search, title: title }));
	};
	const onWildCardChange = (wildcard: string) => {
		setSearch((search) => ({ ...search, wildcard: wildcard }));
	};

	return (
		<>
			<Controls
				search={search}
				view={view}
				locations={locations(projects)}
				status={status(projects)}
				priceRange={getPriceRange(projects)}
				onWildCardChange={onWildCardChange}
				onViewChange={onViewChange}
				onStatusChange={history ? undefined : onStatusChange}
				onLocationChange={onLocationChange} 
				onPriceRangeChange={onPriceRangeChange}
			/>
			<Grid container>
				{view === "card" &&
                        projectSearchResults.map((project, i) => (
                        	<Fade key={i} in={animationStart} style={{ transitionDelay: animationStart ? `${i}00ms` : "0ms" }} unmountOnExit>
                        		<Grid key={i} item xs={12} md={6} p={1} onClick={() => handleClick(project.id)}>
                        			<ProjectCard key={i} project={project} />
                        		</Grid>
                        	</Fade>
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
			{/* {view === "list" && <ProjectTable />} */}
		</>
	);
};