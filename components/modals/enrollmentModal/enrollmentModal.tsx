import React from 'react';

import { Close } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';

import { EnrollmentForm } from '../../forms/EnrollmentForm';

export type EnrollmentModalProps = {
	open: boolean;
	handleEnrollmentModalClose: () => void;
	project: Project;
};

export const EnrollmentModal = ({
	open,
	handleEnrollmentModalClose,
	project
}: EnrollmentModalProps) => {
	return (
		<Dialog open={open} onClose={handleEnrollmentModalClose} maxWidth={false}>
			<IconButton
				aria-label="close"
				onClick={() => handleEnrollmentModalClose()}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8
				}}>
				<Close />
			</IconButton>
			<EnrollmentForm project={project} />
		</Dialog>
	);
};
