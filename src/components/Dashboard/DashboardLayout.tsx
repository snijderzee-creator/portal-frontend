import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import { Device } from '../../services/api';
import NewDashboardHeader from './NewDashboardHeader';

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
    <div className="min-h-screen w-full bg-[#2B2D42]">
      <NewDashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex">
        <DashboardSidebar 
          onDeviceSelect={handleDeviceSelect}
          onHierarchySelect={handleHierarchySelect}
          onInitialHierarchyLoad={handleInitialHierarchyLoad}
          selectedDeviceId={selectedDevice?.id}
          selectedHierarchyId={selectedHierarchy?.id}
        />

        {/* Switch content based on activeTab */}
        <div className="flex-1">
          <DashboardContent 
            selectedDevice={selectedDevice} 
            selectedHierarchy={selectedHierarchy}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;