import { useEffect, useState } from 'react';

import { Dialog } from '@mui/material';

import { CarouselCard } from './CarouselCard';
import { Gallery } from './Gallery';

export interface CarouselProps {
	images: { id: string | number; url: string }[];
	vertical?: boolean;
	autoSlide?: boolean;
}

export const Carousel = (props: CarouselProps) => {
	const { images, vertical, autoSlide = false } = props;
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);

	useEffect(() => {
		if (!autoSlide) return;

		const interval = setInterval(() => {
			setCurrentIndex((currentIndex) => (currentIndex + 1) % images.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [autoSlide, images.length]);

	const handleNext = () => {
		setCurrentIndex((currentIndex + 1) % images.length);
	};

	const handlePrevious = () => {
		currentIndex <= 0
			? setCurrentIndex(images.length - 1)
			: setCurrentIndex((currentIndex - 1) % images.length);
	};

	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: vertical ? 'row' : 'column',
				alignItems: 'center',
				width: '100%',
				height: '100%'
			}}>
			<div
				style={{
					flex: 1,
					minHeight: 0,
					width: vertical ? 'inherit' : '100%',
					height: vertical ? '100%' : 'inherit'
				}}>
				<CarouselCard
					images={images}
					currentIndex={currentIndex}
					indicators
					handleNext={handleNext}
					handlePrevious={handlePrevious}
					toggleFullscreen={toggleFullscreen}
				/>
			</div>
			<Gallery
				images={images}
				currentIndex={currentIndex}
				onSelectImage={setCurrentIndex}
				vertical={vertical}
			/>
			<Dialog open={isFullscreen} onClose={() => setIsFullscreen(false)} fullScreen>
				<CarouselCard
					images={images}
					currentIndex={currentIndex}
					handleNext={handleNext}
					handlePrevious={handlePrevious}
					handleClose={() => setIsFullscreen(false)}
					indicators
				/>
			</Dialog>
		</div>
	);
};
