import { css } from '@emotion/css';

import theme from '../../../theme';

export const styles = {
	root: css({
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		padding: theme.spacing(2)
	}),
	item: css({
		[theme.breakpoints.down('md')]: {
			textAlign: 'center'
		}
	})
};
