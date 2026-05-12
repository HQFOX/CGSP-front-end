import { ReactElement, useState } from 'react';

import { Avatar, CardHeader } from '@mui/material';

import { StyledCard, Title } from '../..';
import { styles } from './styles';

export const HoverCard = ({
	title,
	color,
	icon,
	children
}: {
	title: ReactElement;
	color: string;
	icon: ReactElement;
	children: ReactElement;
}) => {
	const [hovered, setHovered] = useState(false);

	const handleMouseEnter = () => setHovered(true);
	const handleMouseLeave = () => setHovered(false);

	return (
		<StyledCard onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} variant="outlined">
			<CardHeader
				title={<Title component={'span'}>{title}</Title>}
				avatar={
					<Avatar
						className={styles.avatar}
						sx={{
							color: hovered ? 'white' : color,
							bgcolor: hovered ? color : 'white'
						}}>
						{icon}
					</Avatar>
				}
			/>
			{children}
		</StyledCard>
	);
};
