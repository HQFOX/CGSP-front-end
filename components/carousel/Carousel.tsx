import React from "react";
import Carousel from "react-material-ui-carousel";
import house from "../../public/house.jpg";
// import housebackground from "../../public/housebackground.png";
import carousel1 from "../../public/carousel1.jpg";
import carousel2 from "../../public/carousel2.jpg";
import carousel3 from "../../public/carousel3.jpg";
import CarouselCard from "./CarouselCard";
import theme from "../../theme";

const items = [
	{
		name: "Giraldo Sem Pavor Cooperativa de Construção e Habitação",
		description: "A desenhar e construir habitações para os seus sócios há mais de 40 anos.",
		image: carousel1
	},
	{
		name: "Atualizações",
		description: "Veja aqui as atualizações mais recentes sobre nós e os nossos projetos.",
		image: house
	},
	{
		name: "LOTEAMENTO MOINHO I - ÉVORA",
		description: "Veja aqui os detalhes sobre o nosso projeto mais recente.",
		image: carousel2
	},
	{
		name: "Histórico",
		description: "Saiba mais detalhes sobre projetos concluídos da nossa cooperativa.",
		image: carousel3
	}
];

const CGSPCarousel: React.FC = () => {
	return (
		<Carousel
			fullHeightHover
			indicatorContainerProps={{
				style: {
					marginTop: "1em"
				}
			}}
			autoPlay={false}
			activeIndicatorIconButtonProps={{
				style: {
					color: theme.palette.primary.main,
				}
			}}
		>
			{items.map((item, i) => (
				<CarouselCard key={i} index={`${i}`} item={item} />
			))}
		</Carousel>
	);
};

export default CGSPCarousel;
