import React from 'react';

import { Stack } from '@mui/material';

import UpdateCard from './UpdateCard';

const Updates = ({ updates }: { updates?: Update[] }) => {
	return (
		<Stack spacing={10} sx={{ pt: 10, pb: 10 }}>
			{updates?.map((item) => (
				<UpdateCard key={item.id} post={item} />
			))}
		</Stack>
	);
};

export default Updates;
