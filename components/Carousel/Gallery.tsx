import { useEffect, useRef } from 'react';

import Image from 'next/image';

import { CarouselProps } from './Carousel';
import { styles } from './styles';

const THUMBNAIL_SIZE = 80;
const THUMBNAIL_GAP = 8; // theme.spacing(1)
const THUMBNAIL_STEP = THUMBNAIL_SIZE + THUMBNAIL_GAP;

export const Gallery = ({
	images,
	currentIndex,
	onSelectImage,
	vertical
}: {
	images: CarouselProps['images'];
	currentIndex: number;
	onSelectImage?: (index: number) => void;
	vertical?: boolean;
}) => {
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		itemRefs.current[currentIndex]?.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'nearest'
		});
	}, [currentIndex]);

	const indicatorTransform = vertical
		? `translateY(${currentIndex * THUMBNAIL_STEP}px)`
		: `translateX(${currentIndex * THUMBNAIL_STEP}px)`;

	return (
		<div className={vertical ? styles.galleryVertical : styles.gallery}>
			<div className={styles.galleryIndicator} style={{ transform: indicatorTransform }} />
			{images.map((image, index) => (
				<button
					key={image.id}
					ref={(el) => {
						itemRefs.current[index] = el;
					}}
					className={styles.galleryItem}
					onClick={() => onSelectImage?.(index)}>
					<Image
						className={styles.galleryImage}
						src={image.url}
						alt={`Thumbnail ${index + 1}`}
						fill
					/>
				</button>
			))}
		</div>
	);
};
