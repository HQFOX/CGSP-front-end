import React from 'react';

import { Launch } from '@mui/icons-material';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import router from 'next/router';

import { Carousel, StyledButton, Title } from '../../components';
import { formatDate } from '../../utils/utils';

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
			{post.files && post.files.length > 0 && (
				<div style={{ width: '100%', height: '60vh', position: 'relative' }}>
					<Carousel images={post.files} showGallery={false} autoSlide={false} />
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
