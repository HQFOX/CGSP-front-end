import { getFileExtension } from '../forms/utils';

export interface AbstractFile {
	filename: string;
	link?: string;
	file?: File;
	error?: string;
}

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
