import { css } from '@emotion/css';
import { Button, ButtonProps } from '@mui/material';

const styles = {
	button: css({
		textTransform: 'capitalize'
	})
};

export const StyledButton = (props: ButtonProps) => {
	return <Button {...props} className={styles.button} />;
};
