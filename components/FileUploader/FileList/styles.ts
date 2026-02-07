import { css } from '@emotion/css';

import theme from '../../../theme';

export const styles = {
	container: css({
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(2)
	}),
	listItem: css({
		display: 'flex',
		flexDirection: 'row',
		gap: theme.spacing(2),
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: theme.shape.borderRadius,
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		alignItems: 'center',
		color: theme.palette.text.secondary
	}),
	itemActions: css({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 'auto',
		fontSize: '24px',
		gap: theme.spacing(1)
	})
};
