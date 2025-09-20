import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import DevicesPage from './DevicesPage';
import AlarmsTable from './AlarmsTable';
import { Device } from '../../services/api';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedHierarchy, setSelectedHierarchy] = useState<any>(null);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setSelectedHierarchy(null);
    setActiveTab('Dashboard');
  };

  const handleHierarchySelect = (hierarchy: any) => {
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null);
    setActiveTab('Dashboard');
  };

  const handleInitialHierarchyLoad = (hierarchy: any) => {
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#1E1F2E]">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Switch content based on activeTab */}
      {activeTab === 'Dashboard' && (
        <div className="flex">
          <DashboardSidebar 
            onDeviceSelect={handleDeviceSelect}
            onHierarchySelect={handleHierarchySelect}
            onInitialHierarchyLoad={handleInitialHierarchyLoad}
            selectedDeviceId={selectedDevice?.id}
            selectedHierarchyId={selectedHierarchy?.id}
          />
          <DashboardContent 
            selectedDevice={selectedDevice} 
            selectedHierarchy={selectedHierarchy}
          />
        </div>
      )}
      
      {activeTab === 'Devices' && <DevicesPage />}
      
      {activeTab === 'Alarms' && (
        <div className="p-6 bg-[#1E1F2E] min-h-screen">
          <AlarmsTable />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;