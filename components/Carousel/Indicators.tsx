import { CircleIcon } from '@phosphor-icons/react';

import { CarouselProps } from './Carousel';
import { styles } from './styles';

export interface IndicatorsProps {
	currentIndex: number;
	images: CarouselProps['images'];
}

export const Indicators = ({ currentIndex, images }: IndicatorsProps) => {
	return (
		<div className={styles.indicators} aria-live="polite" aria-atomic="true">
			<span className={styles.srOnly}>{`Slide ${currentIndex + 1} of ${images.length}`}</span>
			{images.map((img, idx) => (
				<CircleIcon
					key={img.id}
					size={10}
					color={idx === currentIndex ? 'white' : 'rgba(175, 175, 175, 0.8)'}
					weight="fill"
					aria-hidden="true"
				/>
			))}
		</div>
	);
};
