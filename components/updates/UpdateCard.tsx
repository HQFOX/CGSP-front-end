import React from 'react';

import { Launch } from '@mui/icons-material';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';

import { formatDate } from '../../utils/utils';
import { StyledButton } from '../Button';
import { Title } from '../Title';

const width = '40vw';

const UpdateCard = ({ post }: UpdateCardProps) => {
	const handleClick = (projectId?: string) => {
		projectId && router.push(`projects/${projectId}`);
	};

	return (
		<Paper
			id={`post-${post.id}`}
			sx={(theme) => ({
				[theme.breakpoints.up('md')]: { width: width },
				[theme.breakpoints.down('md')]: { width: '90vw' },
				border: '1px solid rgb(237, 237, 237)',
				boxShadow: 0
			})}>
			<Box sx={{ p: 4 }}>
				<Grid container justifyContent={'space-between'}>
					<Grid item>
						<Title variant={'h5'}>{post.title}</Title>
						{post.id}
					</Grid>
					<Grid item alignSelf={'end'}>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ textAlign: 'right', mt: 'auto' }}>
							{formatDate(post.createdOn)}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Divider sx={{ mb: 1 }} />
					</Grid>
					{post.project && (
						<Grid item>
							<Typography
								variant={'subtitle2'}
								component={'span'}
								color="text.secondary"
								style={{ paddingTop: '2px' }}>
								Sobre o projeto:
							</Typography>
							<StyledButton
								endIcon={<Launch />}
								onClick={() => handleClick(post.project?.projectId)}>
								{post.project?.title}
							</StyledButton>
						</Grid>
					)}
				</Grid>
			</Box>
			{post.files[0] && (
				<div style={{ width: '100%', height: '60vh', position: 'relative' }}>
					<Image
						src={`${process.env.NEXT_PUBLIC_S3_URL}${post.files[0].filename}`}
						alt={''}
						fill
						style={{ objectFit: 'cover' }}
					/>
				</div>
			)}
			<Box sx={{ p: 4 }}>
				<Typography variant="body2" color="text.secondary">
					{post.content}
				</Typography>
			</Box>
		</Paper>
	);
};

export default UpdateCard;

type UpdateCardProps = {
	post: Update;
};
