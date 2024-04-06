
export const formatDate = (value?: string) => {
	const date = value ? new Date(value) : undefined;
	return date && `${date?.getUTCDate()}/${date?.getUTCMonth()}/${date?.getUTCFullYear()}`;
};