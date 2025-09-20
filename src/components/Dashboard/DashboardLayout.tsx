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
  const [activeTab, setActiveTab] = useState('Dashboard'); // <-- moved here
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedHierarchy, setSelectedHierarchy] = useState<any>(null);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setSelectedHierarchy(null); // Clear hierarchy selection when device is selected
    // Stay on Dashboard tab when a device is selected to show charts
    setActiveTab('Dashboard');
  };

  const handleHierarchySelect = (hierarchy: any) => {
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null); // Clear device selection when hierarchy is selected
    // Stay on Dashboard tab when a hierarchy is selected to show charts
    setActiveTab('Dashboard');
  };

  const handleInitialHierarchyLoad = (hierarchy: any) => {
    // Auto-select the first hierarchy for initial chart loading
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null);
  };

  return (
    <div
      className={`min-h-screen w-full ${
        theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'
      }`}
    >
      {/* Pass state + setter to header */}
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
        <div className="flex-1 p-6">
          {activeTab === 'Dashboard' && (
            <DashboardContent 
              selectedDevice={selectedDevice} 
              selectedHierarchy={selectedHierarchy}
            />
          )}
          {activeTab === 'Alarms' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Alarms & Notifications
              </h2>
              <AlarmsTable />
            </div>
          )}
          {activeTab === 'Devices' && <DevicesPage />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
