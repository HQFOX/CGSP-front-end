export const formatDate = (value?: string) => {
	const date = value ? new Date(value) : undefined;
	return date && `${date?.getUTCDate()}/${date?.getUTCMonth() + 1}/${date?.getUTCFullYear()}`;
};
