import { getFileExtension } from '../forms/utils';

export interface AbstractFile {
	/** The name of the file, used as link to source */
	filename: string;
	/** The presigned link used to submit the file */
	link?: string;
	/** The original file object, exists if the file was uploaded locally */
	file?: File;
	error?: string;
}

const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv']);

const hasVideoExtension = (filename: string): boolean => {
	const ext = /\.[^.]+$/.exec(filename.toLowerCase());
	return ext !== null && VIDEO_EXTENSIONS.has(ext[0]);
};

export const isVideoFile = (file: AbstractFile): boolean => {
	if (file.file?.type.startsWith('video/')) {
		return true;
	}
	return hasVideoExtension(file.filename);
};

export const isVideoUrl = (src: string): boolean => {
	try {
		const { pathname } = new URL(src, 'http://x');
		return hasVideoExtension(pathname);
	} catch {
		return false;
	}
};

export const convertFileToAbstractFile = (file: File): AbstractFile => {
	return {
		filename: file.name,
		file: file
	};
};

export const getPresignedUrl = async (file: AbstractFile): Promise<AbstractFile> => {
	const values = {
		filename: file.filename,
		extension: getFileExtension(file.filename)
	};

	const jsonData = JSON.stringify(values);

	const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/file/url`;

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonData
	};

	const response = await fetch(endpoint, options);

	if (response.status == 200) {
		const result = (await response.json()) as AbstractFile;
		return { ...result, file: file.file };
	}
	return {
		...file,
		error: response.statusText
	};
};
