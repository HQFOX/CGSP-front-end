import { AbstractFile } from "./types";

export const submitFile = async (file : AbstractFile) => {

	const endpoint = file.link ?? "";

	const options = {
		method: "PUT",
		headers: {
			"Content-Type": file.file?.type ?? "",
		},
		body: file.file
	};

	return fetch(endpoint, options).then( response => {
		if (response.ok) {
			return true;
		}
		throw new Error("Error submitting File:" + file.filename);
	});
};

const getFileExtension = (filename: string) => {
	return filename.substring(filename.lastIndexOf("."), filename.length) || filename;
};

export const getPresignedUrl = async (file: File) => {

	const values = {
		filename: file.name,
		extension: getFileExtension(file.name),
	};

	const jsonData = JSON.stringify(values);

	const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/file/url`;

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: jsonData
	};

	const response = await fetch(endpoint, options);

	if (response.status == 200) {
		const result = (await response.json()) as AbstractFile;
		result.file = file;
		console.log(result);
		return result;
	}
};

