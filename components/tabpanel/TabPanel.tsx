import React from 'react';

type TabPanelProps = {
	children?: React.ReactNode;
	index: number;
	value: number;
};

export const TabPanel = ({ children, index, value }: TabPanelProps) => {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tab-panel-${index}`}
			style={{ width: '100%' }}>
			{children}
		</div>
	);
};

export default TabPanel;
