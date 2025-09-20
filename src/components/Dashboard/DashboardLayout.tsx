import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import AlarmsTable from './AlarmsTable';
import { Device } from '../../services/api';

import DevicesPage from '../DevicesPage';

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
          {activeTab === 'Dashboard' && (
            <DashboardContent 
              selectedDevice={selectedDevice} 
              selectedHierarchy={selectedHierarchy}
            />
          )}
          {activeTab === 'Alarms' && (
            <div className="p-6 bg-[#1E1F2E] min-h-screen">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  Alarms & Notifications
                </h2>
                <AlarmsTable />
              </div>
            </div>
          )}
          {activeTab === 'Devices' && (
            <div className="p-6 bg-[#1E1F2E] min-h-screen">
              <DevicesPage />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;