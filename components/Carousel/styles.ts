import { css } from '@emotion/css';

import theme from '../../theme';

export const styles = {
	root: css({
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'relative',
		padding: theme.spacing(1)
	}),
	imageWrapper: css({
		position: 'absolute',
		inset: 0,
		animation: 'fadeIn 0.3s ease-in-out',
		'@keyframes fadeIn': {
			from: { opacity: 0.8 },
			to: { opacity: 1 }
		},
		borderRadius: 8,
		border: 0
	}),
	sideButton: css({
		zIndex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
			color: theme.palette.primary.main
		}
	}),
	indicators: css({
		zIndex: 1,
		position: 'absolute',
		bottom: 0,
		display: 'flex',
		width: '100%',
		height: 40,
		justifyContent: 'center',
		gap: 3
	}),
	srOnly: css({
		position: 'absolute',
		width: 1,
		height: 1,
		overflow: 'hidden',
		clip: 'rect(0, 0, 0, 0)',
		whiteSpace: 'nowrap'
	}),
	closeButton: css({
		position: 'absolute',
		top: theme.spacing(2),
		right: theme.spacing(2),
		zIndex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
			color: theme.palette.primary.main
		}
	}),
	gallery: css({
		width: '100%',
		height: 'auto',
		display: 'flex',
		flexWrap: 'nowrap',
		gap: theme.spacing(1),
		overflowX: 'auto',
		padding: theme.spacing(1, 1, 1.5, 1),
		position: 'relative'
	}),
	galleryVertical: css({
		height: '100%',
		width: 'auto',
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'nowrap',
		gap: theme.spacing(1),
		overflowY: 'auto',
		overflowX: 'hidden',
		padding: theme.spacing(1, 1.5, 1, 1),
		position: 'relative'
	}),
	galleryItem: css({
		width: '80px',
		height: '80px',
		flexShrink: 0,
		cursor: 'pointer',
		position: 'relative',
		borderRadius: 8,
		border: '2px solid transparent'
	}),
	galleryIndicator: css({
		position: 'absolute',
		width: '80px',
		height: '80px',
		border: `2px solid ${theme.palette.primary.main}`,
		borderRadius: 8,
		zIndex: 1,
		transition: 'transform 0.3s ease'
	}),
	galleryImage: css({
		objectFit: 'cover',
		borderRadius: 6
	})
};
