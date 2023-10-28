import React, { SyntheticEvent } from "react";
import { Button, Grid, IconButton, Paper, Popper, Slider, Stack, Typography } from "@mui/material";
import { GridView, MapOutlined, Search, Tune } from "@mui/icons-material";
import Dropdown from "../dropdown/Dropdown";
import { useTranslation } from "next-i18next";
import { ViewType } from "../../pages/projects";
import styled from "@emotion/styled";
import { SearchParams } from "../projectInventory/ProjectInventory";

const StyledInput = styled.input({
	fontSize: "1rem",
	border: 0,
	borderBottom: 1,
	boxShadow: "none",
	":focus": {
		outline: "none"
	}
});


export interface ControlProps {
    search: SearchParams
    view?: ViewType
    locations?: string[],
    status?: string[],
	priceRange?: number[],
    onWildCardChange?: (wildcard: string) => void,
    onViewChange?: (view: ViewType) => void,
    onStatusChange?: (status: string) => void,
    onLocationChange?: (location: string) => void,
	onPriceRangeChange?: (range: number[]) => void
}

export const Controls = ({
	search,
	view = "card",
	locations = [],
	status = [],
	priceRange = [0,0],
	onWildCardChange,
	onViewChange,
	onStatusChange,
	onLocationChange,
	onPriceRangeChange,
}: ControlProps) => {

	const { t } = useTranslation("projectpage");

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
	  setAnchorEl(anchorEl ? null : event.currentTarget);
	};
  
	const open = Boolean(anchorEl);
	const id = open ? "simple-popper" : undefined;

	// const [priceRangeS, setPriceRange] = React.useState<number[]>(priceRange);

	const handleChange = (event: Event, newValue: number | number[]) => {
		if(newValue instanceof Array)
			onPriceRangeChange ? onPriceRangeChange(newValue) : undefined;
	};

	return (
		<Paper sx={{ ml: 1, mr: 1, p: 2, mb: 2 }}>
			<Grid container spacing={2}>
				{onWildCardChange && 
                     <Grid item>
                    	<Button size={"large"} variant={"outlined"} startIcon={<Search />} disableRipple>
                    		<StyledInput
                    			placeholder={t("searchPlaceholder")}
                    			onChange={(e) => onWildCardChange(e.target.value)}
                    			value={search.wildcard}
                    		/>
                    	</Button>
                     </Grid>
				}
				{onViewChange &&
                    <Grid item sx={{ ml: "auto" }}>
                    	<IconButton
                    		aria-label="map view"
                    		onClick={() => onViewChange("map")}
                    		color={view === "map" ? "primary" : "default"}>
                    		<MapOutlined />
                    	</IconButton>
                    	<IconButton
                    		aria-label="card view"
                    		onClick={() => onViewChange("card")}
                    		color={view === "card" ? "primary" : "default"}>
                    		<GridView />
                    	</IconButton>
                    </Grid>
				}
				{/* <Grid item>
                <IconButton
                    aria-label="list view"
                    onClick={() => handleViewChange("list")}
                    color={view === "list" ? "primary" : "default"}>
                    <ViewListOutlined />
                </IconButton>
            </Grid> */}
				{onStatusChange &&
                    <Grid item>
                    	<Typography sx={{ mr: 1, verticalAlign: "middle" }} component={"span"} variant="body1">
                    		{t("projectStatusFilterLabel")}:{" "}
                    	</Typography>
                    	<Dropdown
                    		label={"Status"}
                    		displayValue={search.status}
                    		options={status}
                    		valueChange={onStatusChange}
                    	/>
                    </Grid>
				}
				{onLocationChange && 
                    <Grid item>
                    	<Typography sx={{ mr: 1, verticalAlign: "middle" }} component={"span"} variant="body1">
                    		{t("locationFilterLabel")}:{" "}
                    	</Typography>
                    	<Dropdown
                    		label={"Location"}
                    		displayValue={search.location}
                    		options={locations}
                    		valueChange={onLocationChange}
                    	/>
                    </Grid>
				}
				<Grid item>
					<Button startIcon={<Tune />} sx={{ textTransform: "capitalize" }} onClick={handleClick}>{t("filters")}</Button>
					<Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
						<Paper sx={{p: 4}} >
							<Stack spacing={2} >
								{onStatusChange &&
									<div>
										<Typography sx={{ mr: 1, verticalAlign: "middle" }} component={"span"} variant="body1">
											{"Estado de Atribuição"}:{" "}
										</Typography>
										<Dropdown
											label={"Status"}
											displayValue={search.status}
											options={status}
											valueChange={onStatusChange}
										/>
									</div>
								}
								{onLocationChange && 
									<div>
										<Typography sx={{ mr: 1, verticalAlign: "middle" }} component={"span"} variant="body1">
											{"Tipologias"}:{" "}
										</Typography>
										<Dropdown
											label={"Location"}
											displayValue={search.location}
											options={locations}
											valueChange={onLocationChange}
										/>
									</div>
								}
								<div>
									<Typography sx={{ mr: 1, verticalAlign: "middle" }} component={"span"} variant="body1">
										Preço:
									</Typography>
									<Slider
										getAriaLabel={() => "price range"}
										value={search.priceRange}
										onChange={handleChange}
										valueLabelDisplay="auto"
										marks={[{value: priceRange[0], label: priceRange[0]}, {value: priceRange[1], label: priceRange[1]}]}
										min={priceRange[0]}
										max={priceRange[1]}
										// getAriaValueText={valuetext}
									/>
								</div>
							</Stack>
						</Paper>
					</Popper>
				</Grid>
			</Grid>
		</Paper>
	);
};