import React from "react";

import {  Typography, Grid, CardContent } from "@mui/material";

import Image from "next/image";

const CarouselCard = ({ index, item }: CarouselCardProps) => {
	return (
		// <Box
		// 	key={`carousel${index}`}
		// 	sx={{
		// 		backgroundImage: `url(${item.image.src})`,
		// 		backgroundRepeat: "no-repeat",
		// 		backgroundPosition: "center",
		// 		backgroundSize: { xs: "cover", md: "auto" },
		// 		width: "100vw",
		// 		height: "60vh",
		// 		display: "flex"
		// 	}}>
		// 	<CarouselCardText>
		// 		<Typography variant="h4" component="h1" color="common.white">
		// 			{item.name}
		// 		</Typography>
		// 		<Typography variant="subtitle1" component="h2" color="common.white">
		// 			{item.description}
		// 		</Typography>
		// 		<Button className="CheckButton">Check it out!</Button>
		// 	</CarouselCardText>
		// </Box>
		<Grid container spacing={0}  height={600} key={`carousel${index}`}>
			<Grid item xs={5} alignSelf={"center"}>
				<CardContent sx={{ p: 8, maxWidth: 500}}>
					<Typography variant="h4" component="h1" paddingBottom={2}>
						{item.name}
					</Typography>
					<Typography variant="subtitle1" component="h2" paddingBottom={2}>
		 			{item.description}
					</Typography>
		 			{item.action}
				</CardContent>
			</Grid>
			<Grid item xs={7}>
				<Image width={1500} height={600} src={item.image.src} alt="" style={{ maxWidth: "70dvw", objectFit: "contain"}} priority/>
			</Grid>
		</Grid>
	);
};

// const CarouselCardText = styled("div")(
// 	({ theme }) => `
//   background-color:rgba(0,0,0,.3);
//   align-self: end;
//   width: 100vw;
//   ${theme.breakpoints.down("md")} {  
//     padding: ${theme.spacing(2)};
//     height: 12rem;
//   }
//   ${theme.breakpoints.up("md")} {
//     padding: ${theme.spacing(8)};
//     height: 22rem;
//   }
// `
// );

type CarouselCardProps = {
  index: string;
  item: CarouselItem;
};

export default CarouselCard;
