import React from 'react';

import styled from '@emotion/styled';
import { ExpandLess } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Menu, MenuItem } from '@mui/material';

type DropdownProps = {
	options: string[];
	displayValue: string;
	label: string;
	valueChange: (value: string) => void;
};

const StyledButton = styled(Button)({
	textTransform: 'none'
});

const Dropdown = ({ options, displayValue, label, valueChange }: DropdownProps) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (option?: string) => {
		if (option) {
			valueChange(option);
		}
		setAnchorEl(null);
	};

	return (
		<>
			<StyledButton
				id={label + 'dropdown'}
				aria-haspopup="true"
				onClick={handleClick}
				endIcon={open ? <ExpandLess /> : <ExpandMoreIcon />}
				variant="outlined">
				{displayValue}
			</StyledButton>
			<Menu
				id={label + 'menu'}
				anchorEl={anchorEl}
				open={open}
				onClose={() => handleClose()}
				MenuListProps={{
					'aria-labelledby': label
				}}>
				{options?.map((option, index) => (
					<MenuItem key={index} onClick={() => handleClose(option)}>
						{option}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default Dropdown;
