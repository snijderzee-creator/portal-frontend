import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import MetricsCards from './MetricsCards';
import MapAndChart from './MapAndChart';
import AlarmsTable from './AlarmsTable';

interface DashboardContentProps {
  children?: React.ReactNode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="flex-1 p-2">
      {children || (
        <>
          <MetricsCards />
          <MapAndChart />
          <AlarmsTable />
        </>
      )}
    </div>
  );
};

export default DashboardContent;