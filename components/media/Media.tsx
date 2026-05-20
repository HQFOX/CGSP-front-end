import Image from 'next/image';

import { AbstractFile, isVideoFile, isVideoUrl } from '../FileUploader/utils';
import { getS3Url } from '../../utils/utils';

interface MediaBaseProps {
	file: AbstractFile;
	alt?: string;
	style?: React.CSSProperties;
	className?: string;
	/** Video-only: show browser controls. Defaults to false. */
	controls?: boolean;
	/** Video-only: mute the video. Defaults to true. */
	muted?: boolean;
	/** Video-only: auto-play the video. Defaults to false. */
	autoPlay?: boolean;
}

type MediaFillProps = MediaBaseProps & {
	fill: true;
	width?: never;
	height?: never;
};

type MediaSizedProps = MediaBaseProps & {
	fill?: false;
	width: number;
	height: number;
};

export type MediaProps = MediaFillProps | MediaSizedProps;

/**
 * Renders a `next/image` Image or a native `<video>` depending on the `src` URL extension.
 * Props mirror the next/image interface so the same styles work for both.
 */
export const Media = ({
	file,
	alt = '',
	style,
	className,
	controls,
	muted = true,
	autoPlay,
	...rest
}: MediaProps) => {
	/** Check to see if tit is a local file */
	const source = file.file
		? URL.createObjectURL(file.file)
		: getS3Url(file.filename);

	const isVideo = file.file ? isVideoFile(file) : isVideoUrl(source);

	if (isVideo) {
		const { fill, width, height } = rest as { fill?: boolean; width?: number; height?: number };

		const videoStyle: React.CSSProperties = fill
			? { width: '100%', height: '100%', ...style }
			: (style ?? {});

		return (
			<video
				src={source}
				aria-label={alt}
				controls={controls}
				muted={muted}
				autoPlay={autoPlay}
				width={fill ? undefined : width}
				height={fill ? undefined : height}
				className={className}
				style={videoStyle}>
				<track kind="captions" />
			</video>
		);
	}

	if ('fill' in rest && rest.fill) {
		return <Image src={source} alt={alt} fill style={style} className={className} />;
	}

	const { width, height } = rest as { width: number; height: number };
	return (
		<Image
			src={source}
			alt={alt}
			width={width}
			height={height}
			style={style}
			className={className}
		/>
	);
};
