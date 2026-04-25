import { useRef } from 'react';

import { Media } from '../media';
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

	const indicatorTransform = vertical
		? `translateY(${currentIndex * THUMBNAIL_STEP}px)`
		: `translateX(${currentIndex * THUMBNAIL_STEP}px)`;

	return (
		<div className={vertical ? styles.galleryVertical : styles.gallery}>
			<div className={styles.galleryIndicator} style={{ transform: indicatorTransform }} />
			{images.map((image, index) => (
				<button
					key={image.filename}
					ref={(el) => {
						itemRefs.current[index] = el;
					}}
					className={styles.galleryItem}
					onClick={() => onSelectImage?.(index)}>
					<Media
						file={image}
						alt={`Thumbnail ${index + 1}`}
						fill
						className={styles.galleryImage}
						muted
					/>
				</button>
			))}
		</div>
	);
};
