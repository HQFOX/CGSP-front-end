import { css } from '@emotion/css';

import theme from '../../../theme';

export const styles = {
	mapContainer: css({
		height: 480,
		position: 'relative',
		paddingTop: theme.spacing(2)
	}),
	mapLoadingOverlay: css({
		position: 'absolute',
		inset: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1000
	})
};
