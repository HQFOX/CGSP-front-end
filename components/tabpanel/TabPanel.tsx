type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export const TabPanel = ({ children, index, value }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tab-panel-${index}`}>
      {children}
    </div>
  );
};

export default TabPanel;
