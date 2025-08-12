import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledCard = styled(Card)({
	':hover': {
		boxShadow: '5px 5px 8px 8px rgba(0,0,0,.09)'
	},
	borderColor: 'rgb(237, 237, 237)'
});
