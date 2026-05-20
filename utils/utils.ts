export const formatDate = (value?: string) => {
	const date = value ? new Date(value) : undefined;
	return date && `${date?.getUTCDate()}/${date?.getUTCMonth() + 1}/${date?.getUTCFullYear()}`;
};

export const getS3Url = (filename: string): string => {
	if (filename.startsWith('http://') || filename.startsWith('https://')) {
		return filename;
	}
	return `${process.env.NEXT_PUBLIC_S3_URL}${filename}`;
};
