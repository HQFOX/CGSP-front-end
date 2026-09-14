import Cookies from 'js-cookie';

export const customFetch = async <T>(
	url: string,
	options: RequestInit,
	auth: boolean = false
): Promise<T> => {
	// Cast headers to Record<string, string> to allow dynamic addition of Authorization header
	const initialHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>) // Type assertion for merging existing headers
	};

	let finalHeaders: Record<string, string> = { ...initialHeaders };

	if (auth) {
		const token = Cookies.get('cgsptoken');
		if (token) {
			finalHeaders['Authorization'] = `Bearer ${token}`;
		} else {
			throw new Error('Authentication token not found.');
		}
	}

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
		...options,
		headers: finalHeaders as HeadersInit // Cast back to HeadersInit for the fetch call
	});

	if (!response.ok) {
		throw new Error(`API error: ${response.status}`);
	}

	return response.json();
};
