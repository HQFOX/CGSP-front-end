import { IconButton } from '@mui/material';
import { CaretLeftIcon, CaretRightIcon, XIcon } from '@phosphor-icons/react';

import { Media } from '../media';
import { CarouselProps } from './Carousel';
import { Indicators } from './Indicators';
import { styles } from './styles';

export interface CarouselCardProps {
	images: CarouselProps['images'];
	currentIndex: number;
	indicators?: boolean;
	handlePrevious?: () => void;
	handleNext?: () => void;
	toggleFullscreen?: () => void;
	handleClose?: () => void;
}

export const CarouselCard = ({
	images,
	currentIndex,
	indicators,
	handlePrevious,
	handleNext,
	toggleFullscreen,
	handleClose
}: CarouselCardProps) => {
	return (
		<section className={styles.root} aria-label="Image carousel" aria-roledescription="carousel">
			<button key={currentIndex} className={styles.imageWrapper} onClick={toggleFullscreen}>
				<Media
					file={images[currentIndex]}
					alt={`Slide ${currentIndex + 1} of ${images.length}`}
					fill
					controls
				/>
			</button>
			{handlePrevious && (
				<IconButton
					aria-label="previous image"
					className={styles.sideButton}
					onClick={handlePrevious}>
					<CaretLeftIcon aria-hidden="true" />
				</IconButton>
			)}

			{handleNext && (
				<IconButton aria-label="next image" className={styles.sideButton} onClick={handleNext}>
					<CaretRightIcon aria-hidden="true" />
				</IconButton>
			)}
			{indicators && <Indicators currentIndex={currentIndex} images={images} />}
			{handleClose && (
				<IconButton aria-label="close" className={styles.closeButton} onClick={handleClose}>
					<XIcon aria-hidden="true" />
				</IconButton>
			)}
		</section>
	);
};
