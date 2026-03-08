import { css } from '@emotion/css';

import theme from '../../theme';

export const styles = {
	container: css({
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		borderWidth: 2,
		borderRadius: 2,
		borderColor: theme.palette.primary.main,
		borderStyle: 'dashed',
		backgroundColor: '#fafafa',
		color: theme.palette.text.secondary,
		minHeight: 150
	}),
	highlight: css({
		borderColor: theme.palette.primary.light,
		backgroundColor: theme.palette.secondary.light
	})
};
