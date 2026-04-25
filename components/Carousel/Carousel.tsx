import { useEffect, useState } from 'react';

import { cx } from '@emotion/css';
import { Dialog } from '@mui/material';

import { AbstractFile } from '../FileUploader/utils';
import { CarouselCard, CarouselCardProps } from './CarouselCard';
import { Gallery } from './Gallery';
import { styles } from './styles';

export interface CarouselProps {
	images: AbstractFile[];
	vertical?: boolean;
	autoSlide?: boolean;
	showGallery?: boolean;
}

export const Carousel = (props: CarouselProps) => {
	const { images, vertical, autoSlide = false } = props;
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const onlyImage = images.length === 1;

	useEffect(() => {
		if (!autoSlide || onlyImage) return;

		const interval = setInterval(() => {
			setCurrentIndex((currentIndex) => (currentIndex + 1) % images.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [autoSlide, images.length, onlyImage]);

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

	const commonProps: CarouselCardProps = {
		images: images,
		currentIndex: currentIndex,
		...(onlyImage ? { indicators: false } : { indicators: true, handleNext, handlePrevious })
	};

	return (
		<div className={cx(styles.carouselWrapper, vertical && styles.carouselWrapperVertical)}>
			<div className={cx(styles.carouselContent, vertical && styles.carouselContentVertical)}>
				<CarouselCard {...commonProps} toggleFullscreen={toggleFullscreen} />
			</div>
			{props.showGallery && (
				<Gallery
					images={images}
					currentIndex={currentIndex}
					onSelectImage={setCurrentIndex}
					vertical={vertical}
				/>
			)}
			<Dialog open={isFullscreen} onClose={() => setIsFullscreen(false)} fullScreen>
				<CarouselCard {...commonProps} handleClose={() => setIsFullscreen(false)} />
			</Dialog>
		</div>
	);
};
