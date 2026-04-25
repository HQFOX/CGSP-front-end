import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { render } from '@testing-library/react';

import type { AbstractFile } from '../FileUploader/utils';
import { Media } from './Media';

const S3_URL = 'https://s3.example.com/';

const remoteVideo: AbstractFile = { filename: 'clip.mp4' };
const remoteImage: AbstractFile = { filename: 'photo.jpg' };

describe('Media', () => {
	beforeAll(() => {
		process.env.NEXT_PUBLIC_S3_URL = S3_URL;
		// Return a URL that preserves the filename so isVideoUrl can detect the extension
		vi.spyOn(URL, 'createObjectURL').mockImplementation(
			(obj) => `http://blob/${(obj as File).name}`
		);
	});

	afterAll(() => {
		vi.restoreAllMocks();
		delete process.env.NEXT_PUBLIC_S3_URL;
	});

	describe('remote video file', () => {
		it('renders a <video> element, not an <img>', () => {
			const { container } = render(<Media file={remoteVideo} width={320} height={240} />);
			expect(container.querySelector('video')).not.toBeNull();
			expect(container.querySelector('img')).toBeNull();
		});

		it('sets aria-label from the alt prop', () => {
			const { container } = render(
				<Media file={remoteVideo} alt="my video" width={320} height={240} />
			);
			expect(container.querySelector('video')?.getAttribute('aria-label')).toBe('my video');
		});

		it('includes a <track kind="captions" /> child', () => {
			const { container } = render(<Media file={remoteVideo} width={320} height={240} />);
			const track = container.querySelector('track');
			expect(track).not.toBeNull();
			expect(track?.getAttribute('kind')).toBe('captions');
		});

		it('applies the controls attribute when controls={true}', () => {
			const { container } = render(<Media file={remoteVideo} controls width={320} height={240} />);
			expect(container.querySelector('video')?.hasAttribute('controls')).toBe(true);
		});

		it('does not apply controls by default', () => {
			const { container } = render(<Media file={remoteVideo} width={320} height={240} />);
			expect(container.querySelector('video')?.hasAttribute('controls')).toBe(false);
		});

		it('defaults muted to true', () => {
			const { container } = render(<Media file={remoteVideo} width={320} height={240} />);
			expect((container.querySelector('video') as HTMLVideoElement).muted).toBe(true);
		});

		it('respects explicit muted={false}', () => {
			const { container } = render(
				<Media file={remoteVideo} muted={false} width={320} height={240} />
			);
			expect((container.querySelector('video') as HTMLVideoElement).muted).toBe(false);
		});

		it('applies autoPlay when provided', () => {
			const { container } = render(<Media file={remoteVideo} autoPlay width={320} height={240} />);
			expect(container.querySelector('video')?.hasAttribute('autoplay')).toBe(true);
		});

		it('fill mode: applies width and height 100% style', () => {
			const { container } = render(<Media file={remoteVideo} fill />);
			const video = container.querySelector('video') as HTMLVideoElement;
			expect(video.style.width).toBe('100%');
			expect(video.style.height).toBe('100%');
		});

		it('fill mode: merges additional style on top of fill defaults', () => {
			const { container } = render(
				<Media file={remoteVideo} fill style={{ objectFit: 'cover' }} />
			);
			const video = container.querySelector('video') as HTMLVideoElement;
			expect(video.style.width).toBe('100%');
			expect(video.style.height).toBe('100%');
			expect(video.style.objectFit).toBe('cover');
		});

		it('sized mode: passes width and height attributes', () => {
			const { container } = render(<Media file={remoteVideo} width={640} height={480} />);
			const video = container.querySelector('video') as HTMLVideoElement;
			expect(video.getAttribute('width')).toBe('640');
			expect(video.getAttribute('height')).toBe('480');
		});

		it('forwards className to the <video> element', () => {
			const { container } = render(
				<Media file={remoteVideo} className="my-class" width={320} height={240} />
			);
			expect(container.querySelector('video')?.classList.contains('my-class')).toBe(true);
		});

		it('uses NEXT_PUBLIC_S3_URL + filename as src', () => {
			const { container } = render(<Media file={remoteVideo} width={320} height={240} />);
			expect(container.querySelector('video')?.getAttribute('src')).toBe(
				`${S3_URL}${remoteVideo.filename}`
			);
		});
	});

	describe('remote image file', () => {
		it('renders an <img> element, not a <video>', () => {
			const { container } = render(<Media file={remoteImage} width={320} height={240} />);
			expect(container.querySelector('img')).not.toBeNull();
			expect(container.querySelector('video')).toBeNull();
		});

		it('passes alt to the <img>', () => {
			const { container } = render(
				<Media file={remoteImage} alt="a photo" width={320} height={240} />
			);
			expect(container.querySelector('img')?.getAttribute('alt')).toBe('a photo');
		});

		it('defaults alt to empty string', () => {
			const { container } = render(<Media file={remoteImage} width={320} height={240} />);
			expect(container.querySelector('img')?.getAttribute('alt')).toBe('');
		});

		it('sized mode: passes width and height', () => {
			const { container } = render(<Media file={remoteImage} width={800} height={600} />);
			const img = container.querySelector('img');
			expect(img?.getAttribute('width')).toBe('800');
			expect(img?.getAttribute('height')).toBe('600');
		});

		it('fill mode: does not set explicit width or height attributes', () => {
			const { container } = render(<Media file={remoteImage} fill />);
			const img = container.querySelector('img');
			expect(img?.getAttribute('width')).toBeNull();
			expect(img?.getAttribute('height')).toBeNull();
		});

		it('forwards className to the <img>', () => {
			const { container } = render(
				<Media file={remoteImage} className="img-class" width={320} height={240} />
			);
			expect(container.querySelector('img')?.classList.contains('img-class')).toBe(true);
		});

		it('forwards style to the <img>', () => {
			const { container } = render(
				<Media file={remoteImage} style={{ borderRadius: '8px' }} width={320} height={240} />
			);
			expect((container.querySelector('img') as HTMLImageElement).style.borderRadius).toBe('8px');
		});

		it('uses NEXT_PUBLIC_S3_URL + filename as src', () => {
			const { container } = render(<Media file={remoteImage} width={320} height={240} />);
			expect(container.querySelector('img')?.getAttribute('src')).toBe(
				`${S3_URL}${remoteImage.filename}`
			);
		});
	});

	describe('local file (file.file present)', () => {
		it('calls URL.createObjectURL with the File object', () => {
			const localFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
			const abstractFile: AbstractFile = { filename: 'photo.jpg', file: localFile };
			render(<Media file={abstractFile} width={320} height={240} />);
			expect(URL.createObjectURL).toHaveBeenCalledWith(localFile);
		});

		it('local image file renders as <img>', () => {
			const localFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
			const abstractFile: AbstractFile = { filename: 'photo.jpg', file: localFile };
			const { container } = render(<Media file={abstractFile} width={320} height={240} />);
			expect(container.querySelector('img')).not.toBeNull();
			expect(container.querySelector('video')).toBeNull();
		});

		it('local video file renders as <video>', () => {
			const localFile = new File([''], 'clip.mp4', { type: 'video/mp4' });
			const abstractFile: AbstractFile = { filename: 'clip.mp4', file: localFile };
			const { container } = render(<Media file={abstractFile} width={320} height={240} />);
			expect(container.querySelector('video')).not.toBeNull();
			expect(container.querySelector('img')).toBeNull();
		});
	});
});
